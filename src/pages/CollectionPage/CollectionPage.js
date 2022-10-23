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
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams, Link, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./CollectionPage.module.scss";
import PageLayout from "../../components/PageLayout";
import { ModalFrame } from "../../components/ModalFrame.js/ModalFrame";
import { BACKEND_URL } from "../../shared/constants";

const CollectionPage = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [collection, setCollection] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const { t } = useTranslation();
  const { collectionId } = useParams();
  const user = useSelector((state) => state.login);

  const tags = useSelector(({ home }) =>
    home.tags?.map((tag) => ({ label: tag.name, value: tag.name }))
  );
  
  const isUserPage = +collection.UserId === user.id || user.access === "admin";
  console.log("isUserPage", isUserPage);
  console.log("collection.UserId", +collection.UserId);
  console.log("collection.UserId", +collection.UserId);

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
    console.log("values: ", values);
    axios
      .post(`${BACKEND_URL}/items`, {
        name,
        tags: values?.tags?.map((current) => current.tag) ?? [],
        CollectionId: collectionId,
      })
      .then((response) => {
        if (response.status === 200) {
          loadItems();
          form.resetFields();
          setIsAddItemPopupOpen(false);
        }
      });
  };

  const onEditItem = (item) => {
    // const { name, description, theme, image, id } = item;
    // navigate(`/collection/${id}/update`, {
    //   state: {
    //     name,
    //     description,
    //     theme,
    //     image,
    //   },
    // });
  };

  // const onChangeTags = () => {
  //   const fields = form.getFieldsValue();
  //   const newTags = [];
  //   fields.tags?.map((item) => newTags.push(item.tag));
  //   setTags(newTags);
  // };
  // console.log(tags);


  return (
    <PageLayout>
      <Title level={2}>{collection.name}</Title>
      <Title level={5}>{t("theme") + ": " + collection.theme}</Title>
      <p>{collection.description}</p>
      {isUserPage && (<div className={styles.bar}>
        <Space size="small">
          <Button onClick={toggleOppenessAddItemPopup}>{t("addItem")}</Button>
          <Button onClick={() => onEditItem(selectedRowKeys)}>
            {t("updateItem")}
          </Button>
          <DeleteOutlined
            className={styles.icon}
            onClick={() => onDeleteItem(selectedRowKeys)}
          />
        </Space>
      </div>)  }
      <div>
        <div className={styles.table}></div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items.map((item) => ({ ...item, key: item.id }))}
        />
      </div>

      <ModalFrame
        isModalOpen={isAddItemPopupOpen}
        handleCancel={toggleOppenessAddItemPopup}
        title={t("addItem")}
        cancelText={t("cancel")}
      >
        <div>
          <Form
            form={form}
            layout="vertical"
            labelAlign="right"
            size="large"
            name="register"
            className={styles.form}
            onFinish={onAddItem}
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
                {t("addItem")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ModalFrame>
    </PageLayout>
  );
};

export default CollectionPage;
