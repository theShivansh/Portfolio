import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Shivansh Shukla — AI Engineer & Systems Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** A notebook page: name, one line, and the sketch → system motif. */
export default function OpengraphImage() {
  const stages = ["Perceive", "Reason", "Simulate", "Act"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f3f1e9",
          color: "#10110f",
          fontFamily: "sans-serif",
          borderLeft: "1px solid rgba(16,17,15,.14)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, color: "#4b4d47" }}>
          <span>FIELD NOTE / 01 — AI SYSTEMS</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#c8ff00", border: "1.5px solid #10110f" }} />
            {site.codename}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9 }}>SHIVANSH</div>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9 }}>SHUKLA</div>
          <div style={{ marginTop: 28, fontSize: 38, maxWidth: 900, lineHeight: 1.2 }}>
            I build AI systems that perceive, reason, simulate, and intervene.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, letterSpacing: 2 }}>
          {stages.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  padding: "6px 14px",
                  border: "1.5px solid #10110f",
                  background: i === stages.length - 1 ? "#c8ff00" : "transparent",
                }}
              >
                {s.toUpperCase()}
              </span>
              {i < stages.length - 1 ? <span>→</span> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
