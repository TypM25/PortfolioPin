"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { DESKTOP_FILES, GAME_FILE, DesktopFile } from "@/lib/data";
import GameModal from "./GameModal";
import { useDialogAccessibility } from "./useDialogAccessibility";

export default function DesktopModal({ onClose }: { onClose: () => void }) {
  const [minimized, setMinimized] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [gameOpen, setGameOpen] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogAccessibility({ dialogRef, onClose, enabled: !gameOpen });

  // Double-click matches the original desktop design, but touch devices have
  // no reliable double-tap (it's often eaten by the browser's zoom gesture) -
  // fall back to a single tap there instead.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const previewFile = previewIndex != null ? DESKTOP_FILES[previewIndex] : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, display: "grid", placeItems: "center", padding: 24 }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(10px)" }} />

        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="desktop-modal-title"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 0.84, 0.24, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(900px, 92vw)",
            height: minimized ? 46 : "min(560px, 80vh)",
            display: "flex",
            flexDirection: "column",
            background: "#0c0c0e",
            borderRadius: 14,
            boxShadow: "0 40px 100px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.08)",
            overflow: "hidden",
            transition: "height .25s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "0 16px",
              height: 46,
              flex: "0 0 auto",
              background: "rgba(255,255,255,.04)",
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <button type="button" aria-label="Close" onClick={onClose} style={dotBtnStyle("#ff5f57")} />
            <button type="button" aria-label={minimized ? "Restore" : "Minimize"} onClick={() => setMinimized((v) => !v)} style={dotBtnStyle("#febc2e")} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            <span id="desktop-modal-title" style={{ marginLeft: 8, fontSize: 12.5, color: "hsl(0 0% 80%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              University Demo &mdash; Project Files
            </span>
          </div>

          {!minimized && (
            <div
              style={{
                position: "relative",
                flex: "1 1 auto",
                overflow: "auto",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateRows: "repeat(4, minmax(0,1fr))",
                gridAutoFlow: "column",
                gridAutoColumns: "92px",
                gap: 10,
                alignContent: "start",
                justifyContent: "start",
                padding: "22px 0 86px 22px",
                backgroundImage: "url('/uploads/background-pc.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {DESKTOP_FILES.map((f, i) => (
                <FileIcon key={f.label} file={f} canHover={canHover} onOpen={() => setPreviewIndex(i)} />
              ))}

              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <FileIcon file={GAME_FILE} canHover={canHover} onOpen={() => setGameOpen(true)} />
              </div>

              <Dock />
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {previewFile && <PreviewLightbox key={previewFile.label} file={previewFile} onClose={() => setPreviewIndex(null)} />}
        {gameOpen && <GameModal key="typing-game" onClose={() => setGameOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

const DOCK_COLORS = [
  "linear-gradient(160deg,#5ec1ff,#2b7fd6)",
  "linear-gradient(160deg,#ffb35e,#e0782b)",
  "linear-gradient(160deg,#8f7bff,#5a3fd6)",
  "linear-gradient(160deg,#5eff9e,#2bd66f)",
  "linear-gradient(160deg,#ff5e8f,#d62b5a)",
  "linear-gradient(160deg,#c8c8ce,#8a8a92)",
];

function Dock() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 18,
        background: "rgba(20,20,24,.5)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,.16), 0 12px 30px rgba(0,0,0,.4)",
      }}
    >
      {DOCK_COLORS.map((color, i) => (
        <span
          key={i}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: color,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,.35), 0 3px 6px rgba(0,0,0,.35)",
          }}
        />
      ))}
    </div>
  );
}

// Plain 12x12 circles (no oversized invisible hit area) so the flex `gap`
// between title-bar dots reads as visually equal spacing, matching the
// original design - a padded hit box here would make it visually uneven.
const dotBtnStyle = (bg: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  border: 0,
  padding: 0,
  cursor: "pointer",
  background: bg,
  flex: "0 0 auto",
});

function FileIcon({ file, canHover, onOpen }: { file: DesktopFile; canHover: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onDoubleClick={canHover ? onOpen : undefined}
      onClick={canHover ? undefined : onOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        border: 0,
        padding: "6px 4px",
        borderRadius: 10,
        cursor: "pointer",
        width: 84,
        userSelect: "none",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 48,
          height: 48,
          backgroundImage: file.icon
            ? `url('${file.icon}')`
            : file.type === "image"
            ? `url('${file.src}')`
            : "linear-gradient(160deg, #2a2a30, #17171b)",
          backgroundSize: file.icon ? "contain" : "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: file.icon ? 0 : 8,
          boxShadow: file.icon ? undefined : "0 3px 8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.2)",
          filter: file.icon ? "drop-shadow(0 3px 6px rgba(0,0,0,.5))" : undefined,
        }}
      >
        {file.type === "video" && !file.icon && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              margin: "auto",
              width: 0,
              height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: "11px solid rgba(255,255,255,.85)",
            }}
          />
        )}
        <span
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            fontSize: 7.5,
            letterSpacing: ".03em",
            padding: "1px 4px",
            borderRadius: 4,
            background: "rgba(0,0,0,.7)",
            color: "hsl(0 0% 90%)",
          }}
        >
          {file.ext}
        </span>
      </span>
      <span style={{ fontSize: 11, color: "#fff", textAlign: "center", lineHeight: 1.25, maxWidth: 84, textShadow: "0 1px 3px rgba(0,0,0,.9)" }}>
        {file.label}
      </span>
    </button>
  );
}

function PreviewLightbox({ file, onClose }: { file: DesktopFile; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogAccessibility({ dialogRef, onClose });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 220, display: "grid", placeItems: "center", padding: 24, background: "rgba(0,0,0,.6)", backdropFilter: "blur(10px)" }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-lightbox-title"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 0.84, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "92vw",
          maxHeight: "86vh",
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
          <button type="button" aria-label="Close" onClick={onClose} style={dotBtnStyle("#ff5f57")} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span
            id="preview-lightbox-title"
            style={{ marginLeft: 8, fontSize: 12.5, color: "hsl(0 0% 80%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {file.label}
          </span>
        </div>

        <div style={{ position: "relative", flex: "1 1 auto", overflow: "auto", display: "grid", placeItems: "center" }}>
          {file.type === "video" ? (
            <video src={file.src} controls autoPlay style={{ maxWidth: "92vw", maxHeight: "78vh", display: "block" }} />
          ) : (
            <Image
              src={file.src}
              alt={file.label}
              width={file.width ?? 1600}
              height={file.height ?? 900}
              sizes="92vw"
              style={{ maxWidth: "92vw", maxHeight: "78vh", width: "auto", height: "auto", display: "block" }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
