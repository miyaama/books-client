import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Avatar, Typography, Card, Comment, Tag, Row, Col, Button } from "antd";
import moment from "moment";
import axios from "axios";
import clsx from "clsx";

import PageLayout from "../../components/PageLayout";
import Editor from "../../components/Editor";
import CommentList from "../../components/CommentList";
import styles from "./BookPage.module.scss";
import { BACKEND_URL } from "../../shared/constants";
import HeartIcon from "../../components/Icon/HeartIcon";

const { Title } = Typography;

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
  const isLogin = user.isLogin;

  const { bookId } = useParams();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const loadComments = async () => {
    const response = await axios.get(`${BACKEND_URL}/comments/${bookId}`);
    const comments = [];
    response.data.forEach((comment) => {
      comments.push({
        author: comment.username,
        avatar: `https://joeschmoe.io/api/v1/${comment.userId}`,
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
          useri: user.id,
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
    if (isLogin) {
      axios
        .post(`${BACKEND_URL}/likes`, {
          ItemId: bookId,
          UserId: String(user.id),
        })
        .then((response) => {
          if (response.data.liked === true) {
            setLikes([...likes, user.id]);
            return;
          }
          const newLikes = likes.filter((id) => id !== user.id);
          setLikes(newLikes);
        });
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const isItemLikedByUser = likes?.includes(user.id);

  return (
    <PageLayout>
      <Button type="button" onClick={goBack}>
        Назад
      </Button>
      <Card>
        <Row align="middle" justify="space-between">
          <Col span={20}>
            <Title className={styles.title} level={2}>{`${t("title")}: ${
              record.name
            }`}</Title>
          </Col>
          <Col span={4}>
            <Row justify="end" gutter={[8, 8]}>
              <Col>
                <HeartIcon
                  onClick={onLikeBook}
                  className={clsx(
                    styles.like,
                    isItemLikedByUser && styles.onLike
                  )}
                />
              </Col>
              <Col>
                <p className={styles.text}>{likes?.length}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className={styles.tags}>
          <Title level={5} className={styles.tagTitle}>
            {t("tagsOnPage")}
          </Title>
          {record.tags?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            return (
              <Tag key={tag} color={color}>
                {tag}
              </Tag>
            );
          })}
        </div>
        {record.itemTypes ? (
          <Title level={5}>{`${record.itemTypes}: ${record.field || ""}`}</Title>
        ) : (
          ""
        )}
        <>
          {comments.length > 0 && (
            <CommentList comments={comments} translation={t} />
          )}
          {isLogin && (
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
          )}
        </>
      </Card>
    </PageLayout>
  );
};

export default BookPage;
