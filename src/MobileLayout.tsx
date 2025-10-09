import React from "react";

import Speaker from "./assets/Speaker";
import MobileSlot from "./Components/MobileSlot";

const MobileLayout: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/mobileWaterBg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        position: "relative",
      }}
    >
      {/* 🔊 Speaker */}
      <div
        style={{
          position: "absolute",
          top: "2vh",
          right: "4vw",
          zIndex: 10,
        }}
      >
        <Speaker />
      </div>

      {/* 🐳 Blue Whale */}
      <img
        src="/BlueWhale.png"
        alt="Blue Whale"
        style={{
          position: "absolute",
          top: "8vh",
          right: "3vw",
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

      {/* 🎰 SLOT — centralni element */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10vh", // dodaj da se slot spusti malo ispod loga
          width: "80vw",
          maxWidth: "420px",
          zIndex: 5,
        }}
      >
        <MobileSlot />
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
