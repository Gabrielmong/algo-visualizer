import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

interface Algorithms {
  [key: string]: () => void;
}

interface Item {
  value: number;
  color: string;
  isSorted: boolean;
}

interface Values {
  [key: string]: string;
}

function App() {
  const [numberOfItems, setNumberOfItems] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [wait, setWait] = useState(1);
  const [state, setState] = useState("stopped");
  const [items, setItems] = useState<Item[]>([]);
  const [arrayAccess, setArrayAccess] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [time, setTime] = useState(0);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    shuffle();

    return () => {
      setItems([]);
    };
  }, [numberOfItems, algorithm]);

  const algorithms: Algorithms = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    quick: quickSort,
    merge: mergeSort,
  };

  const colors: Values = {
    grey: "#9e9e9e",
    red: "#f44336",
    green: "#4caf50",
    blue: "#2196f3",
  };

  async function sort() {
    setState("running");
    const time = Date.now();
    if (!isSorted) {
      await algorithms[algorithm]();
      setIsSorted(true);
    }
    setState("stopped");
    setTime(Date.now() - time);
  }

  function shuffle() {
    setState("running");
    const newItems: Item[] = [];
    for (let i = 0; i < numberOfItems; i++) {
      newItems.push({
        value: Math.floor(Math.random() * 100),
        color: colors.grey,
        isSorted: false,
      });
    }
    setArrayAccess(0);
    setComparisons(0);
    setIsSorted(false);
    setTime(0);

    setItems(newItems);
    setState("shuffled");
  }

  function handleAlgorithmChange(e: any) {
    setAlgorithm(e.target.value);
  }

  function handleNumberofItemsChange(e: any) {
    setNumberOfItems(e.target.value);
  }

  function handleSpeedChange(e: any) {
    setWait(e.target.value);
  }

  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function visualize(arr: Item[], i: number, j: number) {
    const newItems = [...arr];
    for (let k = 0; k < newItems.length; k++) {
      if (k === j || k === j + 1) {
        newItems[k].color = colors.red;
      } else if (k <= i) {
        newItems[k].color = colors.grey;
      } else {
        newItems[k].color = colors.grey;
      }

      if (newItems[k].isSorted) {
        newItems[k].color = colors.green;
      }
    }
    updateGraph(newItems);
  }

  function updateGraph(arr: Item[]) {
    setItems(arr);
  }

  async function finalRender(arr: Item[]) {
    const newItems = [...arr];
    for (let i = 0; i < newItems.length; i++) {
      const _newItems = [...newItems];
      for (let j = 0; j < _newItems.length; j++) {
        if (j <= i) {
          _newItems[j].color = colors.blue;
        } else {
          _newItems[j].color = colors.green;
        }
      }
      updateGraph(_newItems);
      if (wait > 0) {
        await sleep(wait * 2);
      }
    }
  }

  async function bubbleSort() {
    const arr = [...items];
    let i = 0;
    let j = 0;
    let swapped = false;
    while (i < arr.length) {
      if (j < arr.length - i - 1) {
        setComparisons((prev) => prev + 1);
        if (arr[j].value > arr[j + 1].value) {
          setComparisons((prev) => prev + 1);
          swapped = true;
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArrayAccess((prev) => prev + 3);
        }
        if (j === arr.length - i - 2) {
          arr[j + 1].isSorted = true;
        }

        if (wait > 0) {
          visualize(arr, i, j);
          await sleep(wait);
        }
        j++;
      } else {
        if (!swapped) {
          break;
        }
        swapped = false;
        i++;
        j = 0;
      }
    }

    await finalRender(arr);
  }

  async function selectionSort() {
    const arr = [...items];
    let i = 0;
    let j = 0;

    while (i < arr.length) {
      if (j < arr.length) {
        if (arr[j].value < arr[i].value) {
          setComparisons((prev) => prev + 1);
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArrayAccess((prev) => prev + 3);
        }
        if (j === arr.length - 1) {
          arr[i].isSorted = true;
        }

        visualize(arr, i, j);
        if (wait > 0) {
          await sleep(wait);
        }
        j++;
      } else {
        i++;
        j = i;
      }
    }

    await finalRender(arr);
  }

  async function insertionSort() {
    const arr = [...items];
    let i = 1;
    let j = 0;

    while (i < arr.length) {
      if (j >= 0) {
        if (arr[j].value > arr[j + 1].value) {
          setComparisons((prev) => prev + 1);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArrayAccess((prev) => prev + 3);
        }

        if (wait > 0) {
          visualize(arr, i, j);
          await sleep(wait);
        }
        j--;
      } else {
        i++;
        j = i - 1;
      }
    }

    await finalRender(arr);
  }

  async function mergeSort() {
    async function merge(arr: Item[], start: number, mid: number, end: number) {
      let i = start;
      let j = mid + 1;
      let k = start;
      const temp = [...arr];

      while (i <= mid && j <= end) {
        setComparisons((prev) => prev + 1);
        if (temp[i].value < temp[j].value) {
          setComparisons((prev) => prev + 1);
          arr[k] = temp[i];
          setArrayAccess((prev) => prev + 1);
          i++;
          if (wait > 0) {
            visualize(arr, i, j);
          }
        } else {
          setComparisons((prev) => prev + 1);
          arr[k] = temp[j];
          setArrayAccess((prev) => prev + 1);
          j++;
          if (wait > 0) {
            visualize(arr, i, j);
          }
        }
        k++;
        if (wait > 0) {
          await sleep(wait);
        }
      }

      while (i <= mid) {
        arr[k] = temp[i];
        i++;
        k++;
      }

      while (j <= end) {
        arr[k] = temp[j];
        j++;
        k++;
      }
    }

    async function mergeSortHelper(
      arr: Item[],
      start: number,
      end: number
    ): Promise<void> {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(arr, start, mid);
        await mergeSortHelper(arr, mid + 1, end);
        await merge(arr, start, mid, end);
      }
    }

    const arr = [...items];
    await mergeSortHelper(arr, 0, arr.length - 1);
    await finalRender(arr);
  }

  async function quickSort() {
    async function partition(
      arr: Item[],
      start: number,
      end: number
    ): Promise<number> {
      const pivot = arr[end].value;
      let i = start - 1;
      for (let j = start; j < end; j++) {
        if (arr[j].value < pivot) {
          setComparisons((prev) => prev + 1);
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArrayAccess((prev) => prev + 3);
        }
        if (wait > 0) {
          visualize(arr, i, j);
          await sleep(wait);
        }
      }
      const temp = arr[i + 1];
      arr[i + 1] = arr[end];
      arr[end] = temp;
      setArrayAccess((prev) => prev + 3);
      return i + 1;
    }

    async function quickSortHelper(
      arr: Item[],
      start: number,
      end: number
    ): Promise<void> {
      if (start < end) {
        const pivot = await partition(arr, start, end);
        await quickSortHelper(arr, start, pivot - 1);
        await quickSortHelper(arr, pivot + 1, end);
      }
    }

    const arr = [...items];
    await quickSortHelper(arr, 0, arr.length - 1);
    await finalRender(arr);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/algo-visualizer"
            element={
              <>
                <Container
                  maxWidth="sm"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={shuffle}
                      disabled={state === "running"}
                    >
                      Shuffle
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={sort}
                      disabled={state === "running"}
                    >
                      Sort
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 2,
                    }}
                  >
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel id="number-of-items-select-label">
                        Number of Items
                      </InputLabel>
                      <Select
                        labelId="number-of-items-select-label"
                        id="number-of-items-select"
                        value={numberOfItems}
                        label="Number of Items"
                        onChange={handleNumberofItemsChange}
                        disabled={state === "running"}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                        <MenuItem value={70}>70</MenuItem>
                        <MenuItem value={80}>80</MenuItem>
                        <MenuItem value={90}>90</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="algorithm-select-label">
                        Algorithm
                      </InputLabel>
                      <Select
                        labelId="algorithm-select-label"
                        id="algorithm-select"
                        value={algorithm}
                        label="Algorithm"
                        onChange={handleAlgorithmChange}
                        disabled={state === "running"}
                      >
                        <MenuItem value={"bubble"}>Bubble Sort</MenuItem>
                        <MenuItem value={"selection"}>Selection Sort</MenuItem>
                        <MenuItem value={"insertion"}>Insertion Sort</MenuItem>
                        <MenuItem value={"quick"}>Quick Sort</MenuItem>
                        <MenuItem value={"merge"}>Merge Sort</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="speed-select-label">Wait</InputLabel>
                      <Select
                        labelId="speed-select-label"
                        id="speed-select"
                        value={wait}
                        label="Wait"
                        onChange={handleSpeedChange}
                        disabled={state === "running"}
                      >
                        <MenuItem value={0}>No wait</MenuItem>
                        <MenuItem value={1}>1ms</MenuItem>
                        <MenuItem value={10}>10ms</MenuItem>
                        <MenuItem value={50}>50ms</MenuItem>
                        <MenuItem value={100}>100ms</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Container>
                <Container maxWidth="md">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      minHeight: "400px",
                    }}
                  >
                    {items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 100 / numberOfItems + "%",
                          height: item.value * 4,
                          backgroundColor: item.color,
                        }}
                      />
                    ))}
                  </Box>
                </Container>

                <Container
                  maxWidth="sm"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    sx={{
                      color:
                        state === "running"
                          ? colors.blue
                          : state === "stopped"
                          ? colors.green
                          : colors.red,
                    }}
                  >
                    {state === "running"
                      ? "Sorting..."
                      : state === "stopped"
                      ? "Sorted!"
                      : "Shuffled!"}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    Array accesses:{" "}
                    <Typography
                      variant="body1"
                      sx={{ display: "inline", color: colors.green }}
                    >
                      {arrayAccess}
                    </Typography>
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    Comparisons:{" "}
                    <Typography
                      variant="body1"
                      sx={{ display: "inline", color: colors.green }}
                    >
                      {comparisons}
                    </Typography>
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    Time:{" "}
                    <Typography
                      variant="body1"
                      sx={{ display: "inline", color: colors.green }}
                    >
                      {time}
                    </Typography>
                    ms
                  </Typography>
                </Container>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
