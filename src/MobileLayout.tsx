import React, { useEffect, useState, useRef } from "react";
import Speaker from "./assets/Speaker";
import MobileSlot from "./Components/MobileSlot";

const MobileLayout: React.FC = () => {
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 inicijalizacija zvuka
  useEffect(() => {
    const audio = new Audio("/SlotSoundE.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url('/mobileWaterBg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "var(--app-height)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🔊 Speaker mute/unmute */}
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
          top: "8vh",
          right: "1vw",
          width: "clamp(70px, 14vw, 110px)",
          height: "auto",
          zIndex: 6,
          animation: "floatWhale 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 🏠 Dog House */}
      <img
        src="/DogHouseBg.png"
        alt="Dog House"
        style={{
          position: "absolute",
          top: "8vh",
          left: "-2vw",
          transform: "rotate(12deg)",
          zIndex: 5,
          animation: "float 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 🐋 Whale.io Logo */}
      <img
        src="/whale.ioLogo.svg"
        alt="Whale.io Logo"
        style={{
          position: "absolute",
          top: "2vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(100px, 40vw, 160px)",
          height: "auto",
          userSelect: "none",
          zIndex: 8,
        }}
      />

      {/* 🎰 Mobile Slot (prima isti props kao desktop) */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "5vh",
          marginTop: "10vh",
          width: "80vw",
          maxWidth: "420px",
          zIndex: 5,
        }}
      >
        <MobileSlot muted={muted} audioRef={audioRef} />
        {/* 🪙 GOLD COIN DECORATION */}
        {/* 🪙 GOLD COIN DECORATION */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "min(6vw, 28px)",
            marginTop: "min(1.5vh, 10px)",
            marginLeft: "75%",
          }}
        >
          <img
            src="/goldCoin.png"
            alt="Golden Coin"
            style={{
              width: "clamp(70px, 30vw, 90.297px)", // fiksno iz dizajna ali skalabilno
              height: "auto",

              aspectRatio: "70.30 / 71.86",
              transform: "rotate(-15deg)",
              flexShrink: 0,
              objectFit: "contain",
              animation: "coinFloat 3s ease-in-out infinite",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* 🌿 Golden Seaweed */}
      <img
        src="/GoldenSeaWeed.png"
        alt="Golden SeaWeed"
        style={{
          position: "absolute",
          bottom: "-1vh",
          left: "-5vw",
          width: "clamp(90px, 24vw, 160px)",
          height: "auto",
          transform: "rotate(25deg)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* 🌊 Animacije */}
      <style>
        {`
          @keyframes floatWhale {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }
          @keyframes float {
            0% { transform: rotate(12deg) translateY(0); }
            50% { transform: rotate(10deg) translateY(-6px); }
            100% { transform: rotate(12deg) translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default MobileLayout;
