import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "./UserPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { BACKEND_URL } from "../../shared/constants";

const { Meta } = Card;
const { Title } = Typography;

const UserPage = () => {
  const [collections, setCollections] = useState([]);
  const { t } = useTranslation();
  const { id } = useParams();
  const user = useSelector((state) => state.login);
  const navigate = useNavigate();

  const isUserPage = +id === user.id || user.access === "admin";

  const loadCollections = async () => {
    const response = await axios.get(`${BACKEND_URL}/collections/byuser/${id}`);
    setCollections(response.data);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const onDeleteCollection = (id) => {
    let newCollections = [...collections];
    axios.delete(`${BACKEND_URL}/collections/${id}`);
    newCollections = newCollections.filter((user) => user.id !== id);
    setCollections(newCollections);
  };

  const onEditCollection = (collection) => {
    const { name, description, theme, itemTypes, UserId } = collection;
    navigate(`/collection/${collection.id}/update`, {
      state: {
        name,
        description,
        theme,
        itemTypes,
        UserId,
      },
    });
  };

  return (
    <PageLayout>
      <Row justify="space-between" align="middle">
        <Title level={2}>
          {isUserPage
            ? t("myCollections")
            : t("collections") + (user.username || "")}
        </Title>
        {isUserPage && (
          <Link to={`/user/${user?.id}/create`}>
            <Button type="primary">{t("add")}</Button>{" "}
          </Link>
        )}
      </Row>
      <Row gutter={[16, 24]}>
        {collections.map((collection) => (
          <Col
            key={collection.id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            xl={{ span: 6 }}
          >
            <Card
              className={styles.card}
              actions={
                isUserPage
                  ? [
                      <EditOutlined
                        key="edit"
                        onClick={() => onEditCollection(collection)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => onDeleteCollection(collection.id)}
                      />,
                    ]
                  : []
              }
            >
              <Meta
                avatar={
                  <Avatar
                    src={`https://joeschmoe.io/api/v1/${collection.UserId}`}
                  />
                }
                title={
                  <Link to={`/collection/${collection.id}`} state={{ id: id }}>
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
    </PageLayout>
  );
};

export default UserPage;
