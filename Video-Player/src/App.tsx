import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
const videoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f3/Big_Buck_Bunny_first_23_seconds_1080p.ogv/Big_Buck_Bunny_first_23_seconds_1080p.ogv.720p.vp9.webm";

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.addEventListener("timeupdate", (event) => {
      console.log(event.target.currentTime);
    });
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
