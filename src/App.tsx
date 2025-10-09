import { useEffect, useState, useRef } from "react";
import Slot from "./Components/Slot";
import Speaker from "./assets/Speaker";
import MobileLayout from "./MobileLayout";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 📱 detekcija mobilnog ekrana
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎵 inicijalizacija zvuka
  useEffect(() => {
    const audio = new Audio("/SlotSoundE.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;
  }, []);

  // 📱 mobilni layout
  if (isMobile) {
    return <MobileLayout />;
  }

  // 💻 desktop layout
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
      {/* 🔊 Speaker ikonica mute/unmute */}
      <Speaker
        muted={muted}
        onToggle={() => {
          setMuted((prev) => !prev);
          if (audioRef.current) {
            if (muted) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
          }
        }}
      />

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
          zIndex: 4,
          animation: "floatWhale 7s ease-in-out infinite",
          pointerEvents: "none",
          userSelect: "none",
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
          zIndex: 4,
          animation: "float 5s ease-in-out infinite",
          pointerEvents: "none",
          userSelect: "none",
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

      {/* 🐋 Whale.io Logo */}
      <img
        src="/whale.ioLogo.svg"
        alt="Whale.io Logo"
        style={{
          width: "clamp(120px, 18vw, 180px)",
          height: "auto",
          marginBottom: "1.5rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* 🎰 Slot komponenta (prima mute i audioRef) */}
      <Slot muted={muted} audioRef={audioRef} />

      {/* 🌿 Golden Seaweed */}
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
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default App;
