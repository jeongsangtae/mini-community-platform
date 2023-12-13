import { Link } from "react-router-dom";
import Modal from "../UI/Modal";

const Login = () => {
  return (
    <Modal>
      <p>로그인 페이지</p>
      <Link to="/signup">회원가입 하러가기</Link>
    </Modal>
  );
};

export default Login;
