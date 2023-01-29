import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./BackButton.module.scss";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.container}>
      <Button  onClick={goBack}>
        Назад
      </Button>
    </div>
  );
};

export default BackButton;
