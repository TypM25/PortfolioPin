"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ExperienceCard } from "@/lib/data";
import { useDialogAccessibility } from "./useDialogAccessibility";

const AUTOPLAY_MS = 3500;

export default function ExperienceModal({ card, onClose }: { card: ExperienceCard; onClose: () => void }) {
  const images = card.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogAccessibility({ dialogRef, onClose });

  // Autoplay the gallery; a manual dot click just retargets the same interval.
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % images.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "grid", placeItems: "center", padding: 24 }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)" }} />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={card.title ? "experience-modal-title" : undefined}
        aria-label={card.title ? undefined : "Experience details"}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(420px, 92vw)",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "#0c0c0e",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.08)",
        }}
      >
        {/* Close button lives outside the scrolling area below so it stays
            pinned to the card's corner instead of scrolling away with the content. */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: 0,
            cursor: "pointer",
            background: "rgba(0,0,0,.5)",
            color: "#fff",
            fontSize: 16,
            backdropFilter: "blur(6px)",
          }}
        >
          &times;
        </button>

        <div style={{ overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}>
          <motion.div layoutId={`exp-media-${card.no}`} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                transform: `translateX(-${activeIndex * 100}%)`,
                transition: "transform .45s cubic-bezier(.16,.84,.24,1)",
              }}
            >
              {images.map((src, i) => (
                <div key={src} style={{ position: "relative", flex: "0 0 100%", height: "100%" }}>
                  <Image src={src} alt={`${card.title ?? "Experience"} screenshot ${i + 1}`} fill sizes="420px" style={{ objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </motion.div>

          {images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "14px 0 4px" }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  style={{ border: 0, background: "transparent", cursor: "pointer", padding: 6 }}
                >
                  <span
                    style={{
                      display: "block",
                      width: i === activeIndex ? 20 : 7,
                      height: 7,
                      borderRadius: 999,
                      background: i === activeIndex ? "#fff" : "rgba(255,255,255,.25)",
                      transition: "all .25s ease",
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "10px 26px 28px" }}>
            {card.period && (
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 12px",
                  borderRadius: 999,
                  fontSize: 10.5,
                  letterSpacing: ".14em",
                  color: "hsl(0 0% 80%)",
                  background: "rgba(255,255,255,.05)",
                  marginBottom: 14,
                }}
              >
                {card.period}
              </span>
            )}
            {card.title && (
              <h3 id="experience-modal-title" style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 500, letterSpacing: "-.7px", color: "#fff" }}>
                {card.title}
              </h3>
            )}
            {card.bullets && (
              <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {card.bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: 13.5, lineHeight: 1.7, color: "hsl(0 0% 68%)", paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 8, width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.4)" }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "#fff",
                    color: "#000",
                    borderRadius: 999,
                    padding: "14px 0",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  View
                </a>
              )}
              <motion.button
                type="button"
                aria-label={liked ? "Unlike" : "Like"}
                aria-pressed={liked}
                onClick={() => setLiked((v) => !v)}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 48,
                  height: 48,
                  flex: "0 0 auto",
                  borderRadius: "50%",
                  border: 0,
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,.05)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)",
                }}
              >
                <HeartIcon filled={liked} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      initial={false}
      animate={{ scale: filled ? [1, 1.25, 1] : 1 }}
      transition={{ duration: 0.35 }}
    >
      <path
        d="M12 21s-7.5-4.7-10-9.3C.4 8.2 2 4.5 5.6 4c2-.3 3.9.7 5 2.3C11.7 4.7 13.6 3.7 15.6 4c3.6.5 5.2 4.2 3.6 7.7C19.5 16.3 12 21 12 21z"
        fill={filled ? "#fff" : "none"}
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
