import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const videoUrl = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [descendingTime, setDescendingTime] = useState<number>(0);
  const [incrementingTime, setIncrementingTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [skipSeconds, setSkipSeconds] = useState<number>(10);
  const [jumpBackSeconds, setJumpBackSeconds] = useState<number>(10);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

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
  const skipForward = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + skipSeconds;
      if (newTime <= videoRef.current.duration) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const jumpBack = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime - jumpBackSeconds;
      if (newTime >= 0) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      } else {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedQuality(selected);
  };

  const handlePlaybackSpeedChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(selectedSpeed);
    videoRef.current!.playbackRate = selectedSpeed;
  };

  const playbackSpeedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 1.0, label: "1.0x" },
    { value: 1.5, label: "1.5x" },
    { value: 2.0, label: "2.0x" },
  ];

  return (
    <div>
      <Maindiv>
        <Video ref={videoRef}>
          <source src={videoUrl} type="video/webm" />
        </Video>
      </Maindiv>
      <button onClick={jumpBack}>Jump Back {jumpBackSeconds} seconds</button>

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
      <button onClick={skipForward}>Skip Forward {skipSeconds} seconds</button>
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
      <label>
        Quality:
        <select value={selectedQuality} onChange={handleQualityChange}>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </label>
      <div>
        <label>
          Speed:
          <select value={playbackSpeed} onChange={handlePlaybackSpeedChange}>
            {playbackSpeedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
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
