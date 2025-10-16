/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { keyframes, css } from "@emotion/react";

/* ==== ANIMACIJE ==== */
const raysSpinCCW = keyframes`
   0% { transform: rotate(-25deg) scale(1.8); }
  50% { transform: rotate(25deg) scale(1.8); }
  100% { transform: rotate(-25deg) scale(1.8); }
`;
const raysSpinCW = keyframes`
  0% { transform: rotate(20deg) scale(1.8); }
  50% { transform: rotate(-20deg) scale(1.8); }
  100% { transform: rotate(20deg) scale(1.8); }
`;

const sparklesBlink = keyframes`
  0%,100% { opacity: .18; transform: translate3d(0,0,0); }
  50%     { opacity: .40; transform: translate3d(1px,-1px,0); }
`;

interface WinningModalProps {
  visible: boolean;
}

const WinningModal: React.FC<WinningModalProps> = ({ visible }) => {
  const [claimed] = useState(false);

  if (!visible) return null;

  const handleClaim = async () => {
    const textToCopy = "WHALE.IO";

    try {
      await navigator.clipboard.writeText(textToCopy);
      // ✅ prvo otvori tab — ovo prolazi kao "user gesture"
      window.open("https://whale.io/", "_blank");

      // ✅ zatim prikaži toast/alert
      alert("✅ Code copied! You’ll be redirected to claim your free spins.");
    } catch {
      alert("❌ Failed to copy the code. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "var(--app-height)",
        minHeight: "var(--app-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.25)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* === ANIMIRANA POZADINA === */}
      {/* prvi sloj (sporiji, počinje odmah) */}

      <div
        css={css`
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("/sun-rayBG.png");
          background-size: 120% 120%;
          background-position: center;
          mix-blend-mode: screen;
          opacity: 0.2;
          animation: ${raysSpinCCW} 38s linear infinite;
        `}
      />

      {/* drugi sloj (blago kašnjenje od 3 sekunde i suprotna rotacija) */}
      <div
        css={css`
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("/sun-rayBG.png");
          background-size: 120% 120%;
          background-position: center;
          mix-blend-mode: screen;
          opacity: 0.22;
          animation: ${raysSpinCW} 34s linear infinite;
          animation-delay: 3s;
        `}
      />

      <div
        css={css`
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9) 0 2px,
              rgba(255, 255, 255, 0) 3px
            ),
            radial-gradient(
              circle,
              rgba(255, 200, 255, 0.8) 0 2px,
              rgba(255, 255, 255, 0) 3px
            );
          background-size: 240px 240px, 200px 200px;
          background-position: 22% 32%, 68% 46%;
          mix-blend-mode: screen;
          animation: ${sparklesBlink} 3s ease-in-out infinite;
        `}
      />

      {/* === SADRŽAJ === */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "12px",
          padding: "1rem",
        }}
      >
        <img
          src="/Congratz.png"
          alt="Congrats"
          style={{
            width: "clamp(180px, 50vw, 320px)",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <img
          src="/YouWon.png"
          alt="You Won"
          style={{
            width: "clamp(150px, 45vw, 280px)",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        {/* === WHALE.IO + BUTTON === */}
        {!claimed ? (
          <button
            onClick={handleClaim}
            style={{
              background: "linear-gradient(180deg, #FFD84A 0%, #F5A623 100%)",
              color: "#002C47",
              fontWeight: 700,
              border: "none",
              borderRadius: "999px",
              padding: "0.8rem 2rem",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            CLAIM PRIZE
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginTop: "0.5rem",
            }}
          >
            {/* Whale.io label */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 59px",
                borderRadius: "232px",
                border: "2px dashed #FDD624",
                background: "rgba(253, 214, 36, 0.20)",
                fontFamily: "Jost, sans-serif",
                fontWeight: 700,
                color: "#FDD624",
                fontSize: "clamp(1rem, 2vw, 1.3rem)",
              }}
            >
              "WHALE.IO"
            </div>

            {/* Copy button */}
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 59px",
                borderRadius: "232px",
                border: "none",
                background: "#FFD84A",
                color: "#002C47",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              COPY & CLAIM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinningModal;
