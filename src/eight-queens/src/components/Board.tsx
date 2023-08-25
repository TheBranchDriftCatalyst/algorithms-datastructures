// import { Animation } from '@arwes/animated';
// import Queen from './queen.svg'
import styles from './Board.module.scss';
import React, { ReactElement, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import NQueensSolver from '@/lib/n_queens_solver';
import {FrameSVG, useFrameSVGAssemblingAnimation} from "@arwes/react-frames";
import { Text } from "@arwes/react";
import { Button } from "@/components/ui/button";
import {FrameSVGPathGeneric} from "@arwes/react";

export interface SquareProps {
  children?: React.ReactNode;
}

export interface FrameProps {
  children?: React.ReactNode;
  className?: string;
}

export const Square = ({children}: SquareProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);

  return (
    <div className={styles.square}>
      {children}
    </div>
  );
}

export interface BoardProps {
  size: number;
  children?: React.ReactNode;
}

export const BoardFrame = ({children}: {children: ReactElement[] | ReactElement}): ReactElement => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => [
    // Background shape.
    {
      name: 'bg',
      style: {
        strokeWidth: 0,
        fill: 'hsl(180, 75%, 10%)',
        filter: 'drop-shadow(0 0 2px hsl(180, 75%, 10%))'
      },
      path: [
        ['M', 20, 20],
        ['L', 20, '100% - 20'],
        ['L', '100% - 20', '100% - 20'],
        ['L', '100% - 20', 20]
      ]
    },
    // Top decoration.
    {
      name: 'line',
      style: {
        strokeWidth: '1',
        stroke: 'hsl(180, 75%, 50%)',
        fill: 'none',
        filter: 'drop-shadow(0 0 2px hsl(180, 75%, 50%))'
      },
      path: [
        ['M', 10, 10],
        ['L', '100% - 10', 10],
        ['L', '100% - 10', 40]
      ]
    },
    // Bottom decoration.
    {
      name: 'line',
      style: {
        strokeWidth: '2',
        stroke: 'hsl(180, 75%, 50%)',
        fill: 'none',
        filter: 'drop-shadow(0 0 2px hsl(180, 75%, 50%))'
      },
      path: [
        ['M', '100% - 10', '100% - 10'],
        ['L', 10, '100% - 10'],
        ['L', 10, '100% - 40']
      ]
    }
  ], []);

  return (
    <div style={{ position: 'absolute', inset: 20 }}>
      <FrameSVG paths={paths} />
      {children}
    </div>
  );
};

export const Board = ({size = 8}: BoardProps): ReactElement => {
  const [boardBuffer, setBoardBuffer] = useState<number[][][]>([[]]);//[[]
  const [boardState, setBoardState] = useState<number[][]>([[]]);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // TODO: refactor this to only have initHooks(Function) not {}
  const _solver: NQueensSolver = new NQueensSolver(size).initHooks({
    // solved: (...args: any[]) => console.log('solved', args),
    // removed: (...args: any[]) => console.log('removed', args),
    // placed: (...args: any[]) => console.log('placed', args),
    // @ts-ignore
    boardPosition: useCallback((boardState: number[][]) => {
      if (Date.now() - lastUpdateTime < 1000) {
        setBoardBuffer(boardBuffer => [...boardBuffer, boardState]);
      } else {
        const nextState = boardBuffer.pop();
        setBoardBuffer([...boardBuffer]);
        // @ts-ignore
        setBoardState(nextState);
        setLastUpdateTime(Date.now());
        console.log({nextState, lastUpdateTime, boardBuffer})
      };
    }, [boardState, lastUpdateTime, boardBuffer])
  })

  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);
  const [solver, setSolver] = useState<NQueensSolver | null>(_solver);

  const renderSquare = (i: number, j: number) => {
    return (
      <Square key={`square-${i}-${j}`} >
        <Text>
          {i}, {j}
        </Text>
      </Square>
    )
  };

  const renderRow = (row: number) => {
    let squares = [];
    for (let j = 0; j < size; j++) {
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
    for (let i = 0; i < size; i++) {
      rows.push(renderRow(i));
    }
    return rows;
  };

  const [active, setActive] = useState(false);
  console.log(styles)
  useEffect(() => {
    const tid = setTimeout(() => setActive(active => !active), 2000);
    setSolver(solver);
    return () => clearTimeout(tid);
  }, [boardState, active, size]);

  return (
    <BoardFrame>
      <div>
        <Text>{boardBuffer.length}</Text>
        {/*<Button layer='success'>Arwes</Button>*/}
      </div>
      <div className={styles.board}>
        {renderBoard()}
      </div>
    </BoardFrame>
  );
}

export default Board;
