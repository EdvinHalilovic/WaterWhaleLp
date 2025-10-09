import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import "/src/mobile.css";
import WinningModal from "./WinningModal";

interface MobileSlotProps {
  muted: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const SYMBOLS = [
  "/A.png",
  "/K.png",
  "/Q.png",
  "/J.png",
  "/10.png",
  "/goldCoin.png",
  "/stick.png",
  "/GoldenReef.png",
  "/greenDogHouse.png",
  "/blueDogHouse.png",
  "/pinkDogHouse.png",
  "/redDogHouse.png",
  "/dogHouse.png",
];

const ICON_HEIGHT = 120;
const TOTAL_SYMBOLS = SYMBOLS.length;

const WinningSound = () => (
  <audio autoPlay className="player" preload="none">
    <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
  </audio>
);

const Spinner = forwardRef<
  { spin: (delay?: number, targetPos?: number) => void },
  {
    onFinish: (pos: number) => void;
    duration: number;
    winner?: boolean;
    initialSymbol?: string;
    dimmed?: boolean;
  }
>(
  (
    { onFinish, duration, winner = false, initialSymbol, dimmed = false },
    ref
  ) => {
    const spinnerInnerRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
      null
    );
    const startTimeRef = useRef<number | null>(null);
    const activeRef = useRef(false);

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const spinAnimation = useCallback(
      (
        timestamp: number,
        localDuration: number,
        delay: number,
        targetPos: number
      ) => {
        if (!activeRef.current) return;
        if (!startTimeRef.current) startTimeRef.current = timestamp;

        const elapsed = timestamp - startTimeRef.current - delay;
        if (elapsed < 0) {
          timerRef.current = requestAnimationFrame((t) =>
            spinAnimation(t, localDuration, delay, targetPos)
          );
          return;
        }

        const progress = Math.min(elapsed / localDuration, 1);
        const eased = easeOutQuart(progress);
        const distance = ICON_HEIGHT * TOTAL_SYMBOLS * 25 * eased;
        const offsetCenter = ICON_HEIGHT * 1.0;
        const newPos = -(
          (distance + targetPos + offsetCenter) %
          (ICON_HEIGHT * TOTAL_SYMBOLS)
        );

        if (spinnerInnerRef.current) {
          spinnerInnerRef.current.style.transform = `translateY(${newPos}px)`;
        }

        if (progress < 1) {
          timerRef.current = requestAnimationFrame((t) =>
            spinAnimation(t, localDuration, delay, targetPos)
          );
        } else {
          activeRef.current = false;
          setTimeout(() => onFinish(targetPos), 0);
        }
      },
      [onFinish]
    );

    const spin = useCallback(
      (delay = 0, targetPos = 0) => {
        if (timerRef.current) cancelAnimationFrame(timerRef.current);
        startTimeRef.current = null;
        activeRef.current = true;
        timerRef.current = requestAnimationFrame((t) =>
          spinAnimation(t, duration, delay, targetPos)
        );
      },
      [duration, spinAnimation]
    );

    useImperativeHandle(ref, () => ({ spin }), [spin]);

    useEffect(() => {
      return () => {
        if (timerRef.current) cancelAnimationFrame(timerRef.current);
      };
    }, []);

    return (
      <div className="spinner">
        <div
          ref={spinnerInnerRef}
          className="spinner-inner"
          style={{ willChange: "transform" }}
        >
          {initialSymbol && (
            <div className="symbol-wrapper">
              <img src={initialSymbol} alt="initial" className="symbol" />
            </div>
          )}

          {SYMBOLS.map((src, i) => (
            <div key={i} className="symbol-wrapper">
              <img src={src} alt={`symbol-${i}`} className="symbol" />
            </div>
          ))}

          {SYMBOLS.map((src, i) => (
            <div
              key={`dup-${i}`}
              className={`symbol-wrapper ${
                winner && src.includes("dogHouse")
                  ? "winning-frame"
                  : dimmed
                  ? "symbol-dimmed"
                  : ""
              }`}
            >
              <img src={src} alt={`symbol-${i}`} className="symbol" />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

const MobileSlot: React.FC<MobileSlotProps> = ({ muted, audioRef }) => {
  const [winner, setWinner] = useState<boolean | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [, setLoserMessage] = useState("");
  const [, setMatches] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const [initialSymbols] = useState([
    "/pinkDogHouse.png",
    "/greenDogHouse.png",
    "/redDogHouse.png",
    "/blueDogHouse.png",
    "/GoldenReef.png",
  ]);
  // 🕹️ Kontrola mute/unmute u realnom vremenu
  useEffect(() => {
    const audio = audioRef.current;
    if (!(audio instanceof HTMLAudioElement)) return;

    if (muted) {
      // ako je mute, odmah pauziraj i resetuj
      audio.pause();
      audio.currentTime = 0;
    } else {
      // ako se unmute, možeš ponovo pokrenuti ako se trenutno spin-a
      // (opcionalno — ovako ne svira stalno bez spina)
      if (winner === null && spinCount > 0 && spinCount < 2) {
        audio.currentTime = 0;
        audio.volume = 0.6;
        audio.play().catch((err) => console.warn("Audio resume error:", err));
      }
    }
  }, [muted]); // reaguje svaki put kad promijeniš mute/unmute

  useEffect(() => {
    if (!containerRef.current || !frameRef.current) return;
    const resizeFrame = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      frameRef.current!.style.width = `${width}px`;
      frameRef.current!.style.height = `${height}px`;
    };
    const observer = new ResizeObserver(resizeFrame);
    observer.observe(containerRef.current);
    resizeFrame();
    return () => observer.disconnect();
  }, []);

  const spinnerRefs = [
    useRef<{ spin: (delay?: number, targetPos?: number) => void }>(null),
    useRef<{ spin: (delay?: number, targetPos?: number) => void }>(null),
    useRef<{ spin: (delay?: number, targetPos?: number) => void }>(null),
    useRef<{ spin: (delay?: number, targetPos?: number) => void }>(null),
    useRef<{ spin: (delay?: number, targetPos?: number) => void }>(null),
  ];

  const handleFinish = (value: number) => {
    setMatches((prev) => {
      const updated = [...prev, value];
      if (updated.length === 5) {
        const allSame = updated.every((v) => v === updated[0]);
        setWinner(allSame);
        setTimeout(() => {
          if (spinCount + 1 === 2) setShowWinModal(true);
        }, 600);
      }
      return updated;
    });
  };

  const handleSpin = () => {
    if (spinCount >= 2) return;
    setWinner(null);
    setMatches([]);
    setLoserMessage("");

    const nextSpin = spinCount + 1;
    setSpinCount(nextSpin);

    // 🎵 PLAY SOUND
    const audio = audioRef.current;
    if (audio instanceof HTMLAudioElement) {
      audio.currentTime = 0;
      audio.volume = 0.6;
      if (!muted) {
        audio.play().catch((err) => console.warn("Audio play error:", err));
      }
    }

    const dogHouseIndex = SYMBOLS.findIndex((s) => s.includes("dogHouse.png"));
    const dogHouses = [
      "/pinkDogHouse.png",
      "/greenDogHouse.png",
      "/redDogHouse.png",
      "/blueDogHouse.png",
      "/dogHouse.png",
    ];

    const targetPositions =
      nextSpin === 1
        ? dogHouses.map((s) => {
            const idx = SYMBOLS.findIndex((sym) => sym === s);
            return -ICON_HEIGHT * (idx + 5);
          })
        : nextSpin === 2 && dogHouseIndex !== -1
        ? Array(5).fill(-ICON_HEIGHT * (dogHouseIndex + 3))
        : Array.from(
            { length: 5 },
            () => Math.floor(Math.random() * SYMBOLS.length) * -ICON_HEIGHT
          );

    spinnerRefs.forEach((ref, i) => {
      ref.current?.spin(i * 400, targetPositions[i]);
    });

    // 🕒 trajanje spina (isti fade kao desktop)
    // 🕒 trajanje spina (isti fade kao desktop)
    const totalSpinDuration = 4800 + (spinnerRefs.length - 1) * 400;

    setTimeout(() => {
      const audioEl = audioRef.current;
      if (audioEl instanceof HTMLAudioElement) {
        const fade = setInterval(() => {
          if (audioEl.volume > 0.05) {
            audioEl.volume = Math.max(0, audioEl.volume - 0.05);
          } else {
            clearInterval(fade);
            audioEl.pause();
            audioEl.volume = 0.6;
          }
        }, 80);
      }
    }, totalSpinDuration);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "center",
        width: "90vw",
        maxWidth: "420px",
        margin: "0 auto",
        paddingTop: "8vh",
        position: "relative",
      }}
    >
      {winner && <WinningSound />}

      {/* 🎰 SLOT REELS */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "min(100vw, 420px)",
          aspectRatio: "1.4 / 1",
          maxHeight: "min(70vh, 340px)",
          overflow: "visible",
        }}
      >
        <div className="spinner-container-mobile">
          {[0, 1, 2, 3, 4].map((i) => (
            <Spinner
              key={i}
              onFinish={handleFinish}
              duration={4200 + i * 300}
              ref={spinnerRefs[i]}
              winner={!!winner}
              initialSymbol={initialSymbols[i]}
            />
          ))}
          <div className="gradient-fade" />
        </div>

        {/* 🐳 FRAME ELEMENTS */}
        <img
          src="/WaterLogo.png"
          alt="Water Logo"
          style={{
            position: "absolute",
            top: "clamp(-6%, -4vh, -2%)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(140px, 18vw, 260px)",
            height: "auto",
            zIndex: 3,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <img
          ref={frameRef}
          src="/waterFrame.png"
          alt="Slot Frame"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>

      {/* 🟡 SPIN BUTTON */}
      <button
        onClick={handleSpin}
        disabled={spinCount >= 2}
        style={{
          marginTop: "3.5vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          width: "clamp(130px, 45vw, 180px)",
          padding: "12px 32px",
          borderRadius: "24px",
          border: "2.286px solid #F28F2E",
          background:
            "linear-gradient(0deg, rgba(80,40,10,0.9) 0%, rgba(242,143,46,0.15) 100%)",
          color: "#FFF",
          fontFamily: "'Jost', sans-serif",
          fontSize: "clamp(14px, 3.5vw, 16px)",
          fontWeight: 600,
          lineHeight: "24px",
          cursor: spinCount >= 2 ? "not-allowed" : "pointer",
          opacity: spinCount >= 2 ? 0.6 : 1,
          boxShadow:
            spinCount >= 2
              ? "none"
              : "0 0 10px rgba(242,143,46,0.35), inset 0 0 8px rgba(242,143,46,0.25)",
          transition: "all 0.25s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img
            src="/Refresh.svg"
            alt="Refresh Icon"
            style={{
              width: "clamp(20px, 4vw, 24px)",
              height: "clamp(20px, 4vw, 24px)",
              aspectRatio: "1 / 1",
              filter: spinCount >= 2 ? "grayscale(100%)" : "none",
              transition: "filter 0.2s ease",
            }}
          />
          <span
            style={{
              color: spinCount >= 2 ? "#AAA" : "#FFF",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Spin
          </span>
        </div>
      </button>

      {/* 🟦 INFO BAR (YOU HAVE X SPINS) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2.5vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            width: "clamp(240px, 70vw, 340px)",
            padding: "12px 16px",
            borderRadius: "32px",
            border: "2px solid #002C47",
            background:
              "linear-gradient(180deg, rgba(0, 25, 55, 0.95) 0%, rgba(0, 30, 60, 0.85) 100%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "1.4",
            }}
          >
            <span
              style={{
                fontSize: "clamp(10px, 2.5vw, 13px)",
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              YOU HAVE
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "clamp(14px, 4vw, 18px)",
                color: "#FFD700",
              }}
            >
              {2 - spinCount} SPIN{2 - spinCount !== 1 ? "S" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 🏆 WIN MODAL */}
      <WinningModal
        visible={showWinModal}
        onClose={() => setShowWinModal(false)}
      />
    </div>
  );
};

export default MobileSlot;
