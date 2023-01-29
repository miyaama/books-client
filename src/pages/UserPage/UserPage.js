import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {  Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Avvvatars from 'avvvatars-react';

import styles from "./UserPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { BACKEND_URL } from "../../shared/constants";
import UserBar from "./UserBar/";

const { Meta } = Card;

const UserPage = () => {
  const [collections, setCollections] = useState([]);
  const { id } = useParams();
  const user = useSelector((state) => state.login);
  const navigate = useNavigate();

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

  const isUserPage = +id === user.id || user.access === "admin";

  return (
    <PageLayout>
      <UserBar id={id} />
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
                avatar={<Avvvatars style="shape" value={collection.UserId} />}
                 
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
