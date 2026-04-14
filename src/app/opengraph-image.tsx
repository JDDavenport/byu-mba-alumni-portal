import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#002E5D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "white",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#002E5D",
            }}
          >
            BY
          </span>
        </div>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          BYU MBA Alumni Network
        </h1>
        <p
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
            marginTop: 16,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Connect with Marriott School alumni across industries and geographies
        </p>
      </div>
    ),
    { ...size }
  );
}
