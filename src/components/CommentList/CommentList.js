import { List, Comment } from "antd";

const CommentList = ({ comments , translation}) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${
      comments.length > 1 ? translation("comments") : translation("comment")
    }`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

export default CommentList;
