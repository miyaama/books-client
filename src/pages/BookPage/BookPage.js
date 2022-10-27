import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Icon from "@ant-design/icons";
import { Avatar, Typography, Card, Comment, Tag, Row, Col } from "antd";
import moment from "moment";
import axios from "axios";
import clsx from "clsx";

import PageLayout from "../../components/PageLayout";
import Editor from "../../components/Editor";
import CommentList from "../../components/CommentList";
import styles from "./BookPage.module.scss";
import { BACKEND_URL } from "../../shared/constants";

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

  const { bookId } = useParams();

  const { t } = useTranslation();

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
          userId: user.id,
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
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const HeartSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
    </svg>
  );
  const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

  const isItemLikedByUser = likes?.includes(user.id);

  return (
    <PageLayout>
      <Card>
        <Row gutter={[36, 24]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            xl={{ span: 12 }}
          >
            <Row align="middle" justify="space-between">
              <Col>
                <Title className={styles.title} level={2}>{`${t("title")}: ${
                  record.name
                }`}</Title>
              </Col>
              <Col>
                <Row align="middle" gutter={[8, 8]}>
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
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            xl={{ span: 12 }}
          >
            <>
              {comments.length > 0 && (
                <CommentList comments={comments} translation={t} />
              )}
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
          </Col>
        </Row>
      </Card>
    </PageLayout>
  );
};

export default BookPage;
