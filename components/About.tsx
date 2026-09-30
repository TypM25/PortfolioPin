"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { ABOUT_TEXT } from "@/lib/data";

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.018 } },
};

export default function About() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(true);
  const x = useMotionValue(50);
  const y = useMotionValue(40);
  const radius = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    radius.set(150);
  };

  // A soft-edged mask (radial-gradient falloff) reads as a faded circle boundary,
  // vs. clip-path's hard binary cutoff.
  const hoverMask = useMotionTemplate`radial-gradient(circle ${radius}px at ${x}px ${y}px, #000 62%, transparent 100%)`;

  return (
    <section id="about" style={{ padding: "clamp(70px,8vw,110px) 32px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "hsl(0 0% 58%)", marginBottom: 26 }}
      >
        About
      </motion.div>

      <div
        ref={wrapRef}
        onMouseMove={canHover ? handleMove : undefined}
        onMouseLeave={canHover ? () => radius.set(0) : undefined}
        style={{
          position: "relative",
          width: "min(900px, 100%)",
          aspectRatio: "4/3",
          margin: "0 auto 44px",
          WebkitMaskImage: "radial-gradient(70% 78% at 52% 46%, #000 52%, transparent 100%)",
          maskImage: "radial-gradient(70% 78% at 52% 46%, #000 52%, transparent 100%)",
        }}
      >
        <Image
          src="/images/portrait.png"
          alt="Pin"
          fill
          preload
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ objectFit: "cover", objectPosition: "52% 18%" }}
        />

        {canHover ? (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: hoverMask,
              maskImage: hoverMask,
              willChange: "mask-image",
            }}
          >
            <Image
              src="/images/portrait-alt.png"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover", objectPosition: "52% 18%", left: "-2.5%", top: "2.5%" }}
            />
          </motion.div>
        ) : (
          <MobileAutoReveal shouldReduceMotion={shouldReduceMotion} />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: "6%",
            transform: "translateX(-50%)",
            fontSize: 10,
            letterSpacing: ".26em",
            color: "hsl(0 0% 62%)",
          }}
        >
          {canHover ? "HOVER TO INSPECT" : "AUTO-REVEAL ON MOBILE"}
        </span>
      </div>

      <motion.p
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        style={{
          margin: "0 auto",
          maxWidth: 900,
          fontSize: "clamp(22px, 3.1vw, 42px)",
          fontWeight: 500,
          letterSpacing: "-1px",
          lineHeight: 1.3,
          color: "hsl(210 17% 95%)",
        }}
      >
        {ABOUT_TEXT.split(" ").map((w, i) => (
          <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", marginRight: "0.28em" }}>
            {w}
          </motion.span>
        ))}
      </motion.p>
    </section>
  );
}

// Touch devices have no hover, so the "hidden alt portrait" would otherwise never be
// seen at all. Loop the reveal circle back and forth across the image continuously -
// the mobile equivalent of "hover", since there's no pointer to drive it.
function MobileAutoReveal({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  const mx = useMotionValue(22);
  const my = useMotionValue(35);
  const mr = useMotionValue(100);
  const mask = useMotionTemplate`radial-gradient(circle ${mr}px at ${mx}% ${my}%, #000 62%, transparent 100%)`;
  const settledMask = "radial-gradient(circle 100px at 50% 55%, #000 62%, transparent 100%)";

  useEffect(() => {
    if (shouldReduceMotion) return;
    const controls = [
      animate(mx, [22, 78, 55, 22], { duration: 9, repeat: Infinity, ease: "easeInOut" }),
      animate(my, [35, 30, 68, 35], { duration: 9, repeat: Infinity, ease: "easeInOut" }),
      animate(mr, [100, 130, 100, 100], { duration: 9, repeat: Infinity, ease: "easeInOut" }),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [shouldReduceMotion, mx, my, mr]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        WebkitMaskImage: shouldReduceMotion ? settledMask : mask,
        maskImage: shouldReduceMotion ? settledMask : mask,
        willChange: "mask-image",
      }}
    >
      <Image
        src="/images/portrait-alt.png"
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 900px"
        style={{ objectFit: "cover", objectPosition: "52% 18%", left: "-2.5%", top: "2.5%" }}
      />
    </motion.div>
  );
}
