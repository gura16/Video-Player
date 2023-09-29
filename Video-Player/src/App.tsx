import { useRef, useState } from "react";
import styled from "styled-components";
const videoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f3/Big_Buck_Bunny_first_23_seconds_1080p.ogv/Big_Buck_Bunny_first_23_seconds_1080p.ogv.720p.vp9.webm";

function App() {
  return (
    <div>
      <Maindiv>
        <Video controls>
          <source src={videoUrl} type="video/webm" />
        </Video>
      </Maindiv>
    </div>
  );
}

export default App;

const Video = styled.video`
  width: 500px;
  height: 500px;
`;

const Maindiv = styled.div`
  display: flex;
  justify-content: center;
`;
