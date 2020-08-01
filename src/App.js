import React, {useEffect, useState} from 'react';
import {css, StyleSheet} from "aphrodite";
import './App.css';

const GRIDSIZE = 15;

const initialCellState = () => [...Array(GRIDSIZE*GRIDSIZE)].map(() => ({letter: '', black: false, clueNumber: null}));

const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const leftEdge = index => index % GRIDSIZE === 0;
const topEdge = index => index < GRIDSIZE;
const leftBlack = (i, cells) => i - 1 > 0 && cells[i-1].black;
const topBlack = (i, cells) => i - GRIDSIZE > 0 && cells[i-GRIDSIZE].black;

const mutateCellsAddClueNum = cells => {
  let clueNumber = 1;
  for(let i = 0; i < cells.length; i++) {
    if(!cells[i].black) {
      if(leftEdge(i) || topEdge(i) || leftBlack(i, cells) || topBlack(i, cells)) {
        cells[i].clueNumber = clueNumber++;
      } else {
        cells[i].clueNumber = null;
      }
    }
  }
  return cells;
};

function App() {
  const [cells, setCells] = useState(storage.get('cellData') || initialCellState());
  const [highlightIndex, setHighlightIndex] = useState(storage.get('highlightIndex') || 0);
  const updateHighlightIndex = newIndex => {
    storage.set('highlightIndex', newIndex);
    setHighlightIndex(newIndex);
  };
  const updateCells = cells => {
    mutateCellsAddClueNum(cells);
    storage.set('cellData', cells);
    setCells(cells);
  };
  const rotationalSymmetry = true;

  useEffect(() => {
    const handleKeydown = event => {
      const newCells = [...cells];
      switch(event.key) {
        case "ArrowUp":
          if(Math.floor(highlightIndex / GRIDSIZE) > 0)
            updateHighlightIndex(highlightIndex - GRIDSIZE);
          break;
        case "ArrowDown":
          if(Math.floor(highlightIndex / GRIDSIZE) < GRIDSIZE - 1)
            updateHighlightIndex(highlightIndex + GRIDSIZE);
          break;
        case "ArrowLeft":
          if(highlightIndex % GRIDSIZE > 0)
            updateHighlightIndex(highlightIndex - 1);
          break;
        case "ArrowRight":
          if(highlightIndex % GRIDSIZE < GRIDSIZE - 1)
            updateHighlightIndex(highlightIndex + 1);
          break;
        case "a":
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
          if(event.ctrlKey || event.metaKey) {
            if(event.key === 'b') {
              const black = !newCells[highlightIndex].black;
              newCells[highlightIndex] = {letter: '', black};
              if(rotationalSymmetry)
                newCells[GRIDSIZE*GRIDSIZE - 1 - highlightIndex] = {letter: '', black};
              event.preventDefault(); // stop firefox cmd b from opening bookmarks
            }
          } else {
            newCells[highlightIndex] = {letter: event.key, black: false};
          }
          break;
        case 'Backspace':
          newCells[highlightIndex].letter = '';
          event.preventDefault(); // stop backspace from navigating browser
          break;
        default:
          break;
      }
      updateCells(newCells);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
  const updater = (row, col) => {
    updateHighlightIndex(row * GRIDSIZE + col);
  };
  return (
    <div>
      <div>
        {[...Array(GRIDSIZE)].map((_, i) => <Row data={cells.slice(GRIDSIZE*i, GRIDSIZE*i + GRIDSIZE)} highlightedCell={Math.floor(highlightIndex / GRIDSIZE) === i ? highlightIndex % GRIDSIZE : -1} onClick={updater.bind(null, i)} key={i} />)}
      </div>
      <button type="button" onClick={() => updateCells(initialCellState())}>Reset Board</button>
    </div>
  );
}

export default App;

function Row({data, highlightedCell, onClick}) {
  return (
    <div className={css(styles.row)}>
      {data.map((cellData, i) => <Cell data={cellData} highlighted={highlightedCell === i} onClick={onClick.bind(null, i)} key={i}/>)}
    </div>
  );
}

function Cell({data, highlighted, onClick}) {
  return (
    <div className={css(styles.cell, highlighted && styles.highlighted, data.black && styles.black)} onClick={onClick}>
      {data.clueNumber && <span className={css(styles.clueNum)}>{data.clueNumber}</span>}
      {data.letter}
    </div>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
  },
  cell: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'grey',
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase',
    position: 'relative',
  },
  highlighted: {
    backgroundColor: 'lightblue',
  },
  black: {
    backgroundColor: 'black',
  },
  clueNum: {
    fontSize: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cellInput: {
    border: 'none',
    width: 28,
    textTransform: 'uppercase',
  }
});
