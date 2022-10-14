import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Form, Input, Upload, Select } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./AddCollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";

const { Title } = Typography;

const AddCollectionPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const user = useSelector((state) => state.login);
  const isUserPage = +id === user.id || user.access === "admin";

  const onAddCollection = () => {};

  return (
    <PageLayout>
      <Title level={4}>{t("createСollection")}</Title>
      <Form
        form={form}
        layout="vertical"
        // labelAlign="right"
        size="large"
        name="addCollection"
        onFinish={onAddCollection}
        className={styles.form}
      >
        <Form.Item
          name="name"
          label={t("name")}
          onChange={(e) => {
            setName(e.target.value);
          }}
          rules={[
            {
              required: true,
              message: "Please input Name",
            },
          ]}
        >
          <Input />
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
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="upload"
          label={t("image")}
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
            {t("create")}
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
};

export default AddCollectionPage;
