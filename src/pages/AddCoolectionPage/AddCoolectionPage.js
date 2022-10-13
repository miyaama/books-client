import { useTranslation } from "react-i18next";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// import styles from "./AddCoolectionPage.module.scss"
import PageLayout from "../../components/PageLayout";

const { Meta } = Card;
const { Title } = Typography;

const AddCoolectionPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const user = useSelector((state) => state.login.value);
  const isUserPage = +id === user.id || user.access === "admin";

  return (
    <PageLayout>
      <Title level={4}>
        {t("createСollection")}
      </Title>
    </PageLayout>
  );
};

export default AddCoolectionPage;
