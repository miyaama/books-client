import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { login } from "../../store/slices";
import styles from "./LoginPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { IS_LOGIN_LOCAL_STORAGE } from "../../shared/constants/localStorageKeys";
import { BACKEND_URL } from "../../shared/constants";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onLogin = () => {
    axios
      .post(`${BACKEND_URL}/users/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.message) {
          setError(response.data.message);
          setTimeout(() => {
            setError("");
          }, 3000);
        } else if (response.data.status === "blocked") {
          setError(t("errorBloked"));
          setTimeout(() => {
            setError("");
          }, 3000);
        } else if (response.status === 200) {
          localStorage.setItem(
            IS_LOGIN_LOCAL_STORAGE,
            JSON.stringify({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
              access: response.data.access,
              isLogin: true,
            })
          );

          dispatch(
            login({
              id: response.data.id,
              username: response.data.username,
              email: email,
              access: response.data.access,
              isLogin: true,
            })
          );

          navigate("/");
        }
      });
  };

  return (
    <PageLayout noScroll>
      <div className={styles.container}>
        <Form
          name="normal_login"
          size="large"
          className={styles.form}
          initialValues={{
            remember: true,
          }}
          onFinish={onLogin}
        >
          <Title level={4}>{t("login")}</Title>
          <Form.Item
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: t("errorEmail"),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: t("errorPassword"),
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={t("password")}
            />
          </Form.Item>
          {error && <Text type="danger">{error} </Text>}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
            >
              {t("login")}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/authorization">{t("registerNow")}</Link>
          </Form.Item>
        </Form>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
