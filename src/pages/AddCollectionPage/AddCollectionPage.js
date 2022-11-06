import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Button, Form, Input, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import PageLayout from "../../components/PageLayout";
import { BACKEND_URL, HOME } from "../../shared/constants";
import { fetchCollections } from "../../store/slices";

const { Title } = Typography;

const AddCollectionPage = () => {
  const location = useLocation();
  const { state } = location;

  const [name, setName] = useState(state?.name || "");
  const [description, setDescription] = useState(state?.description || "");
  const [theme, setTheme] = useState(state?.theme || "");
  const [itemTypes, setItemTypes] = useState(state?.itemTypes || "");
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.login);
  const largeCollections = useSelector((state) => state.home.collections);
  const dispatch = useDispatch();

  const currentUserId = state ? state.UserId : id;
  const isUserPage = +currentUserId === user.id || user.access === "admin";
  const isCollectionTheLargest = largeCollections.filter(
    (collection) => collection.id == id
  );

  useEffect(() => {
    if (!isUserPage) {
      navigate(HOME);
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
        theme,
        itemTypes,
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
        theme,
        itemTypes,
      })
      .then((response) => {
        if (response.status === 200) {
          isCollectionTheLargest && dispatch(fetchCollections());
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
        initialValues={{ name, description, theme, itemTypes }}
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
        <Form.Item name="theme" label={t("theme")}>
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
          name="itemTypes"
          label={t("field")}
          onChange={(e) => {
            setItemTypes(e.target.value);
          }}
        >
          <Input value={itemTypes} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {state ? t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </PageLayout>
  );
};

export default AddCollectionPage;
