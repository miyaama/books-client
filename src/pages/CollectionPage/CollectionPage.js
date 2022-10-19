import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Table, Space, Typography, Form, Input, Tag } from "antd";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";

import { ModalFrame } from "../../components/ModalFrame.js/ModalFrame";

const CollectionPage = () => {
  const [items, setItems] = useState([]);
  const [collection, setCollection] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);

  const [name, setName] = useState("");

  const { t } = useTranslation();

  const { collectionId } = useParams();
  const [form] = Form.useForm();

  const { Title } = Typography;

  const [selected, setSelected] = useState([]);

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
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Jim",
          value: "Jim",
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

  const toggleOppenessAddItemPopup = () =>
    setIsAddItemPopupOpen((value) => !value);

  const loadItems = async () => {
    const response = await axios.get(
      `http://localhost:5000/items/bycollection/${collectionId}`
    );
    setItems(response.data?.items);
    setCollection(response.data?.collection[0]);
  };

  useEffect(() => {
    loadItems();
  }, []);
  console.log("items", items[0])

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
      axios.delete(`http://localhost:5000/items/${currentId}`);
      newItems = newItems.filter((user) => user.id !== currentId);
    });
    setItems(newItems);
  };

  const onAddItem = () => {
    axios
      .post("http://localhost:5000/items", {
        name,
        CollectionId: collectionId,
      })
      .then((response) => {
        if (response.status === 200) {
          loadItems();
          setIsAddItemPopupOpen(false);
        }
      });
  };

  const onEditItem = (item) => {
    const { name, description, theme, image, id } = item;
    // navigate(`/collection/${id}/update`, {
    //   state: {
    //     name,
    //     description,
    //     theme,
    //     image,
    //   },
    // });
  };

  return (
    <PageLayout>
      <Title level={2}>{collection.name}</Title>
      <Title level={5}>{t("theme") + ": " + collection.theme}</Title>
      <p>{collection.description}</p>
      <div style={{ textAlign: "start" }}>
        <Space size="small">
          <Button onClick={toggleOppenessAddItemPopup}>{t("addItem")}</Button>
          <Button onClick={() => onEditItem(selectedRowKeys)}>
            {t("updateItem")}
          </Button>
          <DeleteOutlined
            style={{ fontSize: "20px" }}
            onClick={() => onDeleteItem(selectedRowKeys)}
          />
        </Space>
      </div>
      <div>
        <div
          style={{
            marginBottom: 25,
          }}
        ></div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items.map((item) => ({ ...item, key: item.id }))}
        />
      </div>

      <ModalFrame
        isModalOpen={isAddItemPopupOpen}
        handleCancel={toggleOppenessAddItemPopup}
        handleOk={onAddItem}
        title={t("addItem")}
      >
        <div>
          <Form
            form={form}
            layout="vertical"
            labelAlign="right"
            size="large"
            name="register"
            className={styles.form}
            id="category-editor-form"
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
              <Input />
            </Form.Item>
          </Form>
        </div>
      </ModalFrame>
    </PageLayout>
  );
};

export default CollectionPage;
