import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Typography, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import PageLayout from "../../components/PageLayout";
import styles from "./SearchPage.module.scss";
import { BACKEND_URL } from "../../shared/constants";

const SearchPage = () => {
  const { quest } = useParams();
  const [items, setItems] = useState([]);
  const { t } = useTranslation();
  const { Title } = Typography;

  const columns = [
    {
      title: t("title"),
      dataIndex: "name",
      render: (text, record) => (
        <Link state={{ record }} to={`/book/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: t("tags"),
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const loadItems = async (tag) => {
    const response = await axios.get(`${BACKEND_URL}/items/bytag/${tag}`);
    setItems(response.data);
  };

  useEffect(() => {
    loadItems(quest);
  }, []);

  return (
    <PageLayout>
      <div>
        <Title level={2} className={styles.title}>
          {t("searchResults")}
        </Title>
        <div>
          <div className={styles.table}></div>
          <Table
            columns={columns}
            dataSource={items.map((item) => ({ ...item, key: item.id }))}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
