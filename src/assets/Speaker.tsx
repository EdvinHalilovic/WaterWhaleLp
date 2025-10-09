import React from "react";

interface SpeakerProps {
  muted: boolean;
  onToggle: () => void;
}

const Speaker: React.FC<SpeakerProps> = ({ muted, onToggle }) => {
  return (
    <>
      <div
        onClick={onToggle}
        style={{
          position: "absolute",
          top: "clamp(2%, 4vh, 6%)",
          right: "clamp(2%, 3vw, 5%)",
          width: "clamp(38px, 4vw, 60px)",
          height: "auto",
          zIndex: 10,
          cursor: "pointer",
          userSelect: "none",
          animation: "floatSpeaker 5s ease-in-out infinite",
          WebkitTapHighlightColor: "transparent", // ✅ da ne bude blue highlight na iPhone
        }}
        title={muted ? "Unmute sound" : "Mute sound"}
        dangerouslySetInnerHTML={{
          __html: muted
            ? `
            <!-- 🔇 MUTED ICON (radi svugdje, bez blur bugova) -->
            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="23.5" fill="rgba(255,255,255,0.1)" stroke="white"/>
              <path d="M17 19L29 31M29 19L17 31" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `
            : `
            <!-- 🔊 SOUND ON ICON (Safari-safe verzija) -->
            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="23.5" fill="rgba(255,255,255,0.1)" stroke="white"/>
              <path d="M31.9 18.3C33.7 19.7 34.8 21.8 34.8 24.2C34.8 26.6 33.7 28.7 31.9 30.1" stroke="white" stroke-width="2"/>
              <path d="M25.1 15.4V32.9L18.4 28H15.7C14.3 28 13.2 26.9 13.2 25.5V22.9C13.2 21.5 14.3 20.4 15.7 20.4H18.4L25.1 15.4Z" fill="white"/>
            </svg>
          `,
        }}
      />

      <style>
        {`
          @keyframes floatSpeaker {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Speaker;
