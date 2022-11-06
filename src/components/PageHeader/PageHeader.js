import { Typography, Select, Menu, Layout, Switch } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./PageHeader.module.scss";
import {
  LANGUAGE,
  IS_LOGIN_LOCAL_STORAGE,
  THEME,
  LIGHT_THEME,
  DARK_THEME, LOGIN, ADMIN
} from "../../shared/constants";
import { logout } from "../../store/slices";
import { ACCESS_ADMIN } from "../../shared/constants";

const { Title } = Typography;
const { Option } = Select;
const { Header } = Layout;

const PageHeader = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.login);

  const theme = localStorage.getItem(THEME) || LIGHT_THEME;

  const isLightTheme = theme === LIGHT_THEME;

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE, language);
  };

  const changeTheme = (lightTheme) => {
    localStorage.setItem(THEME, lightTheme ? LIGHT_THEME : DARK_THEME);
    window.location.reload();
  };

  const onLogin = () => {
    navigate(LOGIN);
  };

  const onLogout = () => {
    localStorage.setItem(IS_LOGIN_LOCAL_STORAGE, "{}");
    dispatch(logout());
  };

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
      {
        label: (
          <Switch
            checkedChildren={<span> &#9788; </span>}
            unCheckedChildren={<span> &#9789; </span>}
            defaultChecked={isLightTheme}
            onChange={(value) => changeTheme(value)}
          />
        ),
        key: "theme",
      },
      {
        label: (
          <Select
            defaultValue={localStorage.getItem(LANGUAGE) || "en"}
            className={styles.select}
            id="languageSelect"
            bordered={false}
            onChange={(value) => {
              changeLanguage(value);
            }}
          >
            <Option value="ru">RU</Option>
            <Option value="en">ENG</Option>
          </Select>
        ),
        key: "language",
      },
    ];

    if (isLogin) {
      items.splice(1, 0, {
        label: (
          <Link to={`/user/${user?.id}`} key="item1">
            {translation("myPage")}
          </Link>
        ),
        key: "page",
      });
    }

    if (access === ACCESS_ADMIN) {
      items.splice(2, 0, {
        label: (
          <Link to={ADMIN} key="item2">
            {translation("adminPanel")}
          </Link>
        ),
        key: "admin",
      });
    }
    items.push({
      label: user?.isLogin ? (
        <p onClick={onLogout}>{t("logout")}</p>
      ) : (
        <p onClick={onLogin}>{t("login")}</p>
      ),
      key: "login",
    });

    return items;
  };
  const items = getmenuItems(user, t);

  return (
    <Header className={styles.header}>
      <Link to="/">
        <Title level={3} className={styles.title} />
      </Link>
      <Menu
        items={items}
        theme="dark"
        mode="horizontal"
        selectable={false}
        className={styles.menu}
      />
    </Header>
  );
};

export default PageHeader;
