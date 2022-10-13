import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Space } from "antd";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";

const CollectionPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // const currentUserId = userData?.id;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: t("name"),
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: t("registrationDate"),
      dataIndex: "registration",
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

  // const loadUsers = async () => {
  //   const response = await axios.get(
  //     "https://itransition-task4-server.herokuapp.com/api/get"
  //   );
  //   setUsers(response.data);
  // };

  // useEffect(() => {
  //   loadUsers();
  // }, []);

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
      {" "}
      <div style={{ padding: "30px" }}>
        <h1 style={{ padding: "15px", textAlign: "center" }}>
          {t("usersList")}
        </h1>
        <div style={{ textAlign: "start" }}>
          <Space size="small">
            <Button>{t("blockUser")}</Button>

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
            dataSource={users.map((user) => ({ ...user, key: user.id }))}
          />
        </div>
      </div>{" "}
    </PageLayout>
  );
};

export default CollectionPage;
