import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Space, Typography } from "antd";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import PageLayout from "../../components/PageLayout";
import styles from "./AdminPage.module.scss";
import { IS_LOGIN_LOCAL_STORAGE } from "../../shared/constants/localStorageKeys";
import { actionAddAdmin, actionRemoveAdmin, logout } from "../../store/slices";
import { ACCESS_ADMIN, ACCESS_USER, BACKEND_URL } from "../../shared/constants";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userData = JSON.parse(localStorage.getItem(IS_LOGIN_LOCAL_STORAGE));
  const currentUserId = userData?.id;
  const { Title } = Typography;


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
      title: t("status"),
      dataIndex: "status",
    },
    {
      title: t("access"),
      dataIndex: "access",
    },
  ];

  const loadUsers = async () => {
    const response = await axios.get(`${BACKEND_URL}/users`);
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const deleteUser = (id) => {
    let newUsers = [...users];

    id.forEach((currentId) => {
      axios.delete(`${BACKEND_URL}/users/${currentId}`);
      newUsers = newUsers.filter((user) => user.id !== currentId);
    });
    setUsers(newUsers);
    id.forEach((userId) => {
      if (userId === currentUserId) {
        navigate("/");
      }
    });
  };

  const unblockedUser = (id) => {
    let newUsers = [...users];

    id.forEach((currentId) => {
      newUsers = newUsers.map((user) => {
        let status = user.status;
        if (user.id === currentId) {
          status = "active";
        }
        return { ...user, status };
      });
      axios.put(`${BACKEND_URL}/users/update/${currentId}`, {
        status: "active",
        type: "status",
      });
    });

    setUsers(newUsers);
  };

  const blockedUser = (id) => {
    let newUsers = [...users];
    id.forEach((currentId) => {
      axios.put(`${BACKEND_URL}/users/update/${currentId}`, {
        status: "blocked",
        type: "status",
      });
      newUsers = newUsers.map((user) => {
        let status = user.status;
        if (user.id === currentId) {
          status = "blocked";
        }
        return { ...user, status };
      });
    });
    setUsers(newUsers);
    id.forEach((userId) => {
      if (userId === currentUserId) {
        dispatch(logout());
        navigate("/");
      }
    });
  };

  const addAdmin = (id) => {
    let newUsers = [...users];

    id.forEach((currentId) => {
      newUsers = newUsers.map((user) => {
        let access = user.access;
        if (user.id === currentId) {
          access = "admin";
        }
        return { ...user, access };
      });
      axios.put(`${BACKEND_URL}/users/update/${currentId}`, {
        status: "admin",
        type: "access",
      });
    });

    setUsers(newUsers);
    id.forEach((userId) => {
      if (userId === currentUserId) {
        dispatch(actionAddAdmin());
        localStorage.setItem(
          IS_LOGIN_LOCAL_STORAGE,
          JSON.stringify({ ...userData, access: ACCESS_ADMIN })
        );
      }
    });
  };

  const removeAdmin = (id) => {
    let newUsers = [...users];

    id.forEach((currentId) => {
      newUsers = newUsers.map((user) => {
        let access = user.access;
        if (user.id === currentId) {
          access = "user";
        }
        return { ...user, access };
      });
      axios.put(`${BACKEND_URL}/users/update/${currentId}`, {
        status: "user",
        type: "access",
      });
    });

    setUsers(newUsers);
    id.forEach((userId) => {
      if (userId === currentUserId) {
        dispatch(actionRemoveAdmin());
        localStorage.setItem(
          IS_LOGIN_LOCAL_STORAGE,
          JSON.stringify({ ...userData, access: ACCESS_USER })
        );
      }
    });
  };

  return (
    <PageLayout>
      <div>
        <Title level={2} className={styles.title}>
          {t("usersList")}
        </Title>
        <div style={{ textAlign: "start" }}>
          <Space size="small">
            <Button onClick={() => addAdmin(selectedRowKeys)}>
              {t("addAdmin")}
            </Button>
            <Button onClick={() => removeAdmin(selectedRowKeys)}>
              {t("removeAdmin")}
            </Button>
            <Button onClick={() => blockedUser(selectedRowKeys)}>
              {t("blockUser")}
            </Button>
            <UnlockOutlined
              onClick={() => unblockedUser(selectedRowKeys)}
              className={styles.icon}
            />
            <DeleteOutlined
              onClick={() => deleteUser(selectedRowKeys)}
              className={styles.icon}
            />
          </Space>
        </div>
        <div>
          <div className={styles.table}></div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={users.map((user) => ({ ...user, key: user.id }))}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
