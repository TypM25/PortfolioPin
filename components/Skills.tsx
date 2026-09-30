"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { SKILLS, iconUrl } from "@/lib/data";

const RINGS = [
  { inset: "34%", dur: 30, dir: "normal" as const },
  { inset: "20%", dur: 46, dir: "reverse" as const },
  { inset: "9%", dur: 62, dir: "normal" as const },
];

function buildOrbitRings(pin: number, hovered: string) {
  // Skills without a real logo would just render as a blank placeholder in the
  // orbit, so leave them out of the visual - they still show as text chips on the left.
  const skills = SKILLS[pin].skills.filter((name) => iconUrl(name));
  const rings = RINGS.slice(0, Math.min(3, Math.ceil(skills.length / 3)) || 1);
  const per = Math.ceil(skills.length / rings.length);
  let cursor = 0;
  return rings.map((r, ri) => {
    const chipSkills = skills.slice(cursor, cursor + per);
    cursor += per;
    const n = chipSkills.length || 1;
    const rev = r.dir === "reverse";
    return {
      inset: r.inset,
      chips: chipSkills.map((name, i) => ({
        name,
        angle: (360 / n) * i + ri * 18,
        icon: iconUrl(name),
        isHover: hovered === name,
        dur: r.dur,
        rev,
      })),
    };
  });
}

function dotStyle(active: boolean): CSSProperties {
  return {
    width: active ? 28 : 8,
    height: 8,
    borderRadius: 999,
    border: 0,
    padding: 0,
    cursor: "pointer",
    flex: "0 0 auto",
    background: active ? "#fff" : "rgba(255,255,255,.26)",
    transition: "width .5s cubic-bezier(.16,1,.3,1), background .3s ease",
  };
}

export default function Skills() {
  const [pin, setPin] = useState(0);
  const [hoverChip, setHoverChip] = useState("");
  const rings = buildOrbitRings(pin, hoverChip);

  return (
    <section id="skills" style={{ position: "relative", padding: "clamp(60px,9vh,120px) 0", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: "-15% -5%",
          pointerEvents: "none",
          opacity: 0.5,
          backgroundImage: "url('/images/milkyway.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(60% 50% at 50% 42%, rgba(90,120,200,.1), rgba(0,0,0,.55) 78%)",
          zIndex: -1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="skills-grid"
        style={{ position: "relative", width: "min(1100px, 92%)", margin: "0 auto", display: "grid" }}
      >
        <div className="skills-text">
          <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "hsl(0 0% 58%)", marginBottom: 20 }}>
            Tech inventory
          </div>
          <div style={{ position: "relative", minHeight: 330 }}>
            {SKILLS.map((l, i) => (
              <div
                key={l.no}
                style={{
                  position: "absolute",
                  inset: "0 auto auto 0",
                  width: "100%",
                  opacity: i === pin ? 1 : 0,
                  transform: `translateY(${i === pin ? 0 : i < pin ? -24 : 24}px)`,
                  filter: i === pin ? "none" : "blur(4px)",
                  pointerEvents: i === pin ? "auto" : "none",
                  transition: "opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1), filter .55s ease",
                }}
              >
                <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 60, lineHeight: 1, color: "rgba(255,255,255,.28)", marginBottom: 14 }}>
                  {l.no}
                </div>
                <h2 style={{ margin: "0 0 20px", fontSize: "clamp(26px, 3.2vw, 44px)", fontWeight: 500, letterSpacing: "-1.4px" }}>{l.title}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9, maxWidth: 440 }}>
                  {l.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "8px 15px",
                        borderRadius: 999,
                        fontSize: 13,
                        color: "hsl(0 0% 84%)",
                        background: "rgba(255,255,255,.03)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.13)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-orbit-visual" style={{ position: "relative", aspectRatio: "1" }}>
          <div
            style={{
              position: "absolute",
              inset: "-6%",
              borderRadius: "50%",
              overflow: "hidden",
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 100%)",
              maskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 100%)",
            }}
          >
            <Image src="/images/milkyway.png" alt="" fill sizes="(max-width: 860px) 80vw, 500px" style={{ objectFit: "cover" }} />
          </div>

          <div
            data-core
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "22%",
              height: "22%",
              margin: "-11% 0 0 -11%",
              borderRadius: "50%",
              background: "radial-gradient(circle at 44% 38%, #fff, rgba(150,180,255,.35) 42%, rgba(90,120,200,0) 72%)",
              animation: "coreGlow 5.2s ease-in-out infinite",
            }}
          />

          {rings.map((ring, ri) => (
            <div key={ri}>
              <div style={{ position: "absolute", inset: ring.inset, borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(160,190,255,.13)" }} />
              {ring.chips.map((chip) => (
                <div
                  key={chip.name}
                  data-orbit
                  style={{
                    position: "absolute",
                    inset: ring.inset,
                    animationName: "orbitSpin",
                    animationDuration: `${chip.dur}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDirection: chip.rev ? "reverse" : "normal",
                    animationPlayState: chip.isHover ? "paused" : "running",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, transform: `rotate(${chip.angle}deg)` }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: `translate(-50%,-50%) rotate(${-chip.angle}deg)` }}>
                      <div
                        data-chip
                        onMouseEnter={() => setHoverChip(chip.name)}
                        onMouseLeave={() => setHoverChip("")}
                        style={{
                          animationName: "orbitSpin",
                          animationDuration: `${chip.dur}s`,
                          animationTimingFunction: "linear",
                          animationIterationCount: "infinite",
                          animationDirection: chip.rev ? "normal" : "reverse",
                          animationPlayState: chip.isHover ? "paused" : "running",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            transform: chip.isHover ? "scale(1.18)" : "scale(1)",
                            transition: "transform .25s cubic-bezier(.16,1,.3,1)",
                            filter: chip.isHover ? "drop-shadow(0 0 14px rgba(160,190,255,.55))" : "drop-shadow(0 1px 4px rgba(0,0,0,.5))",
                          }}
                        >
                          {chip.icon ? (
                            <Image src={chip.icon} alt="" width={30} height={30} unoptimized style={{ objectFit: "contain" }} />
                          ) : (
                            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
                          )}
                          <span
                            style={{
                              position: "absolute",
                              bottom: "calc(100% + 10px)",
                              left: "50%",
                              transform: `translateX(-50%) translateY(${chip.isHover ? 0 : 4}px)`,
                              whiteSpace: "nowrap",
                              padding: "5px 11px",
                              borderRadius: 999,
                              fontSize: 11,
                              letterSpacing: ".04em",
                              color: "hsl(0 0% 94%)",
                              background: "rgba(8,10,18,.88)",
                              boxShadow: "inset 0 0 0 1px rgba(160,190,255,.28)",
                              opacity: chip.isHover ? 1 : 0,
                              pointerEvents: "none",
                              transition: "opacity .25s ease, transform .25s ease",
                            }}
                          >
                            {chip.name}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="skills-dots" style={{ display: "flex", gap: 8 }}>
          {SKILLS.map((l, i) => (
            <button key={l.no} type="button" aria-label={`Go to ${l.title}`} onClick={() => setPin(i)} style={dotStyle(i === pin)} />
          ))}
        </div>
      </motion.div>

      <style>{`
        .skills-grid {
          grid-template-columns: 1fr 1fr;
          grid-template-areas: "text orbit" "dots orbit";
          column-gap: 48px;
          row-gap: 34px;
          align-items: center;
        }

        .skills-text { grid-area: text; }
        .skills-orbit-visual { grid-area: orbit; }
        .skills-dots { grid-area: dots; }

        @media (max-width: 860px) {
          .skills-grid {
            grid-template-columns: 1fr;
            grid-template-areas: "text" "orbit" "dots";
            gap: 28px;
          }

          .skills-orbit-visual {
            width: min(360px, 80vw);
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
