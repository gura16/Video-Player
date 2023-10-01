import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import playimage from "./assets/images/pause-solid.svg";
import pauseimage from "./assets/images/play-solid.svg";

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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Maindiv>
        <Video ref={videoRef}>
          <source src={videoUrl} type="video/webm" />
        </Video>

        <Settingdiv>
          <Currentvideodiv>
            <Descending> {formatTime(descendingTime)}</Descending>
            <Currentvideo
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
            <Incrementing> {formatTime(incrementingTime)}</Incrementing>
          </Currentvideodiv>
          <button onClick={jumpBack}>
            Jump Back {jumpBackSeconds} seconds
          </button>
          <Play
            onClick={() => {
              if (videoRef.current?.paused) {
                videoRef.current?.play();
              } else {
                videoRef.current?.pause();
              }
            }}
          >
            {videoRef.current?.paused ? (
              <img src={playimage} alt="Play" />
            ) : (
              <img src={pauseimage} alt="Pause" />
            )}
          </Play>

          <button onClick={skipForward}>
            Skip Forward {skipSeconds} seconds
          </button>

          <div>
            <label>
              Quality:
              <select value={selectedQuality} onChange={handleQualityChange}>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </label>

            <label>
              Speed:
              <select
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
              >
                {playbackSpeedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Settingdiv>
        <Volume
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
      </Maindiv>
    </div>
  );
}

export default App;

const Video = styled.video`
  width: 150vh;
`;

const Maindiv = styled.div`
  display: flex;
  justify-content: center;
  width: 150vh;

  position: relative;
`;

const Play = styled.button`
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
  border: none;
`;

const Settingdiv = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 200px;
  left: 500px;
`;

const Volume = styled.input`
  position: absolute;
  top: 200px;
  left: 200px;
`;

const Currentvideo = styled.input`
  color: white;
`;
const Descending = styled.div`
  color: white;
  font-family: " Roboto";
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: left;
  width: 62px;
  height: 28px;
`;

const Incrementing = styled.div`
  color: white;
  font-family: "Roboto";
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: left;
`;

const Currentvideodiv = styled.div`
  display: flex;
  gap: 10px;
`;
