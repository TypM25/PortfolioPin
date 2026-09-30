"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import TypingGame from "./TypingGame";
import { useDialogAccessibility } from "./useDialogAccessibility";

export default function GameModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogAccessibility({ dialogRef, onClose });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 240,
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-modal-title"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 0.84, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(900px, 92vw)",
          height: "min(560px, 80vh)",
          display: "flex",
          flexDirection: "column",
          background: "#0c0c0e",
          borderRadius: 14,
          boxShadow: "0 40px 100px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 16px",
            height: 44,
            flex: "0 0 auto",
            background: "rgba(255,255,255,.04)",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{ width: 12, height: 12, borderRadius: "50%", border: 0, padding: 0, cursor: "pointer", background: "#ff5f57", flex: "0 0 auto" }}
          />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span id="game-modal-title" style={{ marginLeft: 8, fontSize: 12.5, color: "hsl(0 0% 80%)" }}>Game</span>
        </div>

        <div style={{ position: "relative", flex: "1 1 auto" }}>
          <TypingGame onClose={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
}
