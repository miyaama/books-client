import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HeartOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Typography,
  Card,
  List,
  Comment,
} from "antd";
import moment from "moment";
import axios from "axios";
import clsx from "clsx";

import PageLayout from "../../components/PageLayout";
import styles from "./BookPage.module.scss"
import { BACKEND_URL } from "../../shared/constants";

const { TextArea } = Input;
const { Title } = Typography;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${
      comments.length > 1 ? "comments" : "comment"
    }`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value, localization }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        {localization("addComment")}
      </Button>
    </Form.Item>
  </>
);

const BookPage = () => {
  const location = useLocation();

  const { record } = location.state;

  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const [likes, setLikes] = useState(() => {
    return record.Likes?.map((like) => like.UserId);
  });


  const user = useSelector((state) => state.login);

  const { bookId } = useParams();

  const { t } = useTranslation();

  const loadComments = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/comments/${bookId}`
    );
    const comments = [];
    response.data.forEach((comment) => {
      comments.push({
        author: comment.username,
        avatar: `https://joeschmoe.io/api/v1/${comment.UserId}`,
        content: <p>{comment.comment}</p>,
        datetime: moment(comment.createdAt).fromNow(),
      });
    });
    setComments(comments);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSubmit = () => {
    if (!value) return;
    setSubmitting(true);
    setTimeout(() => {
      axios
        .post(`${BACKEND_URL}/comments`, {
          comment: value,
          ItemId: bookId,
          username: user.username,
          UserId: user.id,
        })
        .then((response) => {
          if (response.status === 200) {
            setSubmitting(false);
            setValue("");
            setComments([
              ...comments,
              {
                author: user.username,
                avatar: `https://joeschmoe.io/api/v1/${user.id}`,
                content: <p>{value}</p>,
                datetime: moment(new Date()).fromNow(),
              },
            ]);
          }
        });
    }, 1000);
  };

  const onLikeBook = () => {
    axios
      .post(`${BACKEND_URL}/likes`, {
        ItemId: bookId,
        UserId: user.id,
      })
      .then((response) => {
        if (response.data.liked === true) {
          setLikes([...likes, user.id]);
          return;
        }
        const newLikes = likes.filter((id) => id !== user.id);
        setLikes(newLikes);
      });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const isLikedByUser = likes?.includes(user.id);

  return (
    <PageLayout>
      <Card>
        <Title level={2}>{record.name}</Title>
        <Title level={5}>{t("tags") + record.tags}</Title>
        <HeartOutlined
          onClick={onLikeBook} 
          className={clsx(styles.like, isLikedByUser && styles.onLike )}
        />
        <p>{likes?.length}</p>
        <>
          {comments.length > 0 && <CommentList comments={comments} />}
          <Comment
            avatar={
              <Avatar
                src={`https://joeschmoe.io/api/v1/${user.id}`}
                alt="avatar"
              />
            }
            content={
              <Editor
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                value={value}
                localization={t}
              />
            }
          />
        </>
      </Card>
    </PageLayout>
  );
};

export default BookPage;
