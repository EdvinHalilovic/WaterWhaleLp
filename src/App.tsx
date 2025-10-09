import { useEffect, useState } from "react";
import Slot from "./Components/Slot";
import Speaker from "./assets/Speaker";
import MobileLayout from "./MobileLayout";

function App() {
  // ✅ detekcija mobilnog ekrana
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ mobilna verzija
  if (isMobile) {
    return <MobileLayout />;
  }

  // ✅ tvoj desktop layout (nepromijenjen)
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
        position: "relative",
      }}
    >
      {/* 🔊 Speaker ikonica gore desno */}
      <Speaker />

      {/* 🐳 Blue Whale */}
      <img
        src="/BlueWhale.png"
        alt="Blue Whale"
        style={{
          position: "absolute",
          top: "clamp(9%, 12vh, 15%)",
          right: "clamp(0%, 0vw, 0%)",
          width: "clamp(90px, 10vw, 162px)",
          height: "auto",
          flexShrink: 0,
          aspectRatio: "1 / 1",
          zIndex: 4,
          animation: "floatWhale 7s ease-in-out infinite",
          pointerEvents: "none",
          userSelect: "none",
          imageRendering: "auto",
          backgroundColor: "transparent",
          mixBlendMode: "screen",
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

      {/* 🏠 DogHouse */}
      <img
        src="/DogHouseBg.png"
        alt="Dog House"
        style={{
          position: "absolute",
          top: "clamp(3%, 5vh, 6%)",
          left: "clamp(-2%, -0.7vw, -0.3%)",
          width: "clamp(90px, 10vw, 142px)",
          height: "auto",
          transform: "rotate(15deg)",
          flexShrink: 0,
          aspectRatio: "1 / 1",
          zIndex: 4,
          pointerEvents: "none",
          userSelect: "none",
          animation: "float 5s ease-in-out infinite",
        }}
      />

      <style>
        {`
        @keyframes float {
          0% { transform: rotate(15deg) translateY(0); }
          50% { transform: rotate(12deg) translateY(-8px); }
          100% { transform: rotate(15deg) translateY(0); }
        }
      `}
      </style>
      <img
        src="/whale.ioLogo.svg"
        alt="Whale.io Logo"
        style={{
          width: "clamp(120px, 18vw, 180px)",
          height: "auto",
          aspectRatio: "15 / 4",
          flexShrink: 0,
          marginBottom: "1.5rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* 🎰 Slot komponenta */}
      <Slot />

      {/* 🌿 Golden Seaweed dekoracija */}
      <img
        src="/GoldenSeaWeed.png"
        alt="Golden Seaweed"
        style={{
          position: "absolute",
          bottom: "3vh",
          left: "-6vh",
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
