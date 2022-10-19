import { useDispatch } from "react-redux";

import "./App.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";
import { IS_LOGIN_LOCAL_STORAGE } from "./shared/constants/localStorageKeys";
import { login } from "./store/slices";

function App() {
  const getAuthFromLocalStorage = () =>
    JSON.parse(localStorage.getItem(IS_LOGIN_LOCAL_STORAGE));

  const dispatch = useDispatch();
  const isAuth = getAuthFromLocalStorage();

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

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
