import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <p>회원가입 페이지</p>
      <Link to="/login">로그인 하러가기</Link>
    </>
  );
};

export default Signup;
