import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { DARK_THEME, HOME, IS_LOGIN_LOCAL_STORAGE, LOGIN } from "../../shared/constants";
import styles from "./AuthorizationPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { login } from "../../store/slices";
import { ACCESS_USER, BACKEND_URL } from "../../shared/constants";

const { Title } = Typography;

const AuthorizationPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [form] = Form.useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const register = () => {
    axios
      .post(`${BACKEND_URL}/users/register`, {
        email,
        password,
        username: userName,
      })
      .then((response) => {
        if (response.data.message) {
          setError(response.data.message);
          setTimeout(() => {
            setError("");
          }, 5000);
        } else if (response.status === 200) {
          const id = response.data.id;

          localStorage.setItem(
            IS_LOGIN_LOCAL_STORAGE,
            JSON.stringify({
              id: response.data.id,
              username: userName,
              email: email,
              access: ACCESS_USER,
              isLogin: true,
            })
          );
          dispatch(
            login({
              id: id,
              username: userName,
              email: email,
              isLogin: true,
              access: ACCESS_USER,
            })
          );
          navigate(HOME);
        }
      });
  };

  return (
    <PageLayout noScroll>
      <div
    
        className={isDarkMode === DARK_THEME ? styles.dark : styles.white}
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign="right"
          size="large"
          name="register"
          onFinish={register}
          className={styles.form}
        >
          <Title level={4}>{t("autorization")}</Title>
          <Form.Item
            name="email"
            label="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            rules={[
              {
                type: "email",
                message: t("errorValidEmail"),
              },
              {
                required: true,
                message: t("errorEmail"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          {error && <span>{error}</span>}
          <Form.Item
            name="password"
            label={t("password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: t("errorPassword"),
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="name"
            label={t("name")}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            rules={[
              {
                required: true,
                message: t("errorName"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.authorizationButton}
            >
              {t("autorization")}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to={LOGIN}>{t("alreadyHaveAccount")}</Link>
          </Form.Item>
        </Form>
      </div>
    </PageLayout>
  );
};

export default AuthorizationPage;
