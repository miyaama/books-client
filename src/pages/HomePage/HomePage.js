import { useTranslation } from "react-i18next";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Row, Col } from "antd";

// import styles from "./HomePage.module.scss"
import PageLayout from "../../components/PageLayout";

const { Meta } = Card;
const { Title } = Typography;

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <Title level={2}>{t("largestCollections")}</Title>
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
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
      <Title level={2}>{t("lastItems")}</Title>
    </PageLayout>
  );
};

export default HomePage;
