import { MARQUEE_ITEMS } from "@/lib/data";

export default function Marquee() {
  return (
    <section style={{ padding: "clamp(60px,7vw,96px) 0", borderTop: "1px solid rgba(255,255,255,.12)", overflow: "hidden" }}>
      <div className="marquee-track">
        {MARQUEE_ITEMS.map((m, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              paddingRight: 40,
              fontSize: "clamp(34px, 6vw, 86px)",
              fontWeight: 500,
              letterSpacing: "-2.4px",
              whiteSpace: "nowrap",
              color: "rgba(255,255,255,.16)",
            }}
          >
            <span>{m.a}</span>
            <span className="serif-italic" style={{ color: "#fff" }}>
              {m.b}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
