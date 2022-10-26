import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Form, Input, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import styles from "./AddCollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { BACKEND_URL } from "../../shared/constants";

const { Title } = Typography;

const AddCollectionPage = () => {
  const location = useLocation();
  const { state } = location;

  const [name, setName] = useState(state?.name || "");
  const [description, setDescription] = useState(state?.description || "");
  const [theme, setTheme] = useState(state?.theme || "");
  const [image, setImage] = useState(state?.image || "");
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.login);

  const currentUserId = state ? state.UserId : id;
  const isUserPage = +currentUserId === user.id || user.access === "admin";

  useEffect(() => {
    if (!isUserPage) {
      navigate("/");
    }
  }, [isUserPage, navigate]);

  if (!isUserPage) {
    return null;
  }

  const onAddCollection = () => {
    axios
      .post(`${BACKEND_URL}/collections`, {
        name,
        description,
        image,
        theme,
        UserId: id,
      })
      .then((response) => {
        if (response.status === 200) {
          const createdCollectionId = response.data.id;
          navigate(`/collection/${createdCollectionId}`);
        }
      });
  };

  const onUpdateCollection = () => {
    axios
      .put(`${BACKEND_URL}/collections/update/${id}`, {
        name,
        description,
        image,
        theme,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate(`/collection/${id}`);
        }
      });
  };

  const onFinish = state ? onUpdateCollection : onAddCollection;

  return (
    <PageLayout>
      <Title level={2}>
        {state ? t("editCollection") : t("createСollection")}
      </Title>
      <Form
        form={form}
        layout="vertical"
        labelAlign="right"
        size="large"
        name="addCollection"
        onFinish={onFinish}
        className={styles.form}
        initialValues={{ name, description, theme }}
      >
        <Form.Item
          name="name"
          label={t("title")}
          onChange={(e) => {
            setName(e.target.value);
          }}
          rules={[
            {
              required: true,
              message: t("errorTitle"),
            },
          ]}
        >
          <Input value={name} />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("description")}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={t("theme")}>
          <Select
            onChange={(value) => {
              setTheme(value);
            }}
          >
            <Select.Option value="history">{t("history")}</Select.Option>
            <Select.Option value="nonfiction">{t("nonfiction")}</Select.Option>
            <Select.Option value="fiction">{t("fiction")}</Select.Option>
            <Select.Option value="20thCentury">
              {t("20thCentury")}
            </Select.Option>
            <Select.Option value="19thCentury">
              {t("19thCentury")}
            </Select.Option>
            <Select.Option value="modern">{t("modern")}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="image"
          label={t("cover")}
          valuePropName="fileList"
          // getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>{t("upload")}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.authorizationButton}
          >
            {state ? t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
};

export default AddCollectionPage;
