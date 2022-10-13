import { Button, Typography, Select, Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./PageHeader.module.scss";
import {
  LANGUAGE,
  IS_LOGIN_LOCAL_STORAGE,
} from "../../shared/constants/localStorageKeys";
import { logout } from "../../store/slices";

const { Title } = Typography;
const { Option } = Select;
const { Header } = Layout;

const PageHeader = () => {
  const user = useSelector((state) => state.login.value);
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  console.log("state: ", state);
  const items = [
    {
      label: (
        <Link to="/" key="item0">
          {t("home")}
        </Link>
      ),
    },
    {
      label: (
        <Link to={`/user/${user?.id}`} key="item1">
          {t("myPage")}
        </Link>
      ),
    },
    {
      label: (
        <Link to="/admin" key="item2">
          {t("admin")}
        </Link>
      ),
    },
  ];

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE, language);
  };

  const onLogin = () => {
    navigate("/login");
  };

  const onLogout = () => {
    localStorage.setItem(IS_LOGIN_LOCAL_STORAGE, "{}");
    dispatch(logout());
  };

  return (
    <Header className={styles.header}>
      <Link to="/">
        <Title
          level={3}
          style={{ color: "#ffffff", margin: 0, textAlign: "center" }}
        >
          My Library
        </Title>
      </Link>
      <Menu items={items} theme="dark" mode="horizontal" />
      <div>
        <Select
          defaultValue={localStorage.getItem(LANGUAGE) || "en"}
          style={{
            width: 70,
          }}
          onChange={(value) => {
            changeLanguage(value);
          }}
        >
          <Option value="ru">RU</Option>
          <Option value="en">ENG</Option>
        </Select>
        {user?.isLogin ? (
          <Button type="primary" onClick={onLogout}>
            {t("logout")}
          </Button>
        ) : (
          <Button type="primary" onClick={onLogin}>
            {t("login")}
          </Button>
        )}
      </div>
    </Header>
  );
};

export default PageHeader;
