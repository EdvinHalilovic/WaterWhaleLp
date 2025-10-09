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
        }}
        title={muted ? "Unmute sound" : "Mute sound"}
        dangerouslySetInnerHTML={{
          __html: muted
            ? `
            <!-- 🔇 MUTED ICON -->
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <foreignObject x="-16" y="-16" width="80" height="80">
                <div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(8px);clip-path:url(#clip_path);height:100%;width:100%"></div>
              </foreignObject>
              <g data-figma-bg-blur-radius="16">
                <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" fill-opacity="0.1"/>
                <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="white"/>
                <path d="M17 19L29 31M29 19L17 31" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip_path" transform="translate(16 16)">
                  <rect x="0.5" y="0.5" width="47" height="47" rx="23.5"/>
                </clipPath>
              </defs>
            </svg>
          `
            : `
            <!-- 🔊 SOUND ON ICON -->
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <foreignObject x="-16" y="-16" width="80" height="80">
                <div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(8px);clip-path:url(#bgblur_0_20761_75_clip_path);height:100%;width:100%"></div>
              </foreignObject>
              <g data-figma-bg-blur-radius="16">
                <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" fill-opacity="0.1"/>
                <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="white"/>
                <path d="M31.9848 18.2819C33.7001 19.6795 34.8 21.8117 34.8 24.198C34.8 26.5844 33.7001 28.7166 31.9848 30.1142C31.5758 30.4478 30.9763 30.3842 30.6427 29.9753C30.3092 29.5663 30.3727 28.9667 30.7817 28.6332C32.0722 27.585 32.8941 25.9888 32.8941 24.198C32.8941 22.4073 32.0722 20.8111 30.7817 19.7589C30.3727 19.4254 30.3132 18.8258 30.6427 18.4169C30.9723 18.0079 31.5758 17.9483 31.9848 18.2779V18.2819ZM29.5826 21.24C30.4363 21.9388 30.9882 23.0029 30.9882 24.198C30.9882 25.3932 30.4363 26.4573 29.5826 27.1561C29.1736 27.4897 28.5741 27.4261 28.2405 27.0172C27.907 26.6082 27.9705 26.0086 28.3795 25.6751C28.8083 25.3257 29.0823 24.7936 29.0823 24.198C29.0823 23.6025 28.8083 23.0704 28.3795 22.717C27.9705 22.3835 27.911 21.7839 28.2405 21.375C28.5701 20.966 29.1736 20.9064 29.5826 21.236V21.24ZM25.1554 15.4151C25.612 15.6216 25.9058 16.0742 25.9058 16.5745V31.8216C25.9058 32.3219 25.612 32.7745 25.1554 32.981C24.6988 33.1875 24.1627 33.1041 23.7895 32.7705L18.4332 28.0098H15.7411C14.3395 28.0098 13.2 26.8703 13.2 25.4686V22.9275C13.2 21.5258 14.3395 20.3863 15.7411 20.3863H18.4332L23.7895 15.6255C24.1627 15.292 24.6988 15.2126 25.1554 15.4151Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="bgblur_0_20761_75_clip_path" transform="translate(16 16)">
                  <rect x="0.5" y="0.5" width="47" height="47" rx="23.5"/>
                </clipPath>
              </defs>
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
