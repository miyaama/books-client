import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import clsx from "clsx";
import { useSelector } from "react-redux";
import axios from "axios";

import styles from "./Like.module.scss";
import HeartIcon from "../../../../components/Icon/HeartIcon";
import { BACKEND_URL } from "../../../../shared/constants";

const Like = ({ record, bookId }) => {
  const [likes, setLikes] = useState([]);
  const user = useSelector((state) => state.login);
  const isItemLikedByUser = likes?.includes(user.id);
  const isLogin = user.isLogin;

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
          const newLikes = likes?.filter((id) => id !== user.id);
          setLikes(newLikes);
        });
    }
  };

  useEffect(() => {
    setLikes(record?.Likes?.map((like) => like.UserId));
  }, [record]);

  return (
    <Col span={4}>
      <Row justify="end" gutter={[8, 8]}>
        <Col>
          {isLogin ? (
            <HeartIcon
              onClick={onLikeBook}
              className={clsx(styles.like, isItemLikedByUser && styles.onLike)}
            />
          ) : (
            <HeartIcon
              className={clsx(styles.like, isItemLikedByUser && styles.onLike)}
            />
          )}
        </Col>
        <Col>
          <p className={styles.text}>{likes?.length}</p>
        </Col>
      </Row>
    </Col>
  );
};

export default Like;
