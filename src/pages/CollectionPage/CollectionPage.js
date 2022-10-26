import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Space,
  Typography,
  Form,
  Input,
  Tag,
  AutoComplete,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { ModalFrame } from "../../components/ModalFrame.js/ModalFrame";
import { BACKEND_URL } from "../../shared/constants";
import { addItem } from "../../store/slices";

const ADD_ITEM_POPUP_TYPE = "ADD_ITEM_POPUP_TYPE";
const UPDATE_ITEM_POPUP_TYPE = "UPDATE_ITEM_POPUP_TYPE";

const CollectionPage = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [collection, setCollection] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openPopupType, setOpenPopupType] = useState(null);
  const { t } = useTranslation();
  const { collectionId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  const tags = useSelector(({ home }) =>
    home.tags?.map((tag) => ({ label: tag.name, value: tag.name }))
  );

  const isUserPage = +collection.UserId === user.id || user.access === "admin";

  const { Title } = Typography;

  const columns = [
    {
      title: t("title"),
      dataIndex: "name",
      render: (text, record) => (
        <Link state={{ record }} to={`/book/${record.id}`}>
          {text}
        </Link>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: t("image"),
      dataIndex: "image",
    },
    {
      title: t("tags"),
      dataIndex: "tags",
      filters: [
        {
          text: t("classic"),
          value: t("classic"),
        },
        {
          text: t("novel"),
          value: t("novel"),
        },
        {
          text: t("detective"),
          value: t("detective"),
        },

      ],
      onFilter: (value, record) => record.tags.indexOf(value) === 0,
      render: (_, { tags }) => (
        <>
          {tags?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const openAddItemPopup = () => setOpenPopupType(ADD_ITEM_POPUP_TYPE);
  const openUpdateItemPopup = () => {
    const item = items.filter(
      (element) => element.id === selectedRowKeys[0]
    )[0];
    form.setFieldValue(
      "tags",
      item.tags.map((tag) => ({ tag }))
    );
    form.setFieldValue("name", item.name);
    setOpenPopupType(UPDATE_ITEM_POPUP_TYPE);
  };
  const closePopup = () => setOpenPopupType(null);

  const loadItems = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/items/bycollection/${collectionId}`
    );
    setItems(response.data?.items);
    setCollection(response.data?.collection[0]);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onDeleteItem = (id) => {
    let newItems = [...items];

    id.forEach((currentId) => {
      axios.delete(`${BACKEND_URL}/items/${currentId}`);
      newItems = newItems.filter((user) => user.id !== currentId);
    });
    setItems(newItems);
  };

  const onAddItem = (values) => {
    axios
      .post(`${BACKEND_URL}/items`, {
        name: values.name,
        tags: values?.tags?.map((current) => current.tag) ?? [],
        CollectionId: collectionId,
      })
      .then((response) => {
        if (response.status === 200) {
          loadItems();
          dispatch(
            addItem({
              ...response.data,
              userName: user.username,
              collectionName: collection.name,
              CollectionId: +response.data.CollectionId,
            })
          );
          form.resetFields();
          closePopup();
        }
      });
  };

  const onEditItem = (values) => {
    axios
      .put(`${BACKEND_URL}/items/update/${selectedRowKeys[0]}`, {
        name: values.name,
        tags: values?.tags?.map((current) => current.tag) ?? [],
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          loadItems();
          form.resetFields();
          closePopup();
        }
      });
  };

  // const onChangeTags = () => {
  //   const fields = form.getFieldsValue();
  //   const newTags = [];
  //   fields.tags?.map((item) => newTags.push(item.tag));
  //   setTags(newTags);
  // };
  // console.log(tags);

  const isOpenAddItemPopup = openPopupType === ADD_ITEM_POPUP_TYPE;

  return (
    <PageLayout>
      <Title level={2}>{collection.name}</Title>
      <Title level={5}>{t("theme") + ": " + t(`${collection.theme}`)}</Title>
      <p>{collection.description}</p>
      {isUserPage && (
        <Row className={styles.bar} gutter={8} align="middle">
          <Col>
            <Button onClick={openAddItemPopup}>{t("addItem")}</Button>
          </Col>
          <Col>
            <Button onClick={openUpdateItemPopup}>{t("updateItem")}</Button>
          </Col>
          <Col>
            <DeleteOutlined
              className={styles.icon}
              onClick={() => onDeleteItem(selectedRowKeys)}
            />
          </Col>
        </Row>
      )}
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items.map((item) => ({ ...item, key: item.id }))}
        />
      </div>

      <ModalFrame
        isModalOpen={!!openPopupType}
        handleCancel={closePopup}
        title={isOpenAddItemPopup ? t("addItem") : t("updateItem")}
      >
        <div>
          <Form
            form={form}
            layout="vertical"
            labelAlign="right"
            size="large"
            name="register"
            className={styles.form}
            onFinish={isOpenAddItemPopup ? onAddItem : onEditItem}
            id="category-editor-form"
          >
            <Form.Item
              name="name"
              label={t("title")}
              rules={[
                {
                  required: true,
                  message: t("errorTitle"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.List name="tags">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className={styles.space} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "tag"]}
                        rules={[
                          {
                            required: true,
                            message: t("InputTag"),
                          },
                        ]}
                      >
                        <AutoComplete
                          name={[name, "tag"]}
                          filterOption
                          options={tags}
                          className={styles.autoComplete}
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      {t("AddTags")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isOpenAddItemPopup ? t("addItem") : t("updateItem")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ModalFrame>
    </PageLayout>
  );
};

export default CollectionPage;
