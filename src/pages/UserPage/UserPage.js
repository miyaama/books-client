import { useTranslation } from "react-i18next";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// import styles from "./UserPage.module.scss"
import PageLayout from "../../components/PageLayout";

const { Meta } = Card;
const { Title } = Typography;

const UserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const user = useSelector((state) => state.login);
  const isUserPage = +id === user.id || user.access === "admin";

  return (
    <PageLayout>
      <Title level={4}>
        {isUserPage ? t("myCollections") : t("collections") + (user.name || "")}
      </Title>
      {isUserPage && <Button>{t("add")}</Button>}
      <Row>
        <Col span={6}>
          <Card
            style={{
              maxWidth: "300px",
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={
              isUserPage
                ? [
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]
                : []
            }
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default UserPage;
