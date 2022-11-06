import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Typography, Form, Input, Tag, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { ModalFrame } from "./ModalFrame";
import { BACKEND_URL } from "../../shared/constants";
import { addItem } from "../../store/slices";
import TagsList from "./TagsList/TagsList";

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
      title: t("tags"),
      dataIndex: "tags",
      filters: [
        {
          text: "2022",
          value: "2022",
        },
        {
          text: "2021",
          value: "2021",
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

  if (collection.itemTypes) {
    columns.push({
      title: collection.itemTypes,
      dataIndex: "field",
    });
  }

  const openAddItemPopup = () => setOpenPopupType(ADD_ITEM_POPUP_TYPE);

  const openUpdateItemPopup = () => {
    const item = items?.filter(
      (element) => element.id === selectedRowKeys[0]
    )[0];
    form.setFieldValue(
      "tags",
      item.tags?.map((tag) => ({ tag }))
    );
    form.setFieldValue("name", item.name);
    form.setFieldValue("field", item.field);
    setOpenPopupType(UPDATE_ITEM_POPUP_TYPE);
  };
  const closePopup = () => {
    form.resetFields();
    setOpenPopupType(null);
  };

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
        field: values.field,
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
          closePopup();
        }
      });
  };

  const onEditItem = (values) => {
    axios
      .put(`${BACKEND_URL}/items/update/${selectedRowKeys[0]}`, {
        name: values.name,
        tags: values?.tags?.map((current) => current.tag) ?? [],
        field: values.field,
      })
      .then((response) => {
        if (response.status === 200) {
          loadItems();

          closePopup();
        }
      });
  };

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
          dataSource={items.map((item) => ({
            ...item,
            key: item.id,
            itemTypes: collection.itemTypes,
          }))}
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
            {collection.itemTypes ? (
              <Form.Item name="field" label={collection.itemTypes}>
                <Input />
              </Form.Item>
            ) : null}
            <TagsList />
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
