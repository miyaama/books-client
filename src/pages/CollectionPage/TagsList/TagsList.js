import { Button, Space, Form, AutoComplete } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import styles from "./TagsList.module.scss";

const TagsList = () => {
  const { t } = useTranslation();

  const tags = useSelector(({ home }) =>
    home.tags?.map((tag) => ({ label: tag.name, value: tag.name }))
  );

  return (
    <Form.List name="tags">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} className={styles.space} align="baseline">
              <Form.Item
                {...restField}
                name={[name, "tag"]}
                label={t("tag")}
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
  );
};

export default TagsList;
