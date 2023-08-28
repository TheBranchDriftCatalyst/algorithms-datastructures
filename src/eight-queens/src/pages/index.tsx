"use client";
import {Inter} from 'next/font/google'
import {flushSync} from 'react-dom';
import React, {ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Board from "@/components/Board";
import {Text} from "@arwes/react";
import Background from "@/components/arwes/Background";
import layout from '@/styles/layout.module.scss'
import NQueensSolver, {QueenCoordinates} from "@/lib/n_queens_solver";
import {size} from "@floating-ui/dom";
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {reduce} from "lodash";
import { ThemeChanger } from '@/components/ThemeProvider';
import Header from '@/components/arwes/Header';



const inter = Inter({subsets: ['latin']})


// const Header = (): ReactElement => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const {onRender} = useFrameSVGAssemblingAnimation(svgRef);
//
//   return (
//     <div css={{
//       position: 'relative',
//       width: 300,
//       height: 150,
//
//       '[data-name=bg]': {
//         color: 'hsl(180, 75%, 10%)'
//       },
//       '[data-name=line]': {
//         color: 'hsl(180, 75%, 50%)'
//       }
//     }}>
//       <FrameSVGUnderline
//         elementRef={svgRef}
//         onRender={onRender}
//       />
//     </div>
//   );
// };

type ArrayOfQueenPositions = QueenCoordinates[];
type SolverStats = { removed: number, placed: number, solved: number }

const INITIAL_REFRESH_TIME = 1;
const INITIAL_BOARD_SIZE = 6;

export default function Home() {
  const [boardState, setBoardState] = useState<ArrayOfQueenPositions>([]);
  const [boardSize, setBoardSize] = useState<number>(INITIAL_BOARD_SIZE);
  const [refreshTime, _setRefreshTime] = useState<number>(INITIAL_REFRESH_TIME);
  const [solver, setSolver] = useState<NQueensSolver>(new NQueensSolver(boardSize));
  const [solutions, setBoardSolutions] = useState<ArrayOfQueenPositions[]>(solver.solutions);
  const [stats, setStats] = useState<SolverStats>({ removed: 0, placed: 0, solved: 0 });

  const stateMap: Map<string, boolean> = reduce(
    boardState,
    (r, x): Map<string, boolean> => r.set(`${x[0]},${x[1]}`, true), 
    new Map<string, boolean>()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const nextState = solver.moves.shift();
      nextState && setBoardState(nextState);
      const nextMoveType = solver.moveSequence.shift();
      if (nextMoveType) {
        stats[nextMoveType] += 1;
        setStats({...stats});
      }
    }, refreshTime);
    return () => clearInterval(interval);
  }, [solver, refreshTime]);

  return (
    <>
    <div className="container">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl">Test Header</h1>
          <p className="text-lg text-muted-foreground">Test Text</p>
        </div>
        <div className="grid gap-1">
          <Button onClick={() => solver.solve()}>Solve</Button>
        </div>
        <div className="grid gap-1">
          <Slider
            onValueChange={(n) => {
              const newSize = n.pop() || INITIAL_REFRESH_TIME;
              setBoardSize(newSize);
              setSolver(new NQueensSolver(newSize));
            }}
            style={{width: '200px'}}
            defaultValue={[boardSize]}
            max={15}
            min={4}
            step={1}
          />
        </div>
        <div className="grid gap-1">
          <ThemeChanger />
        </div>
      </div>
      {/* <div className="flex justify-items-start">
        <div className="flex-1">
          <Button onClick={() => solver.solve()}>Solve</Button>
        </div>
        <div className="flex-1">
          <Slider
            onValueChange={(n) => {
              const newSize = n.pop() || INITIAL_REFRESH_TIME;
              setBoardSize(newSize);
              setSolver(new NQueensSolver(newSize));
            }}
            style={{width: '200px'}}
            defaultValue={[boardSize]}
            max={15}
            min={4}
            step={1}
          />
        </div>
        <div>
          <ThemeChanger />
        </div>
      </div> */}
      <div className="container">
        <span className="">
          {/* @ts-ignore */}
          <Board boardSize={boardSize} boardState={stateMap}/>
        </span>
        <span className="">
          <h1>stats</h1>
          <div className="container">
            <span>Solved</span><span>{stats.solved}</span>
          </div>
          <div className="container">
            <span>Removed</span><span>{stats.removed}</span>
          </div>
          <div className="container">
            <span>Placed</span><span>{stats.placed}</span>
          </div>

        </span>
      </div>
    </div>
    </>
  )
}
