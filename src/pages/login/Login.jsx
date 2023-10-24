import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [error, setError] = useState(""); // Add error state
  const { login, currentUser, err } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    user_name: "",
    password: "",
  });
  const navigator = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear the error state when input changes
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigator("/");
    } catch (error) {
      setError(err);
    }
  };
console.log(error);
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Habesha Chat.</h1>
          <p>
            "Bridging Cultures through Conversations, Connecting Communities,
            Where Peace Finds a Home."
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              name="user_name"
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
            {error.length > 0 && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
