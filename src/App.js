import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";

import "./App.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import { IS_LOGIN_LOCAL_STORAGE } from "./shared/constants/localStorageKeys";
import { login, fetchTags, fetchCollections, fetchItems } from "./store/slices";

const getAuthFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(IS_LOGIN_LOCAL_STORAGE));

function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);


  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = getAuthFromLocalStorage();

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
