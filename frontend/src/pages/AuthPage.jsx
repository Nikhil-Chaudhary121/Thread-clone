import React from "react";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/AuthAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
