import Slot from "./Components/Slot";
import Speaker from "./assets/Speaker";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative", // ✅ potrebno za absolute positioning
      }}
    >
      {/* 🔊 Speaker ikonica gore desno */}
      <Speaker />
      <img
        src="/BlueWhale.png"
        alt="Blue Whale"
        style={{
          position: "absolute",
          top: "clamp(9%, 12vh, 15%)", // ⬆️ tačno ispod zvučnika
          right: "clamp(0%, 0vw, 0%)", // ➡️ uz desni rub ekrana
          width: "clamp(90px, 10vw, 162px)", // 📱 responsive širina
          height: "auto",
          flexShrink: 0,
          aspectRatio: "1 / 1",
          zIndex: 4,
          animation: "floatWhale 7s ease-in-out infinite",
          pointerEvents: "none",
          userSelect: "none",

          /* ✨ Ako PNG ima tamnu pozadinu — ovo je vizualni fix */
          imageRendering: "auto",
          backgroundColor: "transparent",
          mixBlendMode: "screen", // 💧 izbaci sivu nijansu i omekša ivice
          filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.25))",
        }}
      />

      <style>
        {`
    @keyframes floatWhale {
      0%   { transform: translateY(0); }
      50%  { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
  `}
      </style>

      <style>
        {`
    @keyframes floatSpeaker {
      0%   { transform: rotate(-15deg) translateY(0); }
      50%  { transform: rotate(-18deg) translateY(-8px); }
      100% { transform: rotate(-15deg) translateY(0); }
    }
  `}
      </style>

      <img
        src="/dogHouse.png"
        alt="Dog House"
        style={{
          position: "absolute",
          top: "clamp(3%, 5vh, 6%)",
          left: "clamp(-4%, -2.7vw, -2%)",
          width: "clamp(90px, 10vw, 142px)",
          height: "auto",
          transform: "rotate(15deg)",
          flexShrink: 0,
          aspectRatio: "1 / 1",
          zIndex: 4,
          pointerEvents: "none",
          userSelect: "none",
          animation: "float 5s ease-in-out infinite", // 🫧 dodano
        }}
      />

      <style>
        {`
    @keyframes float {
      0% { transform: rotate(15deg) translateY(0); }
      50% { transform: rotate(12deg) translateY(-8px); } /* lagano gore */
      100% { transform: rotate(15deg) translateY(0); }
    }
  `}
      </style>

      <Slot />

      {/* 🌿 Golden Seaweed dekoracija */}
      <img
        src="/GoldenSeaWeed.png"
        alt="Golden Seaweed"
        style={{
          position: "absolute",
          bottom: "3vh",
          left: "-6vh", // ✅ sada je skroz u lijevom uglu
          width: "clamp(80px, 12vw, 160.66px)",
          height: "auto",
          transform: "rotate(30deg)",
          transformOrigin: "bottom left",
          flexShrink: 0,
          aspectRatio: "160.66 / 129.32",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default App;
