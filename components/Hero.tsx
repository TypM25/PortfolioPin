"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { MAILTO, STATS, FLOATING_TAGS } from "@/lib/data";

const floatTransition = (delay: number) => ({
  duration: 5,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
  delay,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const shouldReduceMotion = useReducedMotion();
  // Background video zooms in slightly as you scroll past the hero - driven purely by
  // scroll position (not hover), so it behaves identically on touch and mouse devices.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.7]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section id="home" ref={sectionRef} style={{ position: "relative", height: "160vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "grid", placeItems: "center" }}>
        <motion.video
          src="/video/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: "50% 45%",
            filter: "contrast(1.05) brightness(.58)",
            scale: shouldReduceMotion ? 1 : videoScale,
            willChange: "transform",
          }}
        />

        {FLOATING_TAGS.map((label, i) => (
          <motion.div
            key={label}
            className="hero-float-tag"
            initial={{ y: 0 }}
            animate={shouldReduceMotion ? { y: 0 } : { y: [0, -10, 0] }}
            transition={shouldReduceMotion ? { duration: 0 } : floatTransition(i * 0.6)}
            style={{
              position: "absolute",
              zIndex: 6,
              whiteSpace: "nowrap",
              padding: "7px 14px",
              fontSize: 11,
              letterSpacing: ".18em",
              color: "hsl(0 0% 82%)",
              background: "rgba(255,255,255,.02)",
              backdropFilter: "blur(6px)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,.12)",
              ...[
                { left: "5%", top: "17%" },
                { right: "5%", top: "70%" },
                { left: "7%", bottom: "15%" },
              ][i],
            }}
          >
            {label}
          </motion.div>
        ))}

        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 28px",
            maxWidth: 1000,
            opacity: shouldReduceMotion ? 1 : copyOpacity,
            y: shouldReduceMotion ? 0 : copyY,
            willChange: "transform, opacity",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 11,
              letterSpacing: ".34em",
              textTransform: "uppercase",
              color: "hsl(0 0% 64%)",
              marginBottom: 24,
            }}
          >
            Software Engineer &middot; Bangkok
          </motion.div>

          <motion.h1
            className="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              margin: 0,
              fontSize: "clamp(46px, 8vw, 118px)",
              fontWeight: 500,
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            Hi, I am
            <br />
            <span className="serif-italic" style={{ whiteSpace: "nowrap" }}>
              Thanyaporn Musikpodok
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              margin: "26px auto 0",
              maxWidth: 600,
              fontSize: 17,
              lineHeight: 1.72,
              color: "hsl(0 0% 76%)",
            }}
          >
            Software Engineer focused on system design, maintainability, and practical problem
            solving. Builds scalable solutions with clear architecture, technical constraints,
            resources, and real-world requirements.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}
          >
            <a
              href="#projects"
              style={{
                background: "#fff",
                color: "#000",
                borderRadius: 999,
                padding: "14px 30px",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              View projects
            </a>
            <a
              href={MAILTO}
              style={{
                borderRadius: 999,
                padding: "14px 30px",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: "rgba(255,255,255,.02)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,.14)",
                whiteSpace: "nowrap",
              }}
            >
              Email me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 500 }}>{s.value}</div>
                <div style={{ fontSize: 11, letterSpacing: ".18em", color: "hsl(0 0% 58%)", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hero-heading { font-size: clamp(26px, 9vw, 46px) !important; }
          .hero-float-tag { display: none !important; }
        }
      `}</style>
    </section>
  );
}
