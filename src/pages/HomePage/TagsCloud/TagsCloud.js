import { TagCloud } from "react-tagcloud";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./TagsCloud.module.scss";

const TagsCloud = () => {
  const { tags } = useSelector((state) => state.home);
  const { t } = useTranslation();

  const { Title } = Typography;

  const navigate = useNavigate();
  const tagsData = tags.map((tag) => {
    return { ...tag, value: tag.name, count: Math.random() * 40 + 15 };
  });
  return (
    <>
      <Title level={3}>{t("cloudTags")}</Title>
      <TagCloud
        minSize={15}
        className={styles.cloud}
        maxSize={40}
        tags={tagsData}
        onClick={(tag) => navigate(`/search/${tag.name}`)}
      />
    </>
  );
};

export default TagsCloud;
