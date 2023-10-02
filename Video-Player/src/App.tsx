import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import playimage from "./assets/images/pause-solid.svg";
import pauseimage from "./assets/images/play-solid.svg";
import back from "./assets/images/backward-step-solid.svg";
import forward from "./assets/images/forward-step-solid.svg";
import settingfoto from "./assets/images/gear-solid.svg";

const videoUrl = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [descendingTime, setDescendingTime] = useState<number>(0);
  const [incrementingTime, setIncrementingTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [skipSeconds, setSkipSeconds] = useState<number>();
  const [jumpBackSeconds, setJumpBackSeconds] = useState<number>();
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
  const forward5Sec = () => {
    const video = videoRef.current!;
    video.currentTime += 5;
  };

  const replay5Sec = () => {
    const video = videoRef.current!;
    video.currentTime -= 5;
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
          <Playquality>
            <Playdiv>
              <Button onClick={replay5Sec}>
                <img src={back} />
              </Button>
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

              <Button onClick={forward5Sec}>
                <img src={forward} />
              </Button>
            </Playdiv>
            <Settingfoto>
              <img src={settingfoto} />
            </Settingfoto>

            <Quality>
              <Label>
                <Select value={selectedQuality} onChange={handleQualityChange}>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </Select>
              </Label>

              <Label>
                <Select
                  value={playbackSpeed}
                  onChange={handlePlaybackSpeedChange}
                >
                  {playbackSpeedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Label>
            </Quality>
          </Playquality>
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
  width: 900px;
  height: 500px;
`;

const Maindiv = styled.div`
  display: flex;
  justify-content: center;
  width: 150vh;
`;

const Play = styled.button`
  width: 28px;
  height: 28px;
  background-color: white;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Settingdiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 450px;
`;

const Volume = styled.input`
  position: absolute;
  top: 200px;
  left: 200px;
`;

const Currentvideo = styled.input`
  width: 700px;
`;
const Descending = styled.div`
  color: white;
  font-family: "Roboto";
  font-size: 24px;
  font-weight: 200;
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
  font-weight: 200;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: left;
`;

const Currentvideodiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Playdiv = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Label = styled.label`
  color: white;
`;

const Quality = styled.div`
  display: flex;
  flex-direction: column;
`;

const Playquality = styled.div`
  display: flex;
`;

const Select = styled.select`
  width: 55px;
`;
const Settingfoto = styled.div`
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
`;
