import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Avatar, Card, Comment } from "antd";
import moment from "moment";
import axios from "axios";

import PageLayout from "../../components/PageLayout";
import Editor from "./Editor";
import CommentList from "./CommentList";
import { BACKEND_URL, AVATAR_URL } from "../../shared/constants";

import BackButton from "./BackButton";
import BookHeader from "./BookHeader/BookHeader";

const BookPage = () => {
  const location = useLocation();

  const { record } = location.state;

  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const user = useSelector((state) => state.login);
  const isLogin = user.isLogin;

  const { bookId } = useParams();

  const { t } = useTranslation();

  const loadComments = async () => {
    const response = await axios.get(`${BACKEND_URL}/comments/${bookId}`);
    const comments = [];
    response.data.forEach((comment) => {
      comments.push({
        author: comment.username,
        avatar: `${AVATAR_URL}/${comment.userId}`,
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
              avatar: `${AVATAR_URL}/${user.id}`,
              content: <p>{value}</p>,
              datetime: moment(new Date()).fromNow(),
            },
          ]);
        }
      });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <PageLayout>
      <BackButton />
      <Card>
        <BookHeader record={record} bookId={bookId} />
        {comments.length > 0 && (
          <CommentList comments={comments} translation={t} />
        )}
        {isLogin && (
          <Comment
            avatar={<Avatar src={`${AVATAR_URL}/${user.id}`} alt="avatar" />}
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
      </Card>
    </PageLayout>
  );
};

export default BookPage;
