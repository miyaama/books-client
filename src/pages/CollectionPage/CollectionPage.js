import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Space, Typography } from "antd";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";
// import AddItem from "../../components/AddItem/AddItem";

import { ModalFrame } from "../../components/ModalFrame.js/ModalFrame";

const CollectionPage = () => {
  const [items, setItems] = useState([]);
  const [collection, setCollection] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { collectionId } = useParams();

  const { Title } = Typography;

  // const currentUserId = userData?.id;

  const columns = [
    {
      title: t("title"),
      dataIndex: "title",
    },
    {
      title: t("image"),
      dataIndex: "image",
    },
    {
      title: t("tags"),
      dataIndex: "tags",
    },
    {
      title: t("status"),
      dataIndex: "status",
    },
    {
      title: t("access"),
      dataIndex: "access",
    },
  ];

  const toggleOppenessAddItemPopup = () =>
    setIsAddItemPopupOpen((value) => !value);

  const loadItems = async () => {
    const response = await axios.get(
      `http://localhost:5000/items/${collectionId}`
    );
    setItems(response.data?.[1]);
    setCollection(response.data?.[0]);
  };

  useEffect(() => {
    loadItems();
  }, []);

  console.log(collection);

  const rowSelection = {
    selectedRowKeys,
    // onChange: onSelectChange,
  };

  // const deleteUser = (id) => {
  //   let newUsers = [...users];

  //   id.forEach((currentId) => {
  //     axios.delete(
  //       `https://itransition-task4-server.herokuapp.com/api/remove/${currentId}`
  //     );
  //     newUsers = newUsers.filter((user) => user.id !== currentId);
  //   });
  //   setUsers(newUsers);
  //   id.forEach((userId) => {
  //     if (userId === currentUserId) {
  //       navigate("/");
  //     }
  //   });
  // };

  return (
    <PageLayout>
      <Title level={2}>{collection.name}</Title>
      <Title level={5}>{t("theme") + ": " + collection.theme}</Title>
      <p>{collection.description}</p>
      <div style={{ textAlign: "start" }}>
        <Space size="small">
          <Button onClick={toggleOppenessAddItemPopup}>{t("addItem")}</Button>
          <DeleteOutlined style={{ fontSize: "20px" }} />
        </Space>
      </div>
      <div>
        <div
          style={{
            marginBottom: 25,
          }}
        ></div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          // dataSource={users.map((user) => ({ ...user, key: user.id }))}
        />
      </div>

      <ModalFrame
        isModalOpen={isAddItemPopupOpen}
        handleCancel={toggleOppenessAddItemPopup}
      >
        <div>{`8======3`}</div>
      </ModalFrame>
    </PageLayout>
  );
};

export default CollectionPage;
