import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <Button type="button" onClick={goBack}>
      Назад
    </Button>
  );
};

export default BackButton;
