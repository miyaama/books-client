import { Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomeTable = () => {
  const { t } = useTranslation();

  const { items } = useSelector((state) => state.home);

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
      dataIndex: "collectionName",
    },
    {
      title: t("author"),
      dataIndex: "userName",
    },
  ];

  return (
    <>
      <Title level={3}>{t("lastItems")}</Title>
      <Table
        columns={columns}
        dataSource={items?.map((item) => ({ ...item, key: item.id }))}
      />
    </>
  );
};

export default HomeTable;
