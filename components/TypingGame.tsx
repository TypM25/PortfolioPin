"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

const TARGET = "My name is Pin, don't forget it.";

const HERO_FRAMES = {
  idle: { r: 0, c: 0, flip: false },
  walk: [
    { r: 2, c: 0 },
    { r: 2, c: 1 },
    { r: 2, c: 2 },
    { r: 2, c: 3 },
  ],
  jump: { r: 1, c: 2, flip: true },
  victory: { r: 3, c: 3, flip: false },
};
const HERO_CW = 32;
const HERO_CH = 64;
const HERO_DRAW_H = 84;
const COIN = { frames: 9, cw: 101, ch: 96 };
const BG_SRC = { sx: 0, sy: 0, sw: 1366, sh: 768 };
const GROUND_SRC = { sx: 0, sy: 525, sw: 1366, sh: 243 };
const CLOUD_SRC = [
  { sx: 62, sy: 85, sw: 660, sh: 299 },
  { sx: 217, sy: 455, sw: 1098, sh: 267 },
];
const TREE_SRC = { sx: 423, sy: 61, sw: 496, sh: 645 };
const PLANT_SRC = [
  { sx: 41, sy: 311, sw: 531, sh: 350 },
  { sx: 779, sy: 287, sw: 561, sh: 374 },
];
const MUSH_SRC = { sx: 143, sy: 162, sw: 414, sh: 396 };
const SEAT_SRC = { sx: 112, sy: 149, sw: 1142, sh: 542 };
const CASTLE_SRC = { sx: 106, sy: 58, sw: 284, sh: 673 };
const CHEST_CLOSED_SRC = { sx: 437, sy: 221, sw: 326, sh: 263 };
const CHEST_OPEN_SRC = { sx: 84, sy: 112, sw: 329, sh: 372 };
const CHEST_REF_W = 326;
const WINK_FRAMES = [
  { x: 144, y: 55, w: 107, h: 106 },
  { x: 351, y: 55, w: 106, h: 106 },
  { x: 544, y: 55, w: 107, h: 106 },
  { x: 751, y: 55, w: 96, h: 106 },
];

const HERO_START_X = 0.06;
const HERO_END_X = 0.84;
const PIPE_X = 0.015;
const GOAL_X = 0.9;
const GOAL_BUSH_X = [0.862, 0.938];
const TREE_X = 0.47;
const SEAT_X = 0.63;
const SEAT_W = 100;
const BUSH_W = 50;
const CASTLE_H = 260;
const CHEST_W = 65;
const CLOUD_W = [150, 200];
const CANVAS_REF_W = 960;
const CANVAS_REF_H = 540;
const GROUND_Y_RATIO = 0.72;
const TEXT_GAP_ABOVE_BLOCK = 26;

const JUMP_VEL = -9;
const GRAVITY = 0.8;
const BLOCK_GAP = 125;
const BLOCK_SIZE = 28;
const BLOCK_EDGE = "#5A3A1A";
const BLOCK_FACE = "#E8A020";
const BLOCK_HI = "#FFD060";
const BLOCK_SHADOW = "#C07010";
const BLOCK_GLYPH = "#5A3A1A";
const BLOCK_USED_FACE = "#9A6A3A";
const BLOCK_USED_HI = "#B07C46";
const BLOCK_USED_SHADOW = "#6E4A26";
const COIN_DRAW_W = 32;
const WALK_COIN_Y = 42;
const BLOCK_BUMP_MS = 180;
const POP_VY = -7;
const POP_VX = 1.8;
const POP_GRAVITY = 0.32;
const POP_LIFE = 80;
const POP_FADE = 20;
const POP_TILT_RAD = 0.22;

type EventKind = "coin" | "block-coin" | "block-mushroom";
const SPACE_SCRIPT: { kind: EventKind; tilt: number }[] = [
  { kind: "coin", tilt: 0 },
  { kind: "coin", tilt: 0 },
  { kind: "block-coin", tilt: 1 },
  { kind: "block-mushroom", tilt: 1 },
  { kind: "coin", tilt: 0 },
  { kind: "block-mushroom", tilt: -1 },
];
const FALLBACK_SCRIPT = { kind: "coin" as EventKind, tilt: 0 };

const isBlockEvent = (k: EventKind) => k !== "coin";
const givesCoin = (k: EventKind) => k !== "block-mushroom";
const sceneScale = (w: number, h: number) => Math.min(w / CANVAS_REF_W, h / CANVAS_REF_H);
const heroXAt = (p: number) => HERO_START_X + (HERO_END_X - HERO_START_X) * p;

function coinLeadFrac(len: number) {
  const heroHalf = (HERO_DRAW_H * (HERO_CW / HERO_CH)) / 2;
  const step = len > 0 ? (HERO_END_X - HERO_START_X) / len : 0;
  return Math.max(0, (heroHalf + COIN_DRAW_W / 2) / CANVAS_REF_W - step / 2);
}

interface SpaceEvent {
  charIndex: number;
  x: number;
  kind: EventKind;
  tilt: number;
}

function buildSpaceEvents(text: string): SpaceEvent[] {
  const events: SpaceEvent[] = [];
  const lead = coinLeadFrac(text.length);
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") continue;
    const script = SPACE_SCRIPT[events.length] || FALLBACK_SCRIPT;
    const progress = text.length > 0 ? (i + 1) / text.length : 0;
    const x = heroXAt(progress) + (script.kind === "coin" ? lead : 0);
    events.push({ charIndex: i, x, kind: script.kind, tilt: script.tilt });
  }
  return events;
}

const SPACE_EVENTS = buildSpaceEvents(TARGET);

function maskWhiteBg(img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, threshold = 235) {
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;
  const cctx = c.getContext("2d")!;
  cctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  const data = cctx.getImageData(0, 0, sw, sh);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > threshold && d[i + 1] > threshold && d[i + 2] > threshold) d[i + 3] = 0;
  }
  cctx.putImageData(data, 0, 0);
  return c;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  frame: number;
}
interface Pop {
  kind: "coin" | "mushroom";
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  delay: number;
  life: number;
}

interface GameState {
  typed: number;
  errors: number;
  totalKeystrokes: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  started: boolean;
  spacesTyped: number;
  isPanelError: boolean;
  capsOn: boolean;
}

const initialGameState: GameState = {
  typed: 0,
  errors: 0,
  totalKeystrokes: 0,
  startTime: null,
  endTime: null,
  isComplete: false,
  started: false,
  spacesTyped: 0,
  isPanelError: false,
  capsOn: false,
};

export default function TypingGame({ onClose }: { onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const errorFlashRef = useRef<HTMLDivElement>(null);

  // Mirror state into a ref before React schedules its render so rapid key presses always
  // calculate against the latest progress without re-subscribing the canvas loop.
  const [game, setGameState] = useState<GameState>(initialGameState);
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const stateRef = useRef(game);

  const updateState = (patch: Partial<GameState> | ((s: GameState) => Partial<GameState>)) => {
    const current = stateRef.current;
    const next = { ...current, ...(typeof patch === "function" ? patch(current) : patch) };
    stateRef.current = next;
    setGameState(next);
  };

  // Every other piece of mutable game state - physics, images, particles - doesn't need
  // to trigger a re-render at all (the canvas draws it directly every frame), so it lives
  // in one plain mutable ref, mirroring the imperative instance fields of the original.
  const g = useRef({
    dispX: null as number | null,
    lastFrameT: null as number | null,
    landT: 0,
    pops: [] as Pop[],
    blockHitT: {} as Record<number, number>,
    heroY: 0,
    jumpVel: 0,
    isJumping: false,
    lastCorrectTime: 0,
    particles: [] as Particle[],
    heroImg: null as HTMLImageElement | null,
    coinImg: null as HTMLImageElement | null,
    castleImg: null as HTMLImageElement | null,
    mushImg: null as HTMLImageElement | null,
    bgImg: null as HTMLImageElement | null,
    cloudImg: null as HTMLImageElement | null,
    groundImg: null as HTMLImageElement | null,
    treeImg: null as HTMLImageElement | null,
    seatImg: null as HTMLImageElement | null,
    plantImg: null as HTMLImageElement | null,
    winkImg: null as HTMLImageElement | null,
    chestClosed: null as HTMLCanvasElement | null,
    chestOpen: null as HTMLCanvasElement | null,
  }).current;

  const handleKeyDownRef = useRef<(e: { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; preventDefault: () => void }) => void>(() => {});
  const errTimeoutHandle = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    const load = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };
    g.heroImg = load("/game/hero-sheet.png");
    g.coinImg = load("/game/coin-sheet.png");
    g.castleImg = load("/game/castle.png");
    g.mushImg = load("/game/mushroom.png");
    g.bgImg = load("/game/bg.png");
    g.cloudImg = load("/game/cloud.png");
    g.groundImg = load("/game/ground.png");
    g.treeImg = load("/game/tree.png");
    g.seatImg = load("/game/seat.png");
    g.plantImg = load("/game/plant.png");
    g.winkImg = load("/game/wink.png");

    const chestImg = new Image();
    chestImg.onload = () => {
      g.chestClosed = maskWhiteBg(chestImg, CHEST_CLOSED_SRC.sx, CHEST_CLOSED_SRC.sy, CHEST_CLOSED_SRC.sw, CHEST_CLOSED_SRC.sh);
      g.chestOpen = maskWhiteBg(chestImg, CHEST_OPEN_SRC.sx, CHEST_OPEN_SRC.sy, CHEST_OPEN_SRC.sw, CHEST_OPEN_SRC.sh);
    };
    chestImg.src = "/game/chest.jpg";

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const w = rootRef.current!.clientWidth;
      const h = rootRef.current!.clientHeight;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.imageSmoothingEnabled = false;
      setViewport({ w, h });
    };

    const updatePhysics = () => {
      if (!g.isJumping) return;
      let heroY = g.heroY + g.jumpVel;
      let jumpVel = g.jumpVel + GRAVITY;
      const ceiling = BLOCK_GAP - HERO_DRAW_H;
      if (heroY <= -ceiling) {
        heroY = -ceiling;
        if (jumpVel < 0) jumpVel = 0;
      }
      if (heroY >= 0) {
        heroY = 0;
        jumpVel = 0;
        g.isJumping = false;
        g.landT = Date.now();
      }
      g.heroY = heroY;
      g.jumpVel = jumpVel;
    };

    const drawOnGround = (
      c: CanvasRenderingContext2D,
      img: HTMLImageElement | null,
      src: { sx: number; sy: number; sw: number; sh: number },
      cx: number,
      drawW: number,
      groundY: number
    ) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const drawH = drawW * (src.sh / src.sw);
      c.drawImage(img, src.sx, src.sy, src.sw, src.sh, cx - drawW / 2, groundY - drawH, drawW, drawH);
    };

    const drawScene = () => {
      const c = ctx;
      const W = canvas.width;
      const H = canvas.height;
      const scale = sceneScale(W, H);
      const groundY = H * GROUND_Y_RATIO;
      const now = Date.now();
      const t = now / 1000;
      const { typed, isComplete, spacesTyped, endTime } = stateRef.current;
      const events = SPACE_EVENTS;

      const progress = TARGET.length > 0 ? typed / TARGET.length : 0;
      const targetX = heroXAt(progress) * W;
      const dt = g.lastFrameT != null ? Math.min(0.05, (now - g.lastFrameT) / 1000) : 0.016;
      g.lastFrameT = now;
      if (g.dispX == null) g.dispX = targetX;
      g.dispX += (targetX - g.dispX) * (1 - Math.exp(-9 * dt));
      const heroX = g.dispX;
      const moving = Math.abs(targetX - g.dispX) > 1.5 * scale;

      if (g.bgImg!.complete && g.bgImg!.naturalWidth > 0) {
        const bs = Math.max(W / BG_SRC.sw, H / BG_SRC.sh);
        const bdw = BG_SRC.sw * bs;
        c.drawImage(g.bgImg!, BG_SRC.sx, BG_SRC.sy, BG_SRC.sw, BG_SRC.sh, (W - bdw) / 2, 0, bdw, BG_SRC.sh * bs);
      } else {
        c.fillStyle = "#3FA9F5";
        c.fillRect(0, 0, W, H);
      }

      const drawCloud = (variant: number, cx: number, cy: number, alpha: number) => {
        if (!g.cloudImg!.complete || g.cloudImg!.naturalWidth === 0) return;
        const src = CLOUD_SRC[variant];
        const dw = CLOUD_W[variant] * scale;
        const dh = dw * (src.sh / src.sw);
        c.globalAlpha = alpha;
        c.drawImage(g.cloudImg!, src.sx, src.sy, src.sw, src.sh, cx - dw / 2, cy - dh / 2, dw, dh);
        c.globalAlpha = 1;
      };
      const coFar = (now / 80) % (W + 200);
      const co = (now / 40) % (W + 200);
      drawCloud(0, ((W - coFar + 350) % (W + 200)) - 50, H * 0.06, 0.6);
      drawCloud(1, ((W - coFar + 780) % (W + 200)) - 50, H * 0.2, 0.6);
      drawCloud(1, ((W - co + 200) % (W + 200)) - 50, H * 0.12, 1);
      drawCloud(0, ((W - co + 600) % (W + 200)) - 50, H * 0.07, 1);
      drawCloud(1, ((W - co + 900) % (W + 200)) - 50, H * 0.18, 1);

      const groundH = H - groundY;
      if (g.groundImg!.complete && g.groundImg!.naturalWidth > 0 && groundH > 0) {
        const tileW = GROUND_SRC.sw * (groundH / GROUND_SRC.sh);
        const tiles = Math.ceil(W / tileW);
        for (let i = 0; i < tiles; i++) {
          c.drawImage(g.groundImg!, GROUND_SRC.sx, GROUND_SRC.sy, GROUND_SRC.sw, GROUND_SRC.sh, Math.floor(i * tileW), groundY, Math.ceil(tileW) + 1, groundH);
        }
      } else {
        c.fillStyle = "#4A9E28";
        c.fillRect(0, groundY, W, groundH);
      }

      drawOnGround(c, g.castleImg, CASTLE_SRC, GOAL_X * W, CASTLE_H * (CASTLE_SRC.sw / CASTLE_SRC.sh) * scale, groundY);
      GOAL_BUSH_X.forEach((bx, i) => drawOnGround(c, g.plantImg, PLANT_SRC[i % PLANT_SRC.length], bx * W, BUSH_W * scale, groundY));
      drawOnGround(c, g.treeImg, TREE_SRC, TREE_X * W, (BLOCK_GAP + BLOCK_SIZE / 2) * (TREE_SRC.sw / TREE_SRC.sh) * scale, groundY);
      drawOnGround(c, g.seatImg, SEAT_SRC, SEAT_X * W, SEAT_W * scale, groundY);

      const pipeW = 48 * scale;
      const pipeH = 56 * scale;
      const pipeX = PIPE_X * W;
      const pipeY = groundY - pipeH;
      c.fillStyle = "#1B8C1B";
      c.fillRect(pipeX - 4 * scale, pipeY, pipeW + 8 * scale, 12 * scale);
      c.fillStyle = "#30C030";
      c.fillRect(pipeX - 2 * scale, pipeY + 2 * scale, 6 * scale, 8 * scale);
      c.fillStyle = "#0A6B0A";
      c.fillRect(pipeX + pipeW - 2 * scale, pipeY + 2 * scale, 6 * scale, 8 * scale);
      c.fillStyle = "#1B8C1B";
      c.fillRect(pipeX, pipeY + 12 * scale, pipeW, pipeH - 12 * scale);
      c.fillStyle = "#30C030";
      c.fillRect(pipeX + 2 * scale, pipeY + 12 * scale, 4 * scale, pipeH - 12 * scale);
      c.fillStyle = "#0A6B0A";
      c.fillRect(pipeX + pipeW - 8 * scale, pipeY + 12 * scale, 8 * scale, pipeH - 12 * scale);
      c.fillStyle = "#60E060";
      c.fillRect(pipeX + 2 * scale, pipeY + 2 * scale, 4 * scale, 8 * scale);

      const blockSize = BLOCK_SIZE * scale;
      events.forEach((ev, i) => {
        if (!isBlockEvent(ev.kind)) return;
        const bx = ev.x * W - blockSize / 2;
        const used = i < spacesTyped;
        const hitAge = now - (g.blockHitT[i] ?? -Infinity);
        const bump = hitAge >= 0 && hitAge < BLOCK_BUMP_MS ? -Math.sin((hitAge / BLOCK_BUMP_MS) * Math.PI) * 8 * scale : 0;
        const bob = used ? 0 : Math.sin(t * 2 + i) * 2 * scale;
        const by = groundY - BLOCK_GAP * scale - blockSize + bob + bump;
        const u = blockSize / 14;
        c.fillStyle = BLOCK_EDGE;
        c.fillRect(bx, by, blockSize, blockSize);
        c.fillStyle = used ? BLOCK_USED_FACE : BLOCK_FACE;
        c.fillRect(bx + u, by + u, blockSize - 2 * u, blockSize - 2 * u);
        c.fillStyle = used ? BLOCK_USED_HI : BLOCK_HI;
        c.fillRect(bx + u, by + u, blockSize - 2 * u, u);
        c.fillRect(bx + u, by + u, u, blockSize - 2 * u);
        c.fillStyle = used ? BLOCK_USED_SHADOW : BLOCK_SHADOW;
        c.fillRect(bx + u, by + blockSize - 2 * u, blockSize - 2 * u, u);
        c.fillRect(bx + blockSize - 2 * u, by + u, u, blockSize - 2 * u);
        c.fillStyle = BLOCK_EDGE;
        [
          [2, 2],
          [11, 2],
          [2, 11],
          [11, 11],
        ].forEach(([rx, ry]) => c.fillRect(bx + rx * u, by + ry * u, u, u));
        if (used) return;
        c.fillStyle = BLOCK_GLYPH;
        c.fillRect(bx + blockSize * 0.35, by + blockSize * 0.2, blockSize * 0.3, blockSize * 0.15);
        c.fillRect(bx + blockSize * 0.5, by + blockSize * 0.35, blockSize * 0.15, blockSize * 0.2);
        c.fillRect(bx + blockSize * 0.42, by + blockSize * 0.6, blockSize * 0.15, blockSize * 0.1);
        c.fillRect(bx + blockSize * 0.42, by + blockSize * 0.75, blockSize * 0.15, blockSize * 0.1);
      });

      const coinReady = !!g.coinImg && g.coinImg.complete && g.coinImg.naturalWidth > 0;
      const coinW = COIN_DRAW_W * scale;
      const coinH = coinW * (COIN.ch / COIN.cw);
      const drawCoin = (cx: number, cy: number, phase: number, rot: number) => {
        if (coinReady) {
          const fi = Math.floor(now / 70 + phase) % COIN.frames;
          if (rot === 0) {
            c.drawImage(g.coinImg!, fi * COIN.cw, 0, COIN.cw, COIN.ch, cx - coinW / 2, cy - coinH / 2, coinW, coinH);
          } else {
            c.save();
            c.translate(cx, cy);
            c.rotate(rot);
            c.drawImage(g.coinImg!, fi * COIN.cw, 0, COIN.cw, COIN.ch, -coinW / 2, -coinH / 2, coinW, coinH);
            c.restore();
          }
        } else {
          c.fillStyle = "#FBD53A";
          c.beginPath();
          c.arc(cx, cy, coinW * 0.4, 0, Math.PI * 2);
          c.fill();
        }
      };
      const mushReady = !!g.mushImg && g.mushImg.complete && g.mushImg.naturalWidth > 0;
      const mushW = 28 * scale;
      const mushH = mushW * (MUSH_SRC.sh / MUSH_SRC.sw);
      const drawMushroom = (cx: number, cy: number, rot: number) => {
        if (mushReady) {
          c.save();
          c.translate(cx, cy);
          if (rot !== 0) c.rotate(rot);
          c.drawImage(g.mushImg!, MUSH_SRC.sx, MUSH_SRC.sy, MUSH_SRC.sw, MUSH_SRC.sh, -mushW / 2, -mushH / 2, mushW, mushH);
          c.restore();
        } else {
          c.fillStyle = "#E52521";
          c.beginPath();
          c.arc(cx, cy, mushW * 0.4, 0, Math.PI * 2);
          c.fill();
        }
      };

      events.forEach((ev, i) => {
        if (ev.kind !== "coin" || i < spacesTyped) return;
        drawCoin(ev.x * W, groundY - WALK_COIN_Y * scale + Math.sin(t * 3 + i * 1.2) * 4 * scale, i * 2, 0);
      });

      const chestCanvas = isComplete ? g.chestOpen : g.chestClosed;
      if (chestCanvas) {
        const chestK = (CHEST_W * scale) / CHEST_REF_W;
        const chestW = chestCanvas.width * chestK;
        const chestH = chestCanvas.height * chestK;
        const openAge = isComplete && endTime ? now - endTime : Infinity;
        const pop = openAge < 300 ? 1 + 0.22 * Math.sin((openAge / 300) * Math.PI) : 1;
        c.save();
        c.translate(GOAL_X * W, groundY);
        c.scale(pop, pop);
        c.drawImage(chestCanvas, -chestW / 2, -chestH, chestW, chestH);
        c.restore();
      }

      const heroH = HERO_DRAW_H * scale;
      const heroW = heroH * (HERO_CW / HERO_CH);
      const feetY = groundY + g.heroY * scale;
      let drawFeetY = feetY;
      if (isComplete) drawFeetY -= Math.abs(Math.sin(t * 4)) * 6 * scale;
      let frame: { r: number; c: number; flip?: boolean } = HERO_FRAMES.idle;
      if (isComplete) frame = HERO_FRAMES.victory;
      else if (g.isJumping) frame = HERO_FRAMES.jump;
      else if (moving || now - g.lastCorrectTime < 250) {
        const wf = HERO_FRAMES.walk;
        frame = wf[Math.floor(now / 110) % wf.length];
      }
      const landAge = now - (g.landT || 0);
      let sqx = 1;
      let sqy = 1;
      if (landAge < 180) {
        const k = 1 - landAge / 180;
        const ease = k * k;
        sqx = 1 + 0.16 * ease;
        sqy = 1 - 0.2 * ease;
      }
      if (g.heroImg!.complete && g.heroImg!.naturalWidth > 0) {
        c.save();
        c.translate(heroX + heroW / 2, drawFeetY);
        c.scale(sqx * (frame.flip ? -1 : 1), sqy);
        c.imageSmoothingEnabled = false;
        c.drawImage(g.heroImg!, frame.c * HERO_CW, frame.r * HERO_CH, HERO_CW, HERO_CH, -heroW / 2, -heroH, heroW, heroH);
        c.restore();
      }

      for (let i = g.pops.length - 1; i >= 0; i--) {
        const p = g.pops[i];
        if (p.delay > 0) {
          p.delay -= 1;
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += POP_GRAVITY * scale;
        p.life -= 1;
        if (p.life <= 0) {
          g.pops.splice(i, 1);
          continue;
        }
        c.globalAlpha = Math.min(1, p.life / POP_FADE);
        if (p.kind === "coin") drawCoin(p.x, p.y, i * 3, p.rot);
        else drawMushroom(p.x, p.y, p.rot);
        c.globalAlpha = 1;
      }

      const winkReady = !!g.winkImg && g.winkImg.complete && g.winkImg.naturalWidth > 0;
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.1;
        pt.life -= 1;
        if (pt.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }
        const alpha = Math.min(1, pt.life / 15);
        c.globalAlpha = alpha;
        const sz = 14 * scale;
        if (winkReady) {
          const wf = WINK_FRAMES[pt.frame % WINK_FRAMES.length];
          c.drawImage(g.winkImg!, wf.x, wf.y, wf.w, wf.h, pt.x - sz / 2, pt.y - sz / 2, sz, sz);
        } else {
          c.fillStyle = "#FBD53A";
          c.beginPath();
          c.arc(pt.x, pt.y, sz * 0.3, 0, Math.PI * 2);
          c.fill();
        }
        c.globalAlpha = 1;
      }
    };

    const onKeyDown = (e: { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; preventDefault: () => void }) => {
      const cur = stateRef.current;
      if (cur.isComplete) {
        if (e.key === "Enter") {
          g.dispX = null;
          g.landT = 0;
          g.pops = [];
          g.blockHitT = {};
          g.particles = [];
          g.heroY = 0;
          g.jumpVel = 0;
          g.isJumping = false;
          updateState({ ...initialGameState, capsOn: cur.capsOn });
        }
        return;
      }
      if (e.key.length > 1 && e.key !== "Backspace") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Backspace") return;
      e.preventDefault();
      if (cur.typed >= TARGET.length) return;
      const now = Date.now();
      const expected = TARGET[cur.typed];
      if (e.key === expected) {
        const newTyped = cur.typed + 1;
        const newStart = cur.startTime || now;
        const canvasEl = canvasRef.current!;
        const W = canvasEl.width;
        const H = canvasEl.height;
        const scale = sceneScale(W, H);
        const groundY = H * GROUND_Y_RATIO;
        const heroPx = g.dispX != null ? g.dispX : W * HERO_START_X;
        for (let i = 0; i < 3; i++) {
          g.particles.push({
            x: heroPx + 20,
            y: groundY - HERO_DRAW_H * 0.5 * scale,
            vx: (Math.random() - 0.5) * 3,
            vy: -2 - Math.random() * 3,
            life: 30 + Math.random() * 20,
            frame: Math.floor(Math.random() * 4),
          });
        }
        let spacesTyped = cur.spacesTyped;
        if (e.key === " ") {
          const evIdx = cur.spacesTyped;
          const ev = SPACE_EVENTS[evIdx];
          if (ev) {
            const evPx = ev.x * W;
            if (isBlockEvent(ev.kind)) {
              if (!g.isJumping) {
                g.jumpVel = JUMP_VEL;
                g.isJumping = true;
              }
              const ceiling = BLOCK_GAP - HERO_DRAW_H;
              const framesToCeil = Math.max(1, Math.round((-JUMP_VEL - Math.sqrt(Math.max(0, JUMP_VEL * JUMP_VEL - 2 * GRAVITY * ceiling))) / GRAVITY));
              g.blockHitT[evIdx] = now + (framesToCeil * 1000) / 60;
              g.pops.push({
                kind: ev.kind === "block-coin" ? "coin" : "mushroom",
                x: evPx,
                y: groundY - BLOCK_GAP * scale,
                vx: ev.tilt * POP_VX * scale,
                vy: POP_VY * scale,
                rot: ev.tilt * POP_TILT_RAD,
                delay: framesToCeil,
                life: POP_LIFE,
              });
            } else {
              for (let j = 0; j < 8; j++) {
                g.particles.push({
                  x: evPx,
                  y: groundY - WALK_COIN_Y * scale,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -3 - Math.random() * 4,
                  life: 40 + Math.random() * 20,
                  frame: Math.floor(Math.random() * 4),
                });
              }
            }
          }
          spacesTyped++;
        }
        g.lastCorrectTime = now;
        const isDone = newTyped >= TARGET.length;
        if (isDone) {
          for (let i = 0; i < 30; i++) {
            g.particles.push({
              x: W * (0.2 + Math.random() * 0.6),
              y: H * (0.3 + Math.random() * 0.3),
              vx: (Math.random() - 0.5) * 5,
              vy: -3 - Math.random() * 4,
              life: 60 + Math.random() * 40,
              frame: Math.floor(Math.random() * 4),
            });
          }
        }
        updateState({
          typed: newTyped,
          totalKeystrokes: cur.totalKeystrokes + 1,
          startTime: newStart,
          endTime: isDone ? now : null,
          isComplete: isDone,
          spacesTyped,
          started: true,
        });
      } else {
        updateState((prev) => ({
          errors: prev.errors + 1,
          totalKeystrokes: prev.totalKeystrokes + 1,
          startTime: prev.startTime || now,
          started: true,
          isPanelError: true,
        }));
        const flash = errorFlashRef.current;
        if (flash) {
          flash.style.opacity = "1";
          setTimeout(() => {
            if (flash) flash.style.opacity = "0";
          }, 180);
        }
        window.clearTimeout(errTimeoutHandle.current);
        errTimeoutHandle.current = window.setTimeout(() => updateState({ isPanelError: false }), 350);
      }
    };
    handleKeyDownRef.current = onKeyDown;

    const keydownListener = (e: KeyboardEvent) => onKeyDown(e);
    document.addEventListener("keydown", keydownListener);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    rootRef.current?.focus();

    let raf = 0;
    const loop = () => {
      updatePhysics();
      drawScene();
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Live WPM needs the wall clock (Date.now()), which is impure and so isn't allowed
    // during render - computed here in an effect-driven interval instead, and handed to
    // render as plain state.
    const liveInt = window.setInterval(() => {
      const s = stateRef.current;
      if (s.started && !s.isComplete && s.startTime) {
        const elapsed = (Date.now() - s.startTime) / 1000;
        setLiveWpm(elapsed > 0 ? Math.round(s.typed / 5 / (elapsed / 60)) : 0);
      }
    }, 300);

    return () => {
      document.removeEventListener("keydown", keydownListener);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(raf);
      window.clearTimeout(errTimeoutHandle.current);
      window.clearInterval(liveInt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vkPress = (ch: string) => {
    const key = stateRef.current.capsOn ? ch.toUpperCase() : ch;
    handleKeyDownRef.current({ key, preventDefault: () => {} });
    if (stateRef.current.capsOn) updateState({ capsOn: false });
  };
  const vkSpace = () => handleKeyDownRef.current({ key: " ", preventDefault: () => {} });
  const vkShift = () => updateState((s) => ({ capsOn: !s.capsOn }));

  const { typed, isComplete, spacesTyped, startTime, endTime, totalKeystrokes, errors, started, isPanelError, capsOn } = game;

  const coinsCollected = SPACE_EVENTS.slice(0, spacesTyped).filter((ev) => givesCoin(ev.kind)).length;
  let wpm = 0;
  let accuracy = 100;
  let timeStr = "0.0";
  if (isComplete && startTime && endTime) {
    const elapsed = (endTime - startTime) / 1000;
    wpm = Math.round(TARGET.length / 5 / (elapsed / 60));
    accuracy = Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100);
    timeStr = elapsed.toFixed(1);
  }
  let textBottomPx: number | null = null;
  if (viewport) {
    const scale = sceneScale(viewport.w, viewport.h);
    const blockTop = viewport.h * GROUND_Y_RATIO - (BLOCK_GAP + BLOCK_SIZE) * scale;
    textBottomPx = blockTop - TEXT_GAP_ABOVE_BLOCK * scale;
  }

  const showStart = !started && !isComplete;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#5C94FC",
        fontFamily: "var(--font-press-start), monospace",
      }}
    >
      <div
        ref={rootRef}
        className="typing-game-scene"
        tabIndex={0}
        style={{ position: "absolute", inset: 0, overflow: "hidden", outline: "none" }}
      >
        <canvas ref={canvasRef} width={960} height={540} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", imageRendering: "pixelated" }} />

      <div
        style={{
          position: "absolute",
          left: "50%",
          width: "90%",
          maxWidth: 800,
          transform: "translate(-50%,-100%)",
          top: textBottomPx != null ? `${textBottomPx}px` : "30%",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div style={{ animation: isPanelError ? "softShake .3s ease" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(7px, 1.4vw, 13px)", lineHeight: 2.1, whiteSpace: "nowrap" }}>
              {Array.from(TARGET).map((rawCh, i) => {
                const ch = rawCh === " " ? " " : rawCh;
                const base: React.CSSProperties = { display: "inline-block", borderBottom: "2px solid transparent", padding: "0 0.5px" };
                let style: React.CSSProperties;
                if (i < typed) style = { ...base, color: "#FFD763", textShadow: "1px 1px 0 #000, 2px 2px 0 rgba(0,0,0,.5)", animation: i === typed - 1 ? "charPop .18s ease-out" : "none" };
                else if (i === typed) style = { ...base, borderBottomColor: "#FBD53A", color: "#fff", animation: "caretGlow 1s ease-in-out infinite" };
                else style = { ...base, color: "rgba(255,255,255,.2)", textShadow: "1px 1px 0 rgba(0,0,0,.6)" };
                return (
                  <span key={i} style={style}>
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 22,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(11,18,32,.38)",
          padding: "8px 14px",
          fontSize: 12,
          color: "#FBD53A",
          pointerEvents: "none",
          backdropFilter: "blur(8px)",
          textShadow: "1px 1px 0 #000",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <NextImage src="/images/game-coin.png" alt="" width={101} height={96} sizes="1.4em" style={{ height: "1.4em", width: "auto", imageRendering: "pixelated" }} />
          <span>x{coinsCollected}</span>
        </span>
        <span style={{ color: "#fff" }}>
          {typed}/{TARGET.length}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          zIndex: 5,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(11,18,32,.38)",
          padding: "8px 14px",
          fontSize: 12,
          color: "#88ccff",
          pointerEvents: "none",
          backdropFilter: "blur(8px)",
          textShadow: "1px 1px 0 #000",
        }}
      >
        {started && !isComplete ? `${liveWpm} WPM` : "— WPM"}
      </div>

      <div
        ref={errorFlashRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity .25s",
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(255,50,50,.38) 100%)",
        }}
      />

      {showStart && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.45)",
            backdropFilter: "blur(7px)",
            animation: "fadeIn .3s ease",
          }}
        >
          <div style={{ marginBottom: 20, fontSize: "clamp(20px,4vw,34px)", textAlign: "center", lineHeight: 1.6, color: "#FBD53A", textShadow: "3px 3px 0 #000", animation: "floatY 3s ease-in-out infinite" }}>
            WELCOME TO
            <br />
            MY PORTFOLIO !
          </div>
          <span style={{ fontSize: 13, color: "#fff", textShadow: "2px 2px 0 #000" }}>
            <span style={{ animation: "blinkCursor 1s step-end infinite", display: "inline-block" }}>{"▸"}</span> TYPING TO START
          </span>
        </div>
      )}

      {isComplete && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.55)",
            backdropFilter: "blur(3px)",
            animation: "fadeIn .3s ease",
          }}
        >
          <div style={{ marginBottom: 18, fontSize: "clamp(16px,3.4vw,26px)", color: "#FBD53A", textShadow: "3px 3px 0 #b8860b", animation: "levelClearPop .4s cubic-bezier(.2,1,.3,1)" }}>
            LEVEL CLEAR!
          </div>
          <div style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(11,18,32,.38)", padding: "10px 16px", fontSize: "clamp(9px,2vw,13px)", color: "#fff", backdropFilter: "blur(8px)", textShadow: "1px 1px 0 #000" }}>
            WPM: <span style={{ color: "#FBD53A" }}>{wpm}</span>
            &nbsp;&middot;&nbsp;ACC: <span style={{ color: "#5eff5e" }}>{accuracy}</span>%&nbsp;&middot;&nbsp;TIME: <span style={{ color: "#88ccff" }}>{timeStr}</span>s
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ marginTop: 18, border: 0, borderRadius: 8, background: "#FBD53A", color: "#0B1220", padding: "12px 22px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 0 #9a7a10" }}
          >
            Close {"▶"}
          </button>
          <div style={{ marginTop: 14, fontSize: 9, color: "rgba(255,255,255,.55)", textShadow: "1px 1px 0 #000" }}>
            <span style={{ animation: "blinkCursor 1s step-end infinite", display: "inline-block" }}>PRESS ENTER TO REPLAY</span>
          </div>
        </div>
      )}

      </div>

      <VirtualKeyboard capsOn={capsOn} onPress={vkPress} onSpace={vkSpace} onShift={vkShift} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes blinkCursor { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes levelClearPop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
        @keyframes softShake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }
        @keyframes charPop { 0% { transform: scale(1.5) } 100% { transform: scale(1) } }
        @keyframes caretGlow { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        .vk-panel { display: none; }
        @media (max-width: 768px) {
          .typing-game-scene { bottom: 178px !important; }
          .vk-panel { display: flex; position: absolute !important; }
        }
      `}</style>
    </div>
  );
}

// On-screen keyboard for touch devices (no physical keyboard) - hidden on desktop by the
// .vk-panel media query above. Every key routes through the same handleKeyDown the real
// keydown listener uses, so there's no separate input path to keep in sync.
function VirtualKeyboard({
  capsOn,
  onPress,
  onSpace,
  onShift,
}: {
  capsOn: boolean;
  onPress: (ch: string) => void;
  onSpace: () => void;
  onShift: () => void;
}) {
  const keyStyle = (flexBasis?: string): React.CSSProperties => ({
    flex: flexBasis ? `0 0 ${flexBasis}` : "1 1 0",
    minWidth: 0,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,.28)",
    background: "rgba(255,255,255,.14)",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: 13,
    padding: 0,
  });

  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  return (
    <div
      className="vk-panel"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        flexDirection: "column",
        gap: 6,
        padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
        background: "rgba(8,12,22,.82)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,.15)",
      }}
    >
      {rows.map((row) => (
        <div key={row} style={{ display: "flex", gap: 5 }}>
          {row.split("").map((ch) => (
            <button key={ch} type="button" onClick={() => onPress(ch)} style={keyStyle()}>
              {capsOn ? ch.toUpperCase() : ch}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", gap: 5 }}>
        <button
          type="button"
          aria-label="Shift"
          onClick={onShift}
          style={{ ...keyStyle("46px"), ...(capsOn ? { background: "#FBD53A", color: "#0B1220" } : {}) }}
        >
          {"⇧"}
        </button>
        <button type="button" onClick={() => onPress(",")} style={keyStyle("40px")}>
          ,
        </button>
        <button type="button" onClick={() => onPress("'")} style={keyStyle("40px")}>
          &apos;
        </button>
        <button type="button" onClick={() => onPress(".")} style={keyStyle("40px")}>
          .
        </button>
        <button type="button" aria-label="Space" onClick={onSpace} style={keyStyle("50%")}>
          space
        </button>
      </div>
    </div>
  );
}
