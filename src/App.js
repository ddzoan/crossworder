import React, {useEffect, useState} from 'react';
import {css, StyleSheet} from "aphrodite";
import './App.css';

const GRIDSIZE = 15;

const initialCellState = () => [...Array(GRIDSIZE*GRIDSIZE)].map(() => ({letter: '', black: false}));

const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

function App() {
  const [cells, setCells] = useState(storage.get('cellData') || initialCellState());
  const [highlightIndex, setHighlightIndex] = useState(storage.get('highlightIndex') || 0);
  const updateHighlightIndex = newIndex => {
    storage.set('highlightIndex', newIndex);
    setHighlightIndex(newIndex);
  };
  const updateCells = cells => {
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
      {[...Array(GRIDSIZE)].map((_, i) => <Row data={cells.slice(GRIDSIZE*i, GRIDSIZE*i + GRIDSIZE)} highlightedCell={Math.floor(highlightIndex / GRIDSIZE) === i ? highlightIndex % GRIDSIZE : -1} onClick={updater.bind(null, i)} key={i} />)}
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
    <div className={css(styles.cell, highlighted && styles.highlighted, data.black && styles.black)} onClick={onClick}>{data.letter}</div>
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
  },
  highlighted: {
    backgroundColor: 'lightblue',
  },
  black: {
    backgroundColor: 'black',
  },
  cellInput: {
    border: 'none',
    width: 28,
    textTransform: 'uppercase',
  }
});
