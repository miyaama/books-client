import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import {
  IS_LOGIN_LOCAL_STORAGE,
  THEME,
  DARK_THEME,
} from "./shared/constants/";
import {
  login,
  fetchTags,
  fetchCollections,
  fetchItems,
  setTheme,
} from "./store/slices";

const getAuthFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(IS_LOGIN_LOCAL_STORAGE));

function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const { defaultAlgorithm, darkAlgorithm } = theme;

  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = getAuthFromLocalStorage();
    let localStorageTheme = localStorage.getItem(THEME) ?? DARK_THEME;
    dispatch(setTheme(localStorageTheme));
    dispatch(fetchTags());
    dispatch(fetchCollections());
    dispatch(fetchItems());

    if (isAuth?.isLogin) {
      dispatch(
        login({
          id: isAuth.id,
          username: isAuth.username,
          email: isAuth.email,
          isLogin: isAuth.isLogin,
          access: isAuth.access,
        })
      );
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode === DARK_THEME ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div className="app">
        <AppRoutes />
      </div>
    </ConfigProvider>
  );
}

export default App;
