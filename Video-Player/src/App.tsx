import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
const videoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f3/Big_Buck_Bunny_first_23_seconds_1080p.ogv/Big_Buck_Bunny_first_23_seconds_1080p.ogv.720p.vp9.webm";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const handleTimeUpdate = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      setCurrentTime(target.currentTime);
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
      <div>{currentTime.toFixed(2)} seconds</div>
    </div>
  );
}

export default App;

const Video = styled.video`
  width: 500px;
  height: 300px;
`;

const Maindiv = styled.div`
  display: flex;
  justify-content: center;
`;
