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
import { ACCESS_ADMIN } from "../../shared/constants";

const { Title } = Typography;
const { Option } = Select;
const { Header } = Layout;

const getmenuItems = (user, translation) => {
  const { isLogin, access } = user;

  let items = [
    {
      label: (
        <Link to="/" key="item0">
          {translation("home")}
        </Link>
      ),
      key: "home",
    },
  ];

  if (isLogin) {
    items.push({
      label: (
        <Link to={`/user/${user?.id}`} key="item1">
          {translation("myPage")}
        </Link>
      ),
      key: "page",
    });
  }

  if (access === ACCESS_ADMIN) {
    items.push({
      label: (
        <Link to="/admin" key="item2">
          {translation("admin")}
        </Link>
      ),
      key: "admin",
    });
  }
  return items;
};

const PageHeader = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.login);

  const items = getmenuItems(user, t);

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
        <Title level={3} className={styles.title}>
          My Library
        </Title>
      </Link>
      <Menu
        items={items}
        theme="dark"
        mode="horizontal"
        className={styles.menu}
      />
      <div className={styles.buttons}>
        <Select
          defaultValue={localStorage.getItem(LANGUAGE) || "en"}
          className={styles.select}
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
