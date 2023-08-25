import { jsx } from '@emotion/react';
import { type ReactElement, useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Animator } from '@arwes/react-animator';
import { FrameSVGNefrex, useFrameSVGAssemblingAnimation } from '@arwes/react-frames';

const Frame = (): ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);

  return (
    // @ts-ignore
    <div css={{
      position: 'relative',
      width: 200,
      height: 150,

      '[data-name=bg]': {
        color: 'hsl(60, 75%, 10%)',
        filter: 'drop-shadow(0 0 4px hsl(60, 75%, 10%))'
      },
      '[data-name=line]': {
        color: 'hsl(60, 75%, 50%)',
        filter: 'drop-shadow(0 0 4px hsl(60, 75%, 50%))'
      }
    }}>
      <FrameSVGNefrex
        elementRef={svgRef}
        onRender={onRender}
        padding={4}
        strokeWidth={2}
        squareSize={32}
        smallLineLength={32}
        largeLineLength={128}
      />
    </div>
  );
};

export default Frame;
