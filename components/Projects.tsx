"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PROJECTS } from "@/lib/data";
import DesktopModal from "./DesktopModal";

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

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const n = PROJECTS.length;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(n - 1, i + 1));

  return (
    <section id="projects" style={{ position: "relative", padding: "clamp(60px,9vh,120px) 0" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 40px", marginBottom: "clamp(14px, 2.4vh, 26px)", maxWidth: 1200 }}
        >
          <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "hsl(0 0% 58%)", marginBottom: 14 }}>
            Projects
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 500, letterSpacing: "-1.6px" }}>
            What I&rsquo;ve <span className="serif-italic">built</span>
          </h2>
        </motion.div>

        <div style={{ overflow: "hidden", padding: "0 40px" }}>
          <div
            style={{
              display: "flex",
              transition: "transform .5s cubic-bezier(.16,.84,.24,1)",
              transform: `translate3d(-${index * 100}%,0,0)`,
            }}
          >
            {PROJECTS.map((project) => (
              <div key={project.title} style={{ flex: "0 0 100%", display: "flex", justifyContent: "center" }}>
                <ProjectCard project={project} onOpenDesktop={() => setDesktopOpen(true)} />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "clamp(14px,2.4vh,26px) 40px 0" }}>
            <button type="button" aria-label="Previous project" onClick={prev} style={arrowBtnStyle}>
              <span style={{ width: 9, height: 9, borderLeft: "1.5px solid currentColor", borderBottom: "1.5px solid currentColor", transform: "rotate(45deg)", marginLeft: 3 }} />
            </button>
            <button type="button" aria-label="Next project" onClick={next} style={arrowBtnStyle}>
              <span style={{ width: 9, height: 9, borderRight: "1.5px solid currentColor", borderTop: "1.5px solid currentColor", transform: "rotate(45deg)", marginRight: 3 }} />
            </button>
            <div style={{ display: "flex", gap: 8, marginLeft: 6 }}>
              {PROJECTS.map((_, i) => (
                <button key={i} type="button" aria-label={`Go to project ${i + 1}`} onClick={() => setIndex(i)} style={dotStyle(i === index)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {desktopOpen && <DesktopModal key="desktop-modal" onClose={() => setDesktopOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

const arrowBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  border: 0,
  cursor: "pointer",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: "rgba(255,255,255,.03)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,.16)",
};

function ProjectCard({
  project,
  onOpenDesktop,
}: {
  project: (typeof PROJECTS)[number];
  onOpenDesktop: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "min(560px, 88vw)",
        borderRadius: 20,
        overflow: "hidden",
        textAlign: "left",
        background: "rgba(255,255,255,.02)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,.12)",
      }}
    >
      <div style={{ position: "relative", height: "clamp(150px, 26vh, 260px)", overflow: "hidden", background: "#0a0a0c" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${project.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.72))" }} />
        <span style={{ position: "absolute", left: 22, bottom: 18, fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "hsl(0 0% 78%)" }}>
          {project.tag}
        </span>
      </div>

      {project.desktop && (
        <div
          style={{
            position: "absolute",
            right: "6%",
            top: "calc(clamp(150px, 26vh, 260px) - 46px)",
            zIndex: 5,
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            type="button"
            aria-label="Open project files"
            onClick={onOpenDesktop}
            style={{ width: 92, border: 0, padding: 0, background: "transparent", cursor: "pointer", animation: "badgePulse 1.5s ease-in-out infinite" }}
          >
            <Image src="/images/project-fix-bugs.png" alt="Fix bugs" width={594} height={420} sizes="92px" style={{ display: "block", width: "100%", height: "auto" }} />
          </button>
          <span
            style={{
              whiteSpace: "nowrap",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".03em",
              color: "#fff",
              background: "linear-gradient(160deg,#ff5f4d,#d6272b)",
              padding: "7px 13px",
              borderRadius: 999,
              boxShadow: "0 6px 16px rgba(214,39,43,.5), inset 0 1px 1px rgba(255,255,255,.3)",
              animation: "fixLabelBounce 1.8s ease-in-out infinite",
            }}
          >
            Click here!
          </span>
        </div>
      )}

      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 11 }}>
        <h3 style={{ margin: 0, fontSize: 23, fontWeight: 500, letterSpacing: "-.7px" }}>{project.title}</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "hsl(0 0% 66%)" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                padding: "5px 11px",
                borderRadius: 999,
                fontSize: 11,
                letterSpacing: ".05em",
                color: "hsl(0 0% 78%)",
                background: "rgba(255,255,255,.03)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
