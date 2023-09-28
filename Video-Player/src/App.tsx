import { useRef, useState } from "react";

function App() {
  const [count, setCount] = useState<any>(0);

  const buttonRef = useRef<any>(0);

  return (
    <div>
      <button
        onClick={() => {
          console.log("დაეჭირა პირველ ღილაკს");
        }}
        ref={buttonRef}
      >
        button 1
      </button>
      <button
        onClick={() => {
          console.log("დაეჭირა მეორე ღილაკს");
          buttonRef.current.click();
        }}
      >
        button 2
      </button>
    </div>
  );
}

export default App;
