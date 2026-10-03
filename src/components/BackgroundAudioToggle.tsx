import React, { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import SpookyOverlay from "./SpookyOverlay";

const BackgroundAudioToggle = () => {
  const { isSpookyMode, setIsSpookyMode } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio.wav");
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSpookyMode(checked);

    if (!audioRef.current) return;

    if (checked) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
        setIsSpookyMode(false);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="absolute bottom-5 ">
      <label
        title="Enable creaking door sound and creepy text"
        className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={isSpookyMode} onChange={handleToggle} />
        <span className="ml-3 text-sm font-medium">Enable spooky mode</span>
      </label>
      <SpookyOverlay />
    </div>
  );
};

export default BackgroundAudioToggle;
