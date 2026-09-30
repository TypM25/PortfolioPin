"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { EXPERIENCE_CARDS, ExperienceCard } from "@/lib/data";
import ExperienceModal from "./ExperienceModal";

export default function Experience() {
  const [cards, setCards] = useState(EXPERIENCE_CARDS);
  const [openCard, setOpenCard] = useState<ExperienceCard | null>(null);
  const [dragOverArea, setDragOverArea] = useState<string | null>(null);
  // Dragging to swap cards is a desktop-only affordance - on narrow viewports
  // it would fight with page scroll, so it's switched off below 780px.
  const [canDrag, setCanDrag] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 781px)");
    const update = () => setCanDrag(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Slots keep their own fixed size/position (gridArea never moves) - dragging
  // just swaps which card's content sits in two slots, so the bento shape
  // (hero 2x2, small 1x1, ...) stays constant no matter how cards get shuffled.
  const swapAreas = useCallback((fromArea: string, toArea: string) => {
    if (fromArea === toArea) return;
    setCards((prev) => {
      const i = prev.findIndex((c) => c.gridArea === fromArea);
      const j = prev.findIndex((c) => c.gridArea === toArea);
      if (i === -1 || j === -1) return prev;
      const next = [...prev];
      next[i] = { ...prev[j], gridArea: fromArea };
      next[j] = { ...prev[i], gridArea: toArea };
      return next;
    });
  }, []);

  const areaUnderPoint = (point: { x: number; y: number }) => {
    const el = document.elementFromPoint(point.x, point.y);
    return el?.closest<HTMLElement>("[data-slot]")?.dataset.slot ?? null;
  };

  return (
    <section id="experience" style={{ position: "relative", padding: "clamp(60px,9vh,120px) 32px" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(36px, 6vh, 64px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "hsl(0 0% 58%)", marginBottom: 12 }}
        >
          Experience
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{ margin: 0, fontSize: "clamp(24px, 3.4vw, 44px)", fontWeight: 500, letterSpacing: "-1.4px" }}
        >
          Where I&rsquo;ve <span className="serif-italic">been</span>
        </motion.h2>
      </div>

      <motion.div
        className="exp-grid"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {cards.map((card) => (
          <ExperienceSlot
            key={card.gridArea}
            card={card}
            canDrag={canDrag}
            isDragOver={dragOverArea === card.gridArea}
            onOpen={() => setOpenCard(card)}
            onDrag={(point) => setDragOverArea(areaUnderPoint(point))}
            onDragEnd={(point) => {
              setDragOverArea(null);
              const toArea = areaUnderPoint(point);
              if (toArea) swapAreas(card.gridArea, toArea);
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {openCard && <ExperienceModal key={openCard.no} card={openCard} onClose={() => setOpenCard(null)} />}
      </AnimatePresence>

      <style>{`
        .exp-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 150px 150px 110px;
          grid-template-areas:
            "a b c c"
            "f f c c"
            "f f g h";
        }

        @media (max-width: 780px) {
          .exp-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: 260px 130px 220px 130px;
            grid-template-areas:
              "c c"
              "a b"
              "f f"
              "g h";
          }
        }
      `}</style>
    </section>
  );
}

// The draggable, fixed-shape slot. Content underneath crossfades on swap;
// the slot itself never moves, snapping back to its grid cell after a drag.
function ExperienceSlot({
  card,
  canDrag,
  isDragOver,
  onOpen,
  onDrag,
  onDragEnd,
}: {
  card: ExperienceCard;
  canDrag: boolean;
  isDragOver: boolean;
  onOpen: () => void;
  onDrag: (point: { x: number; y: number }) => void;
  onDragEnd: (point: { x: number; y: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      data-slot={card.gridArea}
      drag={canDrag}
      dragSnapToOrigin
      dragElastic={0.15}
      whileDrag={canDrag ? { scale: 1.05, zIndex: 30, boxShadow: "0 24px 60px rgba(0,0,0,.55)" } : undefined}
      onDragStart={() => setIsDragging(true)}
      onDrag={(_, info) => onDrag({ x: info.point.x, y: info.point.y })}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd({ x: info.point.x, y: info.point.y });
      }}
      style={{
        gridArea: card.gridArea,
        position: "relative",
        borderRadius: 16,
        cursor: canDrag ? "grab" : "default",
        pointerEvents: isDragging ? "none" : "auto",
        outline: isDragOver ? "2px solid rgba(255,255,255,.65)" : "2px solid transparent",
        outlineOffset: 3,
        transition: "outline-color .15s ease",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={card.no}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <CardContent card={card} onOpen={onOpen} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CardContent({ card, onOpen }: { card: ExperienceCard; onOpen: () => void }) {
  if (card.hero) return <HeroCard card={card} onOpen={onOpen} />;
  if (card.images) return <SmallImageCard card={card} />;
  if (card.accent) return <TextTile card={card} />;
  return <PlaceholderCard card={card} />;
}

function PlaceholderCard({ card }: { card: ExperienceCard }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,.02)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: 34,
          lineHeight: 1,
          color: "rgba(255,255,255,.28)",
        }}
      >
        {String(card.no).padStart(2, "0")}
      </span>
    </div>
  );
}

// Desktop has hover; touch devices don't, so the same "play this once" pulse
// is triggered by onHoverStart on desktop and by a tap on mobile instead.
function useHoverOrTapPulse() {
  const [canHover, setCanHover] = useState(true);
  const progress = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const play = useCallback(() => {
    animate(progress, [0, 1, 0], { duration: 0.9, ease: "easeInOut" });
  }, [progress]);

  return { canHover, progress, play };
}

// Small image cells are decorative, non-clickable tiles - a subtle zoom + shine
// pulse on hover (desktop) or tap (mobile), nothing else.
function SmallImageCard({ card }: { card: ExperienceCard }) {
  const { canHover, progress, play } = useHoverOrTapPulse();
  const scale = useTransform(progress, [0, 1], [1, 1.07]);
  const shine = useTransform(progress, [0, 0.5, 1], [0, 0.35, 0]);

  return (
    <div onClick={!canHover ? play : undefined} style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 16 }}>
      <motion.div onHoverStart={canHover ? play : undefined} style={{ position: "absolute", inset: 0, scale }}>
        <Image
          src={card.images![0]}
          alt={card.title ?? ""}
          fill
          sizes="(max-width: 780px) 50vw, 260px"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,.5), transparent 55%)",
          opacity: shine,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// Flat-color wordmark tiles (no photo yet) - same hover/tap pulse treatment as
// SmallImageCard, for a consistent feel across the grid's small cells.
function TextTile({ card }: { card: ExperienceCard }) {
  const { canHover, progress, play } = useHoverOrTapPulse();
  const scale = useTransform(progress, [0, 1], [1, 1.05]);
  const shine = useTransform(progress, [0, 0.5, 1], [0, 0.45, 0]);

  return (
    <motion.div
      onHoverStart={canHover ? play : undefined}
      onClick={!canHover ? play : undefined}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 16,
        background: card.accent,
        display: "grid",
        placeItems: "center",
        scale,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,.55), transparent 55%)",
          opacity: shine,
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "relative",
          fontWeight: 700,
          fontSize: "clamp(15px, 1.6vw, 21px)",
          letterSpacing: ".01em",
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,.25)",
        }}
      >
        {card.title}
      </span>
    </motion.div>
  );
}

function HeroCard({ card, onOpen }: { card: ExperienceCard; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 18,
        border: 0,
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)",
      }}
    >
      <motion.div layoutId={`exp-media-${card.no}`} style={{ position: "absolute", inset: 0 }}>
        <Image
          src={card.images![0]}
          alt={card.title ?? ""}
          fill
          sizes="(max-width: 780px) 100vw, 560px"
          style={{ objectFit: "cover" }}
        />
      </motion.div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.82) 100%)",
        }}
      />

      {(card.period || card.title || card.link) && (
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 18 }}>
          {card.period && (
            <span
              style={{
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 10.5,
                letterSpacing: ".14em",
                color: "hsl(0 0% 85%)",
                background: "rgba(255,255,255,.1)",
                backdropFilter: "blur(6px)",
                marginBottom: 10,
              }}
            >
              {card.period}
            </span>
          )}
          {card.title && (
            <h3 style={{ margin: "0 0 6px", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 500, letterSpacing: "-.6px", color: "#fff" }}>
              {card.title}
            </h3>
          )}
          {card.link && <span style={{ fontSize: 12, letterSpacing: ".04em", color: "hsl(0 0% 82%)" }}>View case study &rarr;</span>}
        </div>
      )}
    </motion.button>
  );
}
