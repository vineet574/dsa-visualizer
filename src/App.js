import { useState, useRef } from "react";

function App() {
  /* ================= GLOBAL ================= */
  const [mode, setMode] = useState("sorting"); // sorting | stack | queue
  const [dark, setDark] = useState(false);

  /* ================= SORTING / SEARCHING ================= */
  const [numbers, setNumbers] = useState([5, 3, 8, 1, 4]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(300);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
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

  function resetStats() {
    setActiveIndices([]);
    setComparisons(0);
    setSwaps(0);
    setFoundIndex(null);
  }

  function generateArray(n = size) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(Math.floor(Math.random() * 20) + 1);
    }
    setNumbers(arr);
    resetStats();
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

  /* ================= STACK ================= */
  const [stack, setStack] = useState([]);
  const pushStack = () =>
    setStack([...stack, Math.floor(Math.random() * 50) + 1]);
  const popStack = () => stack.length && setStack(stack.slice(0, -1));

  /* ================= QUEUE ================= */
  const [queue, setQueue] = useState([]);
  const enqueue = () =>
    setQueue([...queue, Math.floor(Math.random() * 50) + 1]);
  const dequeue = () => queue.length && setQueue(queue.slice(1));

  /* ================= COMPLEXITY MAP ================= */
  const complexityMap = {
    bubble: { time: "O(n²)", space: "O(1)" },
    selection: { time: "O(n²)", space: "O(1)" },
    insertion: { time: "O(n²)", space: "O(1)" },
    linear: { time: "O(n)", space: "O(1)" },
    binary: { time: "O(log n)", space: "O(1)" },
    stack: { time: "O(1)", space: "O(n)" },
    queue: { time: "O(1)", space: "O(n)" }
  };

  /* ================= CURRENT COMPLEXITY ================= */
  const currentComplexity =
    mode === "sorting"
      ? complexityMap[algorithm]
      : complexityMap[mode];

  /* ================= UI ================= */
  return (
    <div
      style={{
        background: dark ? "#121212" : "#fff",
        color: dark ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <h1>DSA Visualizer & Problem-Solving Platform</h1>

      <button onClick={() => setDark((d) => !d)}>Dark Mode</button>

      <br /><br />

      <button onClick={() => setMode("sorting")}>Sorting</button>
      <button onClick={() => setMode("stack")}>Stack</button>
      <button onClick={() => setMode("queue")}>Queue</button>

      <hr />

      {mode === "sorting" && (
        <>
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
            <strong>Time Complexity:</strong> {currentComplexity.time} &nbsp; | &nbsp;
            <strong>Space Complexity:</strong> {currentComplexity.space}
          </p>

          <p>Comparisons: {comparisons} | Swaps: {swaps}</p>

          <label>Speed</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />

          <label style={{ marginLeft: "20px" }}>Array Size</label>
          <input
            type="range"
            min="4"
            max="15"
            value={size}
            onChange={(e) => {
              setSize(+e.target.value);
              generateArray(+e.target.value);
            }}
          />

          <br /><br />

          <button onClick={start} disabled={isRunning}>Start</button>
          <button onClick={pauseResume} disabled={!isRunning}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={stop}>Stop</button>
          <button onClick={() => generateArray()}>New Array</button>

          <div style={{ display: "flex", alignItems: "flex-end", marginTop: "30px" }}>
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
                  fontWeight: "bold"
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === "stack" && (
        <>
          <h2>Stack (LIFO)</h2>
          <p>
            <strong>Time:</strong> {currentComplexity.time} |{" "}
            <strong>Space:</strong> {currentComplexity.space}
          </p>
          <button onClick={pushStack}>Push</button>
          <button onClick={popStack}>Pop</button>

          <div style={{ marginTop: "20px" }}>
            {stack.map((v, i) => (
              <div
                key={i}
                style={{
                  width: "80px",
                  margin: "5px",
                  padding: "10px",
                  background: "steelblue",
                  color: "white"
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === "queue" && (
        <>
          <h2>Queue (FIFO)</h2>
          <p>
            <strong>Time:</strong> {currentComplexity.time} |{" "}
            <strong>Space:</strong> {currentComplexity.space}
          </p>
          <button onClick={enqueue}>Enqueue</button>
          <button onClick={dequeue}>Dequeue</button>

          <div style={{ display: "flex", marginTop: "20px" }}>
            {queue.map((v, i) => (
              <div
                key={i}
                style={{
                  width: "60px",
                  margin: "5px",
                  padding: "10px",
                  background: "teal",
                  color: "white"
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
