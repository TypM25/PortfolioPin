import { LINKEDIN } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        padding: "42px 32px",
        fontSize: 13,
        color: "hsl(0 0% 58%)",
        borderTop: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <span>&copy; 2026 Thanyaporn Musikpodok &mdash; Software Engineer</span>
      <div style={{ display: "flex", gap: 22 }}>
        <a href="#home">Top</a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
