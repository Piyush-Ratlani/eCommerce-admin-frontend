import React, { useState } from "react";
import "./AdminPortalLogin.css";
import SignIn from "./signin";

const AdminPortalLogin = () => {
  const [signupActive, setSignupActive] = useState(false);

  const handleSignupForm = () => {
    setSignupActive(!signupActive);
  };
  return (
    <div className="adminPageHomeMainContainer">
      <div className="adminLoginContainer">
        <SignIn handleSignupForm={handleSignupForm} />
      </div>
    </div>
  );
};
export default AdminPortalLogin;
