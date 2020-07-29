import React, {useEffect, useState} from 'react';
import {css, StyleSheet} from "aphrodite";
import './App.css';

const GRIDSIZE = 15;

function App() {
  const [cells, setCells] = useState([...Array(GRIDSIZE*GRIDSIZE)].map((x, i) => ''));
  const [highlightIndex, setHighlightIndex] = useState(0);
  useEffect(() => {
    const handleKeydown = event => {
      switch(event.key) {
        case "ArrowUp":
          if(Math.floor(highlightIndex / GRIDSIZE) > 0)
            setHighlightIndex(highlightIndex - GRIDSIZE);
          break;
        case "ArrowDown":
          if(Math.floor(highlightIndex / GRIDSIZE) < GRIDSIZE - 1)
            setHighlightIndex(highlightIndex + GRIDSIZE);
          break;
        case "ArrowLeft":
          if(highlightIndex % GRIDSIZE > 0)
            setHighlightIndex(highlightIndex - 1);
          break;
        case "ArrowRight":
          if(highlightIndex % GRIDSIZE < GRIDSIZE - 1)
            setHighlightIndex(highlightIndex + 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
  const updater = (row, col) => {
    setHighlightIndex(row * GRIDSIZE + col);
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
    <div className={css(styles.cell, highlighted && styles.highlighted)} onClick={onClick}>{data}</div>
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
  },
  highlighted: {
    backgroundColor: 'lightblue',
  },
  cellInput: {
    border: 'none',
    width: 28,
    textTransform: 'uppercase',
  }
});
