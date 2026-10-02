import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, isWinning }) {
  let className = "square";

  if (isWinning) {
    className = "square winning-square";
  }

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);

  let status;

  if (result) {
    status = "Winner: " + result.winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  for (let row = 0; row < 3; row++) {
    const rowSquares = [];

    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;

      let isWinning = false;

      if (result && result.line.includes(i)) {
        isWinning = true;
      }

      rowSquares.push(
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          isWinning={isWinning}
        />
      );
    }

    board.push(
      <div className="board-row" key={row}>
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setAscending(!ascending);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      const previousSquares = history[move - 1];

      let changedSquare = 0;

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== previousSquares[i]) {
          changedSquare = i;
          break;
        }
      }

      const row = Math.floor(changedSquare / 3) + 1;
      const col = (changedSquare % 3) + 1;

      description = "Go to move #" + move + " (" + row + ", " + col + ")";
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = ascending ? [...moves] : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button onClick={toggleSort}>
          Sort {ascending ? "Descending" : "Ascending"}
        </button>

        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return null;
}
