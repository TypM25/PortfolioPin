"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MAILTO, NAV_LINKS } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          padding: scrolled ? "11px 32px" : "16px 32px",
          background: scrolled ? "rgba(0,0,0,.58)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,.12)" : "rgba(255,255,255,0)"}`,
          transition: "background .45s ease, backdrop-filter .45s ease, border-color .45s ease, padding .45s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              border: "2px solid rgba(255,255,255,.6)",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #fff, rgba(255,255,255,.08))",
              }}
            />
          </span>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-.01em", whiteSpace: "nowrap" }}>
            Pin <span className="serif-italic" style={{ color: "hsl(0 0% 70%)" }}>/ Software Engineer</span>
          </span>
        </div>

        <div
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 13,
            color: "hsl(0 0% 66%)",
            flexWrap: "nowrap",
          }}
        >
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <a href={l.href} style={{ whiteSpace: "nowrap" }}>
                {l.label}
              </a>
              {i < NAV_LINKS.length - 1 && <span style={{ opacity: 0.35 }}>{"•"}</span>}
            </span>
          ))}
        </div>

        <a
          href={MAILTO}
          className="nav-cta"
          style={{
            padding: "9px 20px",
            borderRadius: 999,
            background: "#fff",
            color: "#000",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: ".08em",
            whiteSpace: "nowrap",
            flex: "0 0 auto",
          }}
        >
          GET IN TOUCH
        </a>

        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            width: 36,
            height: 36,
            padding: 0,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            flex: "0 0 auto",
          }}
        >
          <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
          <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
          <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 59,
              background: "rgba(0,0,0,.6)",
              backdropFilter: "blur(6px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 0.84, 0.24, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 64,
                left: 16,
                right: 16,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 12,
                borderRadius: 16,
                background: "#0c0c0e",
                boxShadow: "0 20px 60px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.08)",
                fontSize: 15,
              }}
            >
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ padding: "12px 10px", color: "#fff" }}>
                  {l.label}
                </a>
              ))}
              <a
                href={MAILTO}
                onClick={() => setMenuOpen(false)}
                style={{
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 999,
                  background: "#fff",
                  color: "#000",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  letterSpacing: ".08em",
                }}
              >
                GET IN TOUCH
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .nav-links, .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
