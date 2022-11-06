import { Typography, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

import Like from "./Like";
import Tags from "./Tags/Tags";
import styles from "./BookHeader.module.scss";

const { Title } = Typography;

const BookHeader = ({ record, bookId }) => {
  const { t } = useTranslation();

  return (
    <>
      <Row align="middle" justify="space-between">
        <Col span={20}>
          <Title className={styles.title} level={2}>{`${t("title")}: ${
            record.name
          }`}</Title>
        </Col>
        <Like record={record} bookId={bookId} />
      </Row>
      <Tags record={record} />
      {record.itemTypes ? (
        <Title level={5}>{`${record.itemTypes}: ${record.field || ""}`}</Title>
      ) : (
        ""
      )}
    </>
  );
};
export default BookHeader;
