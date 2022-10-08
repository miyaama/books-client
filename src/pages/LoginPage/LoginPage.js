import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import styles from "./LoginPage.module.scss"
import PageLayout from "../../components/PageLayout";
import { IS_LOGIN_LOCAL_STORAGE } from "../../shared/constants/localStorageKeys";

const { Title, Text } = Typography;


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const login = () => {
    axios
      .post("https://itransition-task4-server.herokuapp.com/api/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.message) {
          setError(response.data.message);
          setTimeout(() => {
            setError("");
          }, 3000);
        } else if (response.data[0].status === "blocked") {
          setError("Your account is blocked");
          setTimeout(() => {
            setError("");
          }, 3000);
        } else if (response.status === 200) {
          localStorage.setItem(
            IS_LOGIN_LOCAL_STORAGE,
            JSON.stringify({
              id: response.data[0].id,
              isLogin: true,
            })
          );
          navigate("/home");
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
          onFinish={login}
        >
          <Title level={4}>{t('login')}</Title>
          <Form.Item
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: "Please input your Email!",
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
                message: "Please input your Password!",
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
