import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Card, Typography, Row, Col, Table } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TagCloud } from "react-tagcloud";

import styles from "./HomePage.module.scss";
import PageLayout from "../../components/PageLayout";
import { BACKEND_URL } from "../../shared/constants";

const { Meta } = Card;
const { Title } = Typography;

const data = [
  { value: "JavaScript", count: 38 },
  { value: "React", count: 30 },
  { value: "Nodejs", count: 28 },
  { value: "Express.js", count: 25 },
  { value: "HTML5", count: 33 },
  { value: "MongoDB", count: 18 },
  { value: "CSS3", count: 20 },
];

const HomePage = () => {
  const { t } = useTranslation();
  const { collections, items, tags } = useSelector((state) => state.home);
  console.log(collections);

  const loadCollections = async () => {
    const response = await axios.get(`${BACKEND_URL}/items/lastitems`);
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      render: (text, record) => (
        <Link state={{ record }} to={`/book/${record.id}`} >
          {text}
        </Link>
      ),
    },
    {
      title: t("collection"),
      dataIndex: "collection",
    },
    {
      title: t("author"),
      dataIndex: "author",
    },
  ];

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <PageLayout>
      <Title level={2}>{t("largestCollections")}</Title>
      <Row>
        {collections?.map((collection) => (
          <Col span={6} key={collection.id}>
            <Card
              className={styles.card}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
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
      <Title level={2}>{t("lastItems")}</Title>
      <Table
        columns={columns}
        dataSource={items[0]?.map((item) => ({ ...item, key: item.id }))}
      />
      <Title level={2}>{t("cloudTags")}</Title>
      <TagCloud
        minSize={12}
        maxSize={55}
        tags={data}
        onClick={(tag) => alert(`'${tag.value}' was selected!`)}
      />
    </PageLayout>
  );
};

export default HomePage;
