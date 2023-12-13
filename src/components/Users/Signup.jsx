import { Link } from "react-router-dom";
import Modal from "../UI/Modal";

const Signup = () => {
  return (
    <Modal>
      <p>회원가입 페이지</p>
      <Link to="/login">로그인 하러가기</Link>
    </Modal>
  );
};

export default Signup;
