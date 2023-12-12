import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <p>로그인 페이지</p>
      <Link to="/signup">회원가입 하러가기</Link>
    </>
  );
};

export default Login;
