"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlumniCard } from "@/components/alumni-card";
import {
  alumni as staticAlumni,
  getUniqueIndustries,
  getUniqueCompanies,
  getUniqueCities,
  type Alumni,
} from "@/data/alumni";

const ALL = "__all__";

export function DirectoryFilters() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState(ALL);
  const [company, setCompany] = useState(ALL);
  const [city, setCity] = useState(ALL);
  const [yearRange, setYearRange] = useState(ALL);
  const [alumni, setAlumni] = useState<Alumni[]>(staticAlumni);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);

  const industries = useMemo(() => getUniqueIndustries(), []);
  const companies = useMemo(() => getUniqueCompanies(), []);
  const cities = useMemo(() => getUniqueCities(), []);

  const set = (setter: (v: string) => void) => (v: string | null) =>
    setter(v ?? ALL);

  // Fetch from API when filters change
  const fetchAlumni = useCallback(async () => {
    if (!useApi) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (industry !== ALL) params.set("industry", industry);
      if (company !== ALL) params.set("company", company);
      if (city !== ALL) params.set("city", city);
      if (yearRange !== ALL) {
        const [min, max] = yearRange.split("-");
        params.set("year_min", min);
        params.set("year_max", max);
      }

      const res = await fetch(`/api/alumni?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAlumni(data);
      } else {
        // API returned error — fall back to static filtering
        setUseApi(false);
      }
    } catch {
      // Network error — fall back to static filtering
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  }, [search, industry, company, city, yearRange, useApi]);

  // Debounce the API calls
  useEffect(() => {
    const timer = setTimeout(fetchAlumni, 300);
    return () => clearTimeout(timer);
  }, [fetchAlumni]);

  // Static fallback filtering
  const filtered = useMemo(() => {
    if (useApi) return alumni;

    return staticAlumni.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          a.name.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (industry !== ALL && a.industry !== industry) return false;
      if (company !== ALL && a.company !== company) return false;
      if (city !== ALL && `${a.city}, ${a.state}` !== city) return false;
      if (yearRange !== ALL) {
        const [min, max] = yearRange.split("-").map(Number);
        if (a.graduationYear < min || a.graduationYear > max) return false;
      }
      return true;
    });
  }, [alumni, useApi, search, industry, company, city, yearRange]);

  function handleReset() {
    setSearch("");
    setIndustry(ALL);
    setCompany(ALL);
    setCity(ALL);
    setYearRange(ALL);
  }

  const hasFilters =
    search ||
    industry !== ALL ||
    company !== ALL ||
    city !== ALL ||
    yearRange !== ALL;

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Search name, company, title, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:col-span-2 lg:col-span-1"
        />
        <Select value={industry} onValueChange={set(setIndustry)}>
          <SelectTrigger>
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
        <Select value={company} onValueChange={set(setCompany)}>
          <SelectTrigger>
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={set(setCity)}>
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={yearRange} onValueChange={set(setYearRange)}>
          <SelectTrigger>
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
      </div>

      {/* Results count + reset */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? (
            "Loading..."
          ) : (
            <>
              {filtered.length} alumni found
            </>
          )}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border bg-gray-100"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-900">No alumni found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
