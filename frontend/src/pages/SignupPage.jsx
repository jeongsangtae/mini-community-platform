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

  await fetch("http://localhost:3000/signup", {
    method: "POST",
    body: JSON.stringify(signupData),
    headers: { "Content-Type": "application/json" },
  });

  console.log(signupData);

  return redirect("/signup-success");
};

export const loader = async () => {
  const response = await fetch("http://localhost:3000/signup");
  const resData = await response.json();
  return resData;
};
