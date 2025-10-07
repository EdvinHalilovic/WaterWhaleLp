import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import "/src/SlotMachine.css";

const ICON_HEIGHT = 125;
const TOTAL_SYMBOLS = 9;

const LOSER_MESSAGES = [
  "Not quite",
  "Try again!",
  "Ouch! So close!",
  "Better luck next time!",
  "Maybe next spin 🍀",
];
const SYMBOLS = [
  "/A.png",
  "/K.png",
  "/Q.png",
  "/J.png",
  "/10.png",
  "/goldCoin.png",
  "/stick.png",
  "/GoldenReef.png",
  "/dogHouse.png",
];

const WinningSound = () => (
  <audio autoPlay className="player" preload="none">
    <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
  </audio>
);

const Spinner = forwardRef<
  { spin: (delay?: number, targetPos?: number) => void },
  { onFinish: (pos: number) => void; duration: number; winner?: boolean } // 🔥 dodan winner prop
>(({ onFinish, duration, winner = false }, ref) => {
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
      const offsetCenter = ICON_HEIGHT * 1.5;

      const newPos =
        ((distance % (ICON_HEIGHT * TOTAL_SYMBOLS)) +
          targetPos +
          offsetCenter) %
        (ICON_HEIGHT * TOTAL_SYMBOLS);

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
    <div className="spinner-wrapper">
      <div
        className="spinner-inner"
        style={{
          transform: `translateY(${position}px)`,
          transition: activeRef.current ? "none" : "transform 0.5s ease-out",
        }}
      >
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

            {winner && src.includes("dogHouse") && (
              <img
                src="/golden.png"
                alt="Winning Frame"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                  animation: "framePulse 1.2s ease-in-out infinite",
                }}
              />
            )}
          </div>
        ))}

        {/* 🔁 Duplikat za glatku petlju */}
        {SYMBOLS.map((src, i) => (
          <div
            key={i}
            className={`symbol-wrapper ${
              winner && src.includes("dogHouse") ? "winning-frame" : ""
            }`}
          >
            <img src={src} alt={`symbol-${i}`} className="symbol" />
          </div>
        ))}
      </div>
    </div>
  );
});

Spinner.displayName = "Spinner";

const Slot: React.FC = () => {
  const [winner, setWinner] = useState<boolean | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [, setLoserMessage] = useState("");
  const [, setMatches] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);

  // 🎯 Dinamički resize za frame
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
        if (!allSame) {
          setLoserMessage(
            LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)]
          );
        }
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

    // ako je drugi spin -> svi na dogHouse (win)
    // 🏠 drugi spin -> uvijek DOGHOUSE win kombinacija
    const dogHouseIndex = SYMBOLS.findIndex((s) => s.includes("dogHouse.png"));
    const targetPositions =
      nextSpin === 2 && dogHouseIndex !== -1
        ? Array(5).fill(-ICON_HEIGHT * (dogHouseIndex + 2)) // pomakni za 1 dole da dogHouse bude vidljiv
        : Array.from(
            { length: 5 },
            () => Math.floor(Math.random() * SYMBOLS.length) * -ICON_HEIGHT
          );

    spinnerRefs.forEach((ref, i) => {
      ref.current?.spin(i * 400, targetPositions[i]);
    });
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
      {/* 🐋 Whale.io logo umjesto teksta */}
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

      {/* 🎰 Slot i Frame */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          aspectRatio: "16 / 9",
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
            />
          ))}

          <div className="gradient-fade" />
        </div>
        <img
          src="/WaterLogo.png"
          alt="Water Logo"
          style={{
            position: "absolute",
            top: "clamp(-6%, -4vh, -2%)", // 📍 malo iznad frame-a
            left: "50%",
            transform: "translateX(-50%)", // ✅ centriranje horizontalno
            width: "clamp(140px, 18vw, 260px)", // 📏 responsive širina
            height: "auto",
            zIndex: 3, // iznad frame-a
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
            transform: "rotate(30deg) translateX(40%) translateY(20%)", // pomjereno 20% udesno
            transformOrigin: "bottom right",
            aspectRatio: "1 / 1",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </div>
      {/* 🎯 Info panel uz donji rub waterFrame-a */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(2% + 3.8vw)", // blago iznad dna waterFrame-a
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
        {/* 🔄 Ikonica lijevo */}
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
    </div>
  );
};

export default Slot;
