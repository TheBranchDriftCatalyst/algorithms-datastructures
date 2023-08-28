// import { Animation } from '@arwes/animated';
// import Queen from './queen.svg'
import styles from './Board.module.scss';
import React, {ReactElement, useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {FrameSVG, useFrameSVGAssemblingAnimation} from "@arwes/react-frames";
import {Text} from "@arwes/react";
import {Button} from "@/components/ui/button";
import {FrameSVGPathGeneric} from "@arwes/react";

export interface SquareProps {
  children?: React.ReactNode;
}

export interface FrameProps {
  children?: React.ReactNode;
  className?: string;
}

export interface BoardProps {
  boardState?: Map<string, boolean>;
  boardStateUpdate?: Function;
  boardSize: number;
}

export const Board = ({boardState, boardSize}: BoardProps): ReactElement => {
  const renderSquare = (i: number, j: number) => {
    const key = `${i},${j}`;
    return (
      <div key={`${i},${j}`} className={`${styles.square} ${boardState?.has(key) ? styles.active : null}`}>
        <Text>
          {i}, {j}
        </Text>
      </div>
    )
  };

  const renderRow = (row: number) => {
    let squares = [];
    for (let j = 0; j < boardSize; j++) {
      squares.push(renderSquare(row, j));
    }
    return (
      <div key={`row-${row}`} className={styles['board-row']}>
        {squares}
      </div>
    );
  };


  const renderBoard = () => {
    let rows = [];
    for (let i = 0; i < boardSize; i++) {
      rows.push(renderRow(i));
    }
    return rows;
  };

  return (
    <div className={styles.board}>
      {renderBoard()}
    </div>
  );
}

export default Board;
