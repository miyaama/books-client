import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Form, Input, Upload, Select } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import styles from "./AddCollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";


const { Title } = Typography;

const AddCollectionPage = (props) => {
  const location = useLocation();
  const { state } = location;

  const [name, setName] = useState(state?.name || "");
  const [description, setDescription] = useState(state?.description || "");
  const [theme, setTheme] = useState(state?.theme || "");
  const [image, setImage] = useState(state?.image || "");
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const user = useSelector((state) => state.login);
  const isUserPage = +id === user.id || user.access === "admin";

  const onAddCollection = () => {
    axios
      .post("http://localhost:5000/collections", {
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
      .put(`http://localhost:5000/collections/update/${id}`, {
        name,
        description,
        image,
        theme,
      })
      .then((response) => {
        console.log("response: ", response);
        if (response.status === 200) {
          navigate(`/collection/${id}`);
        }
      });
  };

  const onFinish = state ? onUpdateCollection : onAddCollection;

  return (
    <PageLayout>
      <Title level={2}>{ state ? t("editCollection") : t("createСollection")}</Title>
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
        {error && <span>{error}</span>}
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
            <Select.Option value={t("history")}>{t("history")}</Select.Option>
            <Select.Option value={t("fantasy")}>{t("fantasy")}</Select.Option>
            <Select.Option value={t("science-fiction")}>{t("science-fiction")}</Select.Option>
            <Select.Option value={t("Nonfiction")}>{t("Nonfiction ")}</Select.Option>
            <Select.Option value={t("Fiction")}>{t("Fiction ")}</Select.Option>
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
            {state ?t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
};

export default AddCollectionPage;
