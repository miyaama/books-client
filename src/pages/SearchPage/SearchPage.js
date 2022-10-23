import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Typography } from "antd";
import { useTranslation } from "react-i18next";

import PageLayout from "../../components/PageLayout";
import styles from "./SearchPage.module.scss";

const SearchPage = () => {
  const { t } = useTranslation();

  const { Title } = Typography;

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
      dataIndex: "collection",
    },
    {
      title: t("author"),
      dataIndex: "author",
    },
  ];

  const loadItems = async () => {};

  useEffect(() => {
    loadItems();
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
            // dataSource={users.map((user) => ({ ...user, key: user.id }))}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
