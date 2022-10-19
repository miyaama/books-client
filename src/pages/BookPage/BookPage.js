import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HeartOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
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

import PageLayout from "../../components/PageLayout";
// import styles from "./BookPage.module.scss"

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

const Editor = ({ onChange, onSubmit, submitting, value }) => (
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
        {"addComment"}
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
  const [like, setLike] = useState("");
  const user = useSelector((state) => state.login);
  const navigate = useNavigate();
  const { bookId } = useParams();

  const { t } = useTranslation();

  const loadComments = async () => {
    const response = await axios.get(
      `http://localhost:5000/comments/${bookId}`
    );
    const comments = [];
    response.data.forEach((comment) => {
      comments.push({
        author: comment.username,
        avatar: `https://joeschmoe.io/api/v1/${comment.UserId}`,
        content: <p>{comment.comment}</p>,
        datetime: moment("2016-11-22").fromNow(),
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
    console.log("user.id", user.id);
    setTimeout(() => {
      axios
        .post("http://localhost:5000/comments", {
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
                datetime: moment("2016-11-22").fromNow(),
              },
            ]);
          }
        });
    }, 1000);
  };

  const onLikeBook = () => {
    axios.post("http://localhost:5000/likes", {
      ItemId: bookId,
      UserId: user.id,
    }).then((response) => {
      setLike(response.liked);
    })
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <PageLayout>
      <Card>
        <Title level={2}>{record.name}</Title>
        <Title level={5}>{t("tags")}</Title>
        <HeartOutlined onClick={onLikeBook} style={{ fontSize: "20px" }} />
        <p>{record.Likes.length}</p>
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
              />
            }
          />
        </>
      </Card>
    </PageLayout>
  );
};

export default BookPage;
