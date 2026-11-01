import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — I build interfaces that feel alive`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "radial-gradient(60% 80% at 82% 40%, rgba(34,211,238,0.28), transparent 70%), radial-gradient(50% 70% at 70% 80%, rgba(139,92,246,0.25), transparent 70%), #050608",
          color: "#eef1f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: "#2dd4bf" }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>
          <span>I build interfaces</span>
          <span style={{ color: "#22d3ee" }}>that feel alive.</span>
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 28, color: "#8b93a3" }}>{siteConfig.role}</div>
        {/* stylised eye */}
        <div style={{ position: "absolute", right: 130, top: 150, width: 210, height: 300, borderRadius: 999, background: "radial-gradient(circle at 50% 40%, #e6c35a, #7a5a1a 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 170, height: 250, borderRadius: 999, background: "radial-gradient(circle at 50% 40%, #2dd4bf, #064e3b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 120, height: 190, borderRadius: 999, background: "radial-gradient(circle at 50% 35%, #60a5fa, #0b1a63)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 60, height: 100, borderRadius: 999, background: "radial-gradient(circle at 50% 30%, #67e8f9, #4c1d95)", display: "flex" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
