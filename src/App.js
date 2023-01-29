import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import {
  IS_LOGIN_LOCAL_STORAGE,
  THEME,
} from "./shared/constants/localStorageKeys";
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
    let isTheme = localStorage.getItem(THEME) ?? false;
    console.log("localStorage.getItem(THEME)", localStorage.getItem(THEME))

    dispatch(setTheme(isTheme));
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
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div className="app">
        <AppRoutes />
      </div>
    </ConfigProvider>
  );
}

export default App;
