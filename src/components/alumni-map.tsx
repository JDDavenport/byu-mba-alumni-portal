"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  alumni as staticAlumni,
  getUniqueIndustries,
  type Alumni,
} from "@/data/alumni";

const ALL = "__all__";

const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

function alumniToGeoJSON(data: Alumni[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: data
      .filter((a) => a.lat != null && a.lng != null)
      .map((a) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [a.lng, a.lat],
        },
        properties: {
          id: a.id,
          name: a.name,
          title: a.title,
          company: a.company,
          graduationYear: a.graduationYear,
          industry: a.industry,
          city: a.city,
          state: a.state,
        },
      })),
  };
}

export function AlumniMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [industry, setIndustry] = useState(ALL);
  const [yearRange, setYearRange] = useState(ALL);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [alumni, setAlumni] = useState<Alumni[]>(staticAlumni);
  const [useApi, setUseApi] = useState(true);

  const industries = useMemo(() => getUniqueIndustries(), []);

  // Fetch alumni from API (falls back to static data on failure)
  const fetchAlumni = useCallback(async () => {
    if (!useApi) return;
    try {
      const params = new URLSearchParams();
      if (industry !== ALL) params.set("industry", industry);
      if (yearRange !== ALL) {
        const [min, max] = yearRange.split("-");
        params.set("year_min", min);
        params.set("year_max", max);
      }
      // Request a large page for map (we want all points)
      params.set("page_size", "5000");

      const res = await fetch(`/api/alumni?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAlumni(data);
        return;
      }
    } catch {
      // Network/API error — fall back to static
    }
    setUseApi(false);
  }, [industry, yearRange, useApi]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const filtered = useMemo(() => {
    // If using API, data is already filtered server-side
    if (useApi) return alumni;

    return staticAlumni.filter((a) => {
      if (industry !== ALL && a.industry !== industry) return false;
      if (yearRange !== ALL) {
        const [min, max] = yearRange.split("-").map(Number);
        if (a.graduationYear < min || a.graduationYear > max) return false;
      }
      return true;
    });
  }, [alumni, useApi, industry, yearRange]);

  const geojson = useMemo(() => alumniToGeoJSON(filtered), [filtered]);

  const set = (setter: (v: string) => void) => (v: string | null) =>
    setter(v ?? ALL);

  const hasFilters = industry !== ALL || yearRange !== ALL;

  function handleReset() {
    setIndustry(ALL);
    setYearRange(ALL);
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URL,
      center: [-98.5, 39.8],
      zoom: 3.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.on("load", () => {
      // Add source with clustering
      map.addSource("alumni", {
        type: "geojson",
        data: alumniToGeoJSON(alumni),
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circle layer
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "alumni",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#002E5D",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            5,
            24,
            10,
            30,
            25,
            36,
          ],
          "circle-opacity": 0.85,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Cluster count label
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "alumni",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 13,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Individual point layer
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "alumni",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#002E5D",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      setMapLoaded(true);
    });

    // Click cluster to zoom
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      if (!features.length) return;
      const clusterId = features[0].properties.cluster_id;
      const source = map.getSource("alumni") as maplibregl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId).then((zoom) => {
        const geom = features[0].geometry;
        if (geom.type === "Point") {
          map.easeTo({
            center: geom.coordinates as [number, number],
            zoom: zoom,
          });
        }
      });
    });

    // Click individual point for popup
    map.on("click", "unclustered-point", (e) => {
      if (!e.features || !e.features.length) return;
      const props = e.features[0].properties;
      const geom = e.features[0].geometry;
      if (geom.type !== "Point") return;
      const coordinates = geom.coordinates.slice() as [number, number];

      // Ensure popup is positioned correctly when map is wrapped
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      if (popupRef.current) popupRef.current.remove();

      const popup = new maplibregl.Popup({
        offset: 12,
        maxWidth: "280px",
        closeButton: true,
      })
        .setLngLat(coordinates)
        .setHTML(
          `<div style="font-family: var(--font-geist-sans), system-ui, sans-serif;">
            <p style="font-weight:600;color:#002E5D;margin:0 0 4px;font-size:14px;">${props.name}</p>
            <p style="margin:0 0 2px;font-size:13px;color:#374151;">${props.title}</p>
            <p style="margin:0 0 2px;font-size:13px;color:#374151;">${props.company}</p>
            <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">${props.city}, ${props.state} &middot; Class of ${props.graduationYear}</p>
            <a href="/alumni/${props.id}" style="font-size:13px;color:#002E5D;text-decoration:underline;">View Profile &rarr;</a>
          </div>`
        )
        .addTo(map);

      popupRef.current = popup;
    });

    // Cursor changes
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update source data when filters change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const source = mapRef.current.getSource("alumni") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    }
  }, [geojson, mapLoaded]);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
      {/* Filter bar */}
      <div className="absolute left-0 right-0 top-0 z-10 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
          <span className="text-sm font-medium text-gray-700">
            {filtered.length} alumni
          </span>

          <Select value={industry} onValueChange={set(setIndustry)}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Industries</SelectItem>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearRange} onValueChange={set(setYearRange)}>
            <SelectTrigger className="w-[130px] sm:w-[160px]">
              <SelectValue placeholder="Grad Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Years</SelectItem>
              <SelectItem value="2020-2025">2020 - 2025</SelectItem>
              <SelectItem value="2015-2019">2015 - 2019</SelectItem>
              <SelectItem value="2010-2014">2010 - 2014</SelectItem>
              <SelectItem value="2000-2009">2000 - 2009</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="flex-1" />
    </div>
  );
}
