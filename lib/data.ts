export const EMAIL = "thanyamusik@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/thanyaporn-m-044879380/";
export const MAILTO = `mailto:${EMAIL}`;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const ABOUT_TEXT =
  "I don't aim to be the smartest person on the team. I'd rather be the one who's growing the fastest — absorbing techniques from the people around me, sharing what I know, and taking on problems hard enough that I have to level up to solve them.";

export interface SkillIcon {
  slug: string;
  color: string;
}

export const ICONS: Record<string, SkillIcon> = {
  JavaScript: { slug: "javascript", color: "F7DF1E" },
  TypeScript: { slug: "typescript", color: "3178C6" },
  Go: { slug: "go", color: "00ADD8" },
  "React.js": { slug: "react", color: "61DAFB" },
  "Next.js": { slug: "nextdotjs", color: "ffffff" },
  "Electron.js": { slug: "electron", color: "47848F" },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4" },
  MUI: { slug: "mui", color: "007FFF" },
  "Ant Design": { slug: "antdesign", color: "0170FE" },
  "Node.js": { slug: "nodedotjs", color: "5FA04E" },
  NestJS: { slug: "nestjs", color: "E0234E" },
  "Express.js": { slug: "express", color: "ffffff" },
  Fiber: { slug: "", color: "00ADD8" },
  TypeORM: { slug: "typeorm", color: "E83524" },
  "Sequelize ORM": { slug: "sequelize", color: "52B0E7" },
  "RESTful API": { slug: "", color: "8B5CF6" },
  JWT: { slug: "jsonwebtokens", color: "ffffff" },
  PostgreSQL: { slug: "postgresql", color: "4169E1" },
  Docker: { slug: "docker", color: "2496ED" },
  Postman: { slug: "postman", color: "FF6C37" },
  Fork: { slug: "", color: "8B5CF6" },
  GitLab: { slug: "gitlab", color: "FC6D26" },
  Jira: { slug: "jira", color: "0052CC" },
  Claude: { slug: "claude", color: "D97757" },
};

export function iconUrl(name: string): string {
  const e = ICONS[name];
  return e && e.slug ? `https://cdn.simpleicons.org/${e.slug}/${e.color}` : "";
}

export interface SkillCategory {
  no: string;
  title: string;
  skills: string[];
}

export const SKILLS: SkillCategory[] = [
  { no: "01", title: "Languages", skills: ["JavaScript", "TypeScript", "Go"] },
  { no: "02", title: "Frontend", skills: ["React.js", "Next.js", "Electron.js", "Tailwind CSS", "MUI", "Ant Design"] },
  { no: "03", title: "Backend & API", skills: ["Node.js", "NestJS", "Express.js", "Fiber", "TypeORM", "Sequelize ORM", "RESTful API", "JWT"] },
  { no: "04", title: "Database & Tools", skills: ["PostgreSQL", "Docker", "Postman", "Fork", "GitLab", "Jira", "Claude"] },
];

export interface Project {
  tag: string;
  title: string;
  image: string;
  desc: string;
  tech: string[];
  desktop?: boolean;
}

export const PROJECTS: Project[] = [
  {
    tag: "Software Engineer",
    title: "University Demo",
    image: "/projects/university.png",
    desc: "Role-based system for admins, instructors and students — enrollment, grading, evaluation and real-time chat via Socket.io.",
    tech: ["Node.js", "Express.js", "Socket.io", "SQL", "Postgres", "Next.js"],
    desktop: true,
  },
  {
    tag: "Desktop + Web",
    title: "Final Project Iron QC System",
    image: "/projects/iron.png",
    desc: "Factory QC tool streaming real-time Arduino sensor data into an Electron app, with calibrated readings and a Next.js dashboard for managers.",
    tech: ["Electron.js", "Arduino", "Next.js"],
  },
];

export type DesktopFileType = "video" | "image" | "game";

export interface DesktopFile {
  label: string;
  type: DesktopFileType;
  src: string;
  icon?: string;
  ext: string;
  width?: number;
  height?: number;
}

export const DESKTOP_FILES: DesktopFile[] = [
  { label: "overview.mp4", type: "video", src: "/uploads/overview-21e61442.mp4", icon: "/uploads/pasted-1790515287032-0.png", ext: "MP4" },
  { label: "User Registration List", type: "image", src: "/uploads/images-1790510303585-1hx2.png", ext: "PNG", width: 1708, height: 1542 },
  { label: "Student Registration", type: "image", src: "/uploads/images-1790510302563-nyk4.png", ext: "PNG", width: 648, height: 1426 },
  { label: "Student Profile", type: "image", src: "/uploads/images-1790510303581-p03k.png", ext: "PNG", width: 654, height: 1370 },
  { label: "Course Management", type: "image", src: "/uploads/images-1790510310207-s69d.png", ext: "PNG", width: 652, height: 1366 },
  { label: "Instructor Course Registration", type: "image", src: "/uploads/images-1790510296335-9t0e.png", ext: "PNG", width: 644, height: 1424 },
  { label: "Instructor Profile", type: "image", src: "/uploads/images-1790510303579-j4hn.png", ext: "PNG", width: 642, height: 1422 },
  { label: "Instructor Contact List", type: "image", src: "/uploads/images-1790510296330-a0cc.png", ext: "PNG", width: 2996, height: 1600 },
  { label: "Real-time Chat", type: "image", src: "/uploads/images-1790510303572-6wd6.png", ext: "PNG", width: 3022, height: 1608 },
  { label: "Grade Management", type: "image", src: "/uploads/images-1790510310904-hamx.png", ext: "PNG", width: 1698, height: 1604 },
  { label: "Evaluation Form", type: "image", src: "/uploads/images-1790510303571-94py.png", ext: "PNG", width: 658, height: 1414 },
];

export const GAME_FILE: DesktopFile = {
  label: "Game",
  type: "game",
  src: "",
  icon: "/uploads/1e64536d37f0a9144989cb113f42a59b-removebg-preview.png",
  ext: "APP",
};

// Bento-grid layout for the Experience section. `gridArea` matches the
// grid-template-areas string defined in Experience.tsx. Slots without
// `images`/`link` render as numbered placeholders until real content is assigned.
export interface ExperienceCard {
  no: number;
  gridArea: string;
  // Only the hero card opens the full modal (carousel + bullets). Other
  // filled cells are simple hover-flip link tiles - see components/Experience.tsx.
  hero?: boolean;
  period?: string;
  title?: string;
  bullets?: string[];
  images?: string[];
  link?: string;
  // Flat-color "wordmark" tiles (no photo, no click) - see TextTile in Experience.tsx.
  accent?: string;
}

export const EXPERIENCE_CARDS: ExperienceCard[] = [
  { no: 1, gridArea: "a", images: ["/experience/pawn-shop-mascot.jpg"] },
  { no: 2, gridArea: "b", title: "PAWN SHOP", accent: "#2b7fd6" },
  {
    no: 3,
    gridArea: "c",
    hero: true,
    period: "Jan 2026 — Present",
    title: "Salary Advance Platform",
    bullets: [
      "Collaborated with operations teams to translate business pain points into Back Office workflow improvements.",
      "Built a standalone Go service using Clean Architecture to generate PDF reports by integrating with a legacy PostgreSQL database, enabling interoperability without data migration.",
      "Designed an asynchronous report processing pipeline using a message queue.",
      "Implemented resumable batch processing to recover interrupted jobs without restarting the entire workload.",
    ],
    images: ["/experience/pah-advance-1.jpg", "/experience/pah-advance-2.jpg", "/experience/pah-advance-3.jpg"],
    link: "https://www.jventures.co.th/pah-advance",
  },
  {
    no: 6,
    gridArea: "f",
    hero: true,
    period: "Jan 2026 — Present",
    title: "Pawn Shop CRM — LINE OA loyalty",
    bullets: [
      "Built two-step verification with LINE Login, email OTP, Redis rate limiting, throttling, and brute-force lockout.",
      "Developed consent management with grant/revoke lifecycle for data privacy compliance.",
      "Implemented RBAC across frontend and API layers with request validation.",
      "Integrated LINE LIFF for in-app customer experiences within LINE OA.",
      "Built a multi-condition coupon engine with scheduled status updates.",
      "Developed bulk import/export and performed load testing for large data volumes.",
      "Implemented activity/audit logging and Zustand for client-side state management.",
    ],
    images: [
      "/experience/pawn-shop-splash.png",
      "/experience/pawn-shop-register.png",
      "/experience/pawn-shop-email.png",
      "/experience/pawn-shop-home.png",
      "/experience/pawn-shop-coupon.png",
      "/experience/pawn-shop-backoffice.webp",
    ],
    link: "https://loyalty.pawn.co.th/",
  },
  { no: 7, gridArea: "g", title: "PAH +", accent: "#d6272b" },
  { no: 8, gridArea: "h", images: ["/experience/pah-icon.png"] },
];

export const MARQUEE_ITEMS = [
  { a: "Go · NestJS · Next.js · PostgreSQL", b: "in production" },
  { a: "Go · NestJS · Next.js · PostgreSQL", b: "in production" },
];

export const STATS = [
  { value: "5", label: "PROJECTS" },
  { value: "2026", label: "FULL-TIME" },
];

export const FLOATING_TAGS = ["NEXT.JS · NESTJS", "JAVASCRIPT · TYPESCRIPT", "POSTGRES"];
