import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import "/src/SlotMachine.css";
import WinningModal from "./WinningModal";

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
    const [position, setPosition] = useState(0);

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

        setPosition(newPos);

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
          className="spinner-inner"
          style={{
            transform: `translateY(${position}px)`,
            transition: activeRef.current ? "none" : "transform 0.5s ease-out",
          }}
        >
          {initialSymbol ? (
            <div
              className="symbol-wrapper"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={initialSymbol} alt="initial" className="symbol" />
            </div>
          ) : null}

          {SYMBOLS.map((src, i) => (
            <div
              key={i}
              className="symbol-wrapper"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={src} alt={`symbol-${i}`} className="symbol" />
            </div>
          ))}

          {SYMBOLS.map((src, i) => (
            <div
              key={i}
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

const Slot: React.FC<{
  muted: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}> = ({ muted, audioRef }) => {
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

      // čekamo da svih 5 kolona završi
      if (updated.length === 5) {
        const allSame = updated.every((v) => v === updated[0]);
        setWinner(allSame);

        // 🔥 provjeri spinCount nakon što se svi završe
        setTimeout(() => {
          if (spinCount + 1 === 2) {
            // spinCount + 1 jer novi spin tek ulazi
            setShowWinModal(true);
          }
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

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.6;
      if (!muted) {
        audio.play().catch(() => {});
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

    // ⏱ trajanje ukupnog spina = najduža kolona + delay (zadnja ima najduže trajanje)
    const totalSpinDuration = 4800 + (spinnerRefs.length - 1) * 400; // isto kao tvoj duration

    // 🎵 Zaustavi zvuk tačno kad spin završi
    setTimeout(() => {
      if (audioRef.current) {
        const fade = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fade);
            audioRef.current?.pause();
            audioRef.current.volume = 0.6;
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
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        height: "90%",
      }}
    >
      {winner && <WinningSound />}

      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          aspectRatio: window.innerWidth > 768 ? "16 / 9" : "auto",
          maxWidth: "800px",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <div className="spinner-container">
          {[0, 1, 2, 3, 4].map((i) => (
            <Spinner
              key={i}
              onFinish={handleFinish}
              duration={4800 + i * 400}
              ref={spinnerRefs[i]}
              winner={!!winner}
              initialSymbol={initialSymbols[i]}
            />
          ))}

          <div className="gradient-fade" />
        </div>
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

        <img
          src="/goldCoin.png"
          alt="Gold Coin"
          style={{
            position: "absolute",
            bottom: "-1vh",
            right: "0",
            width: "clamp(70px, 10vw, 140px)",
            height: "auto",
            transform: "rotate(30deg) translateX(40%) translateY(20%)",
            transformOrigin: "bottom right",
            aspectRatio: "1 / 1",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "calc(2% + 3.8vw)",
          left: "50%",
          transform: "translate(-85%, 0)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(2px, 0.5vw, 4px)",
          width: "clamp(160px, 20vw, 220px)",
          padding: "clamp(3px, 0.8vw, 6px)",
          borderRadius: "clamp(24px, 3vw, 32px)",
          border: "2px solid #002C47",
          background:
            "linear-gradient(180deg, rgba(0,44,71,0.6) 0%, rgba(0,24,40,0.4) 100%)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          color: "#FFF",
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
          backdropFilter: "blur(6px)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "clamp(8px, 1vw, 10px)",
            fontWeight: "400",
            letterSpacing: "0.4px",
            opacity: 0.85,
          }}
        >
          YOU HAVE
        </span>

        <span
          style={{
            fontWeight: "700",
            fontSize: "clamp(10px, 1.4vw, 14px)",
            color: "#FFD700",
          }}
        >
          {2 - spinCount} SPIN{2 - spinCount !== 1 ? "S" : ""}
        </span>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinCount >= 2}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          transform: "translateY(-60%)",
          bottom: "clamp(3%, 5vh, 6%)",
          right: "clamp(34%, 8vw, 1%)",
          gap: "clamp(6px, 1vw, 10px)",
          width: "clamp(130px, 16vw, 190px)",
          height: "clamp(60px, 6vh, 90px)",
          padding: "clamp(6px, 0.8vw, 8px) clamp(16px, 1.6vw, 20px)",
          borderRadius: "68.6px",
          border: "2px solid #F28F2E",
          background:
            "linear-gradient(0deg, rgba(242,143,46,0.20) 0%, rgba(242,143,46,0.20) 100%), #011220",
          color: spinCount >= 2 ? "#9FA6AD" : "#FFFFFF",
          fontSize: "clamp(14px, 1.4vw, 18px)",
          fontWeight: 600,
          cursor: spinCount >= 2 ? "not-allowed" : "pointer",
          opacity: spinCount >= 2 ? 0.6 : 1,
          transition: "all 0.25s ease-in-out",
          zIndex: 10,
          boxShadow:
            spinCount >= 2
              ? "none"
              : "0 0 10px rgba(242,143,46,0.25), inset 0 0 10px rgba(242,143,46,0.15)",
        }}
      >
        <img
          src="/Refresh.svg"
          alt="Refresh Icon"
          style={{
            width: "clamp(12px, 2vw, 19px)",
            height: "auto",
            opacity: spinCount >= 2 ? 0.5 : 1,
            filter: spinCount >= 2 ? "grayscale(100%)" : "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            fontWeight: 600,
            color: spinCount >= 2 ? "#9FA6AD" : "#FFFFFF",
          }}
        >
          Spin
        </span>
      </button>
      <WinningModal
        visible={showWinModal}
        onClose={() => setShowWinModal(false)}
      />
    </div>
  );
};

export default Slot;
