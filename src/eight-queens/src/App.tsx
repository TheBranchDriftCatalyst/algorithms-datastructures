import './App.css';

import React, { type ReactElement } from 'react';
import Header from './components/Header';
import Background from './components/Background';

import { type CSSObject, Global } from '@emotion/react';
import { createAppTheme, createAppStylesBaseline, Animator, AppTheme, AppThemeSettingsPalette, Text } from '@arwes/react';

const createThemePalette = (hue: number): AppThemeSettingsPalette => ({
  // Darkening colors.
  main: (i: number) => [hue, 80 + i, 92.5 - i * 9.44],
  text: (i: number) => [hue, 10, 92.5 - i * 9.44],

  // Lightening colors.
  bg: (i: number) => [hue, 10, 2 + i * 2],
  ol: (i: number) => [hue, 80 + 1, 2 + i * 2],
  deco: (i: number) => [hue, 80 + 1, 50, 0.025 + i * 0.025]
});

const theme: AppTheme = createAppTheme({
  settings: {
    hues: {
      primary: 160,
      secondary: 280
    },
    colors: {
      primary: createThemePalette(160),
      secondary: createThemePalette(280)
    }
  }
});

const stylesBaseline = createAppStylesBaseline(theme);

const App = (): ReactElement => {
  return (
    <>
      <Global styles={stylesBaseline as Record<string, CSSObject>} />
      <Header />
      <Background />

    </>
  );
};

export default App;
