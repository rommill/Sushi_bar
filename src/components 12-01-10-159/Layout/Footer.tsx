import ContactMap3D from "./Footer/ContactMap3D";

export default function Footer() {
  return (
    <footer
      className="footer-main"
      style={{ background: "#000", paddingBottom: "50px" }}
    >
      {/* Сначала идет наша 3D карта */}
      <ContactMap3D />

      {/* Затем текстовая информация */}
      <div
        style={{
          textAlign: "center",
          color: "#555",
          marginTop: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <span style={{ margin: "0 15px", cursor: "pointer" }}>Instagram</span>
          <span style={{ margin: "0 15px", cursor: "pointer" }}>Facebook</span>
          <span style={{ margin: "0 15px", cursor: "pointer" }}>
            Contact Us
          </span>
        </div>
        <p>© 2026 Crafted with ❤️ for Sushi Lovers</p>
      </div>
    </footer>
  );
}
