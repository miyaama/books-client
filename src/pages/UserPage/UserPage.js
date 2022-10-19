import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// import styles from "./UserPage.module.scss"
import PageLayout from "../../components/PageLayout";

const { Meta } = Card;
const { Title } = Typography;

const UserPage = () => {
  const [collections, setCollections] = useState([]);
  const { t } = useTranslation();
  const { id } = useParams();
  const user = useSelector((state) => state.login);
  const isUserPage = +id === user.id || user.access === "admin";
  const navigate = useNavigate();


  const loadCollections = async () => {
    const response = await axios.get(
      `http://localhost:5000/collections/byuser/${id}`
    );
    setCollections(response.data);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const onDeleteCollection = (id) => {
    let newCollections = [...collections];
    axios.delete(`http://localhost:5000/collections/${id}`);
    newCollections = newCollections.filter((user) => user.id !== id);
    setCollections(newCollections);
  };

  const onEditCollection = (collection) => {
    const { name, description, theme, image, id } = collection;
    navigate(`/collection/${id}/update`, {
      state: {
        name,
        description,
        theme,
        image,
      },
    });
  };

  return (
    <PageLayout>
      <Title level={2}>
        {isUserPage ? t("myCollections") : t("collections") + (user.username || "")}
      </Title>
      {isUserPage && (
        <Link to={`/user/${user?.id}/create`}>
          <Button>{t("add")}</Button>{" "}
        </Link>
      )}
      <Row>
        {collections.map((collection) => (
          <Col key={collection.id} span={6}>
            <Card
              style={{
                maxWidth: "330px",
              }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={
                isUserPage
                  ? [
                      <EditOutlined key="edit" onClick={() => onEditCollection(collection)} />,
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
                  <Link to={`/collection/${collection.id}`}>
                    {collection.name}
                  </Link>
                }
                description={collection.description}
                style={{
                  height: "100px",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </PageLayout>
  );
};

export default UserPage;
