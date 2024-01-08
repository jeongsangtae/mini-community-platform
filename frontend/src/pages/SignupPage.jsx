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

  await fetch("http://localhost:3000/singup", {
    method: "POST",
    body: JSON.stringify(signupData),
    headers: { "Content-Type": "application/json" },
  });

  console.log(formData);

  return redirect("/singup");
};
