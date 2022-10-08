import { Button, Typography, Select, Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./PageHeader.module.scss";
import { LANGUAGE } from "../../shared/constants/localStorageKeys";

const { Title } = Typography;
const { Option } = Select;
const { Header } = Layout; 

const PageHeader = () => {
  const { t, i18n } = useTranslation();
  const items = [
    {
      label: (
        <Link to="/home" key="item1">
          {t("home")}
        </Link>
      ),
    },
    {
      label: (
        <Link to="/home" key="item2">
          {t("myPage")}
        </Link>
      ),
    },
  ];

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE, language);
  };

  return (
    <Header className={styles.header}>
      <Link to="/home">
        <Title level={3} style={{ color: "#ffffff", margin: 0 }}>
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
        <Link to="/">
          <Button type="primary">{t("login")}</Button>
        </Link>
      </div>
    </Header>
  );
};

export default PageHeader;
