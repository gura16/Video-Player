import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const videoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f3/Big_Buck_Bunny_first_23_seconds_1080p.ogv/Big_Buck_Bunny_first_23_seconds_1080p.ogv.720p.vp9.webm";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [descendingTime, setDescendingTime] = useState<number>(0);
  const [incrementingTime, setIncrementingTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    const handleTimeUpdate = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      const newTime = target.currentTime;
      setCurrentTime(newTime);

      // Update descending time
      setDescendingTime(target.duration - newTime);

      // Update incrementing time
      setIncrementingTime(newTime);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      <Maindiv>
        <Video ref={videoRef}>
          <source src={videoUrl} type="video/webm" />
        </Video>
      </Maindiv>
      <button
        onClick={() => {
          if (videoRef.current?.paused) {
            videoRef.current?.play();
          } else {
            videoRef.current?.pause();
          }
        }}
      >
        Play/Pause
      </button>
      <div>Descending: {formatTime(descendingTime)}</div>
      <input
        type="range"
        min={0}
        max={videoRef.current?.duration || 0}
        value={currentTime}
        onChange={(e) => {
          const time = parseFloat(e.target.value);
          if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
          }
        }}
      />
      <div>Incrementing: {formatTime(incrementingTime)}</div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => {
          const newVolume = parseFloat(e.target.value);
          if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
          }
        }}
      />
    </div>
  );
}

export default App;

const Video = styled.video`
  width: 700px;
  height: 300px;
`;

const Maindiv = styled.div`
  display: flex;
  justify-content: center;
`;
