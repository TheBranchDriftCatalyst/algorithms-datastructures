import { GridLines, Dots, MovingLines } from '@arwes/react';
import { ReactElement } from 'react';

export interface BackgroundProps {
  theme: any;
}

const Background = ({theme}: BackgroundProps): ReactElement => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: theme.colors.primary.bg(1)
      }}
    >
      <GridLines lineColor={theme.colors.primary.deco(0)} />
      <Dots color={theme.colors.primary.deco(1)} />
      <MovingLines lineColor={theme.colors.primary.deco(2)} />
    </div>
  );
};

export default Background;