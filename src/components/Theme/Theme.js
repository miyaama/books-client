import React from "react";
import { THEME, LIGHT_THEME } from "../../shared/constants";

const LightTheme = React.lazy(() => import("./LightTheme"));
const DarkTheme = React.lazy(() => import("./DarkTheme"));

export const ThemeSelector = ({ children }) => {
  const CHOSEN_THEME = localStorage.getItem(THEME) || LIGHT_THEME;
  return (
    <>
      <React.Suspense fallback={<></>}>
        {CHOSEN_THEME === LIGHT_THEME ? <LightTheme /> : <DarkTheme />}
      </React.Suspense>
      {children}
    </>
  );
};
