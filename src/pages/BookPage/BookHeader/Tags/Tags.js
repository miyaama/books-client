import styles from "./Tags.module.scss";
import { Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const Tags = ({ record }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.tags}>
      <Title level={5} className={styles.tagTitle}>
        {t("tagsOnPage")}
      </Title>
      {record.tags?.map((tag) => {
        let color = tag.length > 5 ? "geekblue" : "green";
        return (
          <Tag key={tag} color={color}>
            {tag}
          </Tag>
        );
      })}
    </div>
  );
};

export default Tags;
