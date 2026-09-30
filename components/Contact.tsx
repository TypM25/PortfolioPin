"use client";

import { motion } from "motion/react";
import { EMAIL, LINKEDIN, MAILTO } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" style={{ padding: "clamp(70px,8vw,110px) 32px", textAlign: "center" }}>
      <motion.h2
        initial={{ opacity: 0, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ margin: "0 0 18px", fontSize: "clamp(32px, 5vw, 68px)", fontWeight: 500, letterSpacing: "-2px" }}
      >
        Let&rsquo;s work <span className="serif-italic">together</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
      >
        <a
          href={MAILTO}
          style={{
            background: "#fff",
            color: "#000",
            borderRadius: 999,
            padding: "15px 32px",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {EMAIL}
        </a>
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: 999,
            padding: "15px 32px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: "rgba(255,255,255,.02)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,.14)",
            whiteSpace: "nowrap",
          }}
        >
          LinkedIn
        </a>
      </motion.div>
    </section>
  );
}
