import { useTranslation } from "react-i18next";
import { Avatar, Card, Typography, Row, Col, Table } from "antd";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TagCloud } from "react-tagcloud";

import styles from "./HomePage.module.scss";
import PageLayout from "../../components/PageLayout";

const { Meta } = Card;
const { Title } = Typography;

const HomePage = () => {
  const { t } = useTranslation();
  const { collections, items, tags } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const tagsData = tags.map((tag) => {
    return { ...tag, value: tag.name, count: Math.random() * 40 + 15 };
  });

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      render: (text, record) => (
        <Link state={{ record }} to={`/book/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: t("collection"),
      dataIndex: "collectionName",
    },
    {
      title: t("author"),
      dataIndex: "userName",
    },
  ];

  return (
    <PageLayout>
      <Title level={3}>{t("largestCollections")}</Title>
      <Row gutter={[16, 24]}>
        {collections?.map((collection) => (
          <Col
            key={collection.id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            xl={{ span: 6 }}
          >
            <Card className={styles.card}>
              <Meta
                avatar={
                  <Avatar
                    src={`https://joeschmoe.io/api/v1/${collection.UserId}`}
                  />
                }
                title={
                  <Link to={`/collection/${collection.id}`}>
                    {collection.name}
                  </Link>
                }
                description={collection.description}
                className={styles.title}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Title level={3}>{t("lastItems")}</Title>
      <Table
        columns={columns}
        dataSource={items?.map((item) => ({ ...item, key: item.id }))}
      />
      <Title level={3}>{t("cloudTags")}</Title>
      <TagCloud
        minSize={15}
        className={styles.cloud}
        maxSize={40}
        tags={tagsData}
        onClick={(tag) => navigate(`/search/${tag.name}`)}
      />
    </PageLayout>
  );
};

export default HomePage;
