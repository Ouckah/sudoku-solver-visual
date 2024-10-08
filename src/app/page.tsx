"use client";

import React, { useEffect, useState } from "react";
import Board from "./_components/Board";
import SudokuSolver from "./_util/Solver";
import { EMPTY } from "./_util/Constants";

export default function Home() {
  const [board, setBoard] = useState(() =>
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // key listener for input to board
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedCell) {
        const key = event.key;

        // number input
        if (key >= "1" && key <= "9") {
          const num = parseInt(key);

          // update board
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((r) => [...r]);
            newBoard[selectedCell.row][selectedCell.col] = num;
            return newBoard;
          });
        }

        // delete input
        else if (key === "0" || key === "Backspace" || key === "Delete") {
          // update board
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((r) => [...r]);
            newBoard[selectedCell.row][selectedCell.col] = EMPTY;
            return newBoard;
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedCell]);

  const handleBoardUpdate = (newBoard: number[][]) => {
    setBoard(newBoard.map((row) => [...row]));
  };

  const handleBoardClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const solveSudoku = async () => {
    console.log("Solving...");
    const solver = new SudokuSolver(board, handleBoardUpdate, 100);
    if (await solver.solve()) {
      console.log("Solved board:", solver.getBoard());
    } else {
      alert("No solution exists.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col z-10 w-full max-w-5xl items-center justify-between gap-5 font-mono text-sm lg:flex">
        <Board board={board} onClick={handleBoardClick} />
        <button className="p-5 bg-gray-700" onClick={solveSudoku}>
          <h1>Solve</h1>
        </button>
      </div>
    </main>
  );
}
