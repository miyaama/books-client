import { useEffect } from "react";
import { useDispatch } from "react-redux";

import "./App.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import { IS_LOGIN_LOCAL_STORAGE } from "./shared/constants/localStorageKeys";
import { login, fetchTags, fetchCollections, fetchItems } from "./store/slices";

const getAuthFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(IS_LOGIN_LOCAL_STORAGE));

function App() {
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
          username: isAuth.name,
          email: isAuth.email,
          isLogin: isAuth.isLogin,
          access: isAuth.access,
        })
      );
    }
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
