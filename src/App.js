import { useState, useRef } from "react";

function App() {
  const [numbers, setNumbers] = useState([5, 3, 8, 1, 4]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(300);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(false);
  const [size, setSize] = useState(6);

  const pauseRef = useRef(false);
  const stopRef = useRef(false);

  const sleep = async (ms) => {
    while (pauseRef.current) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (stopRef.current) throw new Error("Stopped");
    return new Promise((r) => setTimeout(r, ms));
  };

  function generateArray(n = size) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(Math.floor(Math.random() * 20) + 1);
    }
    setNumbers(arr);
    resetStats();
  }

  function resetStats() {
    setActiveIndices([]);
    setComparisons(0);
    setSwaps(0);
    setFoundIndex(null);
  }

  /* ================= SORTS ================= */

  async function bubbleSort() {
    let arr = [...numbers];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        setComparisons((c) => c + 1);
        await sleep(speed);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setSwaps((s) => s + 1);
          setNumbers([...arr]);
          await sleep(speed);
        }
      }
    }
  }

  async function selectionSort() {
    let arr = [...numbers];
    for (let i = 0; i < arr.length; i++) {
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
        setActiveIndices([min, j]);
        setComparisons((c) => c + 1);
        await sleep(speed);
        if (arr[j] < arr[min]) min = j;
      }
      if (min !== i) {
        [arr[i], arr[min]] = [arr[min], arr[i]];
        setSwaps((s) => s + 1);
        setNumbers([...arr]);
        await sleep(speed);
      }
    }
  }

  async function insertionSort() {
    let arr = [...numbers];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        setActiveIndices([j, j + 1]);
        setComparisons((c) => c + 1);
        arr[j + 1] = arr[j];
        setNumbers([...arr]);
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
      setNumbers([...arr]);
      await sleep(speed);
    }
  }

  /* ================= SEARCH ================= */

  async function linearSearch() {
    const target = numbers[0];
    for (let i = 0; i < numbers.length; i++) {
      setActiveIndices([i]);
      setComparisons((c) => c + 1);
      await sleep(speed);
      if (numbers[i] === target) {
        setFoundIndex(i);
        return;
      }
    }
  }

  async function binarySearch() {
    let arr = [...numbers].sort((a, b) => a - b);
    setNumbers(arr);
    let low = 0,
      high = arr.length - 1;
    const target = arr[0];

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setActiveIndices([mid]);
      setComparisons((c) => c + 1);
      await sleep(speed);

      if (arr[mid] === target) {
        setFoundIndex(mid);
        return;
      }
      arr[mid] < target ? (low = mid + 1) : (high = mid - 1);
    }
  }

  /* ================= CONTROLLER ================= */

  async function start() {
    setIsRunning(true);
    pauseRef.current = false;
    stopRef.current = false;
    resetStats();

    try {
      if (algorithm === "bubble") await bubbleSort();
      if (algorithm === "selection") await selectionSort();
      if (algorithm === "insertion") await insertionSort();
      if (algorithm === "linear") await linearSearch();
      if (algorithm === "binary") await binarySearch();
    } catch {}

    setActiveIndices([]);
    setIsRunning(false);
  }

  function pauseResume() {
    pauseRef.current = !pauseRef.current;
    setPaused((p) => !p);
  }

  function stop() {
    stopRef.current = true;
    pauseRef.current = false;
    setPaused(false);
    setIsRunning(false);
  }

  return (
    <div
      style={{
        background: dark ? "#121212" : "#ffffff",
        color: dark ? "#ffffff" : "#000000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>DSA Visualizer</h1>

      <button onClick={() => setDark((d) => !d)}>Dark Mode</button>

      <br />
      <br />

      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        disabled={isRunning}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="selection">Selection Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="linear">Linear Search</option>
        <option value="binary">Binary Search</option>
      </select>

      <p>
        Comparisons: {comparisons} | Swaps: {swaps}
      </p>

      <label>Speed</label>
      <input
        type="range"
        min="50"
        max="1000"
        step="50"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />

      <label style={{ marginLeft: "20px" }}>Array Size</label>
      <input
        type="range"
        min="4"
        max="15"
        value={size}
        onChange={(e) => {
          const val = Number(e.target.value);
          setSize(val);
          generateArray(val);
        }}
      />

      <br />
      <br />

      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={pauseResume} disabled={!isRunning}>
        {paused ? "Resume" : "Pause"}
      </button>
      <button onClick={stop}>Stop</button>
      <button onClick={() => generateArray()}>New Array</button>

      {/* ===== BAR GRAPH ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          marginTop: "30px",
        }}
      >
        {numbers.map((n, i) => (
          <div
            key={i}
            style={{
              width: "32px",
              height: `${n * 10}px`,
              margin: "4px",
              background:
                foundIndex === i
                  ? "green"
                  : activeIndices.includes(i)
                  ? "tomato"
                  : "steelblue",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
