import { Typography, Row, Button } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const { Title } = Typography;

const UserBar = ({ id }) => {
  const user = useSelector((state) => state.login);
  const { t } = useTranslation();

  const isUserPage = +id === user.id || user.access === "admin";

  const pageTitle = isUserPage
    ? t("myCollections")
    : t("collections") + (user.username || "");
  return (
    <Row justify="space-between" align="middle">
      <Title level={2}>{pageTitle}</Title>
      {isUserPage && (
        <Link to={`/user/${user?.id}/create`}>
          <Button type="primary">{t("add")}</Button>
        </Link>
      )}
    </Row>
  );
};

export default UserBar;
