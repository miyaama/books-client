import { Avatar, Card, Typography, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AVATAR_URL } from "../../../shared/constants";
import styles from "./LargestCollections.module.scss";

const LargestCollections = () => {
  const { t } = useTranslation();
  const { collections } = useSelector((state) => state.home);

  const { Title } = Typography;
  const { Meta } = Card;

  return (
    <>
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
                avatar={<Avatar src={`${AVATAR_URL}/${collection.UserId}`} />}
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
    </>
  );
};

export default LargestCollections;
