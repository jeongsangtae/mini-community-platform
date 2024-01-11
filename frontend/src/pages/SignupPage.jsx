import { redirect } from "react-router-dom";
import Signup from "../components/Users/Signup";

const SignupPage = () => {
  return (
    <>
      <Signup />
    </>
  );
};

export default SignupPage;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const signupData = Object.fromEntries(formData);

  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("회원가입 성공");
      return redirect("/signup");
    } else {
      const errorData = await response.json();
      console.log("회원가입 실패", errorData.message);
    }
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
  }
};

export const loader = async () => {
  const response = await fetch("http://localhost:3000/signup");
  const resData = await response.json();
  return resData;
};
