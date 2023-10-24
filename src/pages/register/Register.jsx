import { Link, useNavigate  } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import makeRequest from "../../axios"; 

const Register = () => {
  const navigator = useNavigate()

  const [inputs, setInputs] = useState({
    user_name: "",
    email: "",
    password: "",
    name: "",
  });

  
  const [error, setError] = useState(null);
const  handleChange =(e)=>{
  setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
  setError("")
}

const handleSubmit = async (e) => {
  e.preventDefault();

  try{
    const sentData = await makeRequest.post(
      "auth/register",
      inputs
    );
      toast.success("User created Successfully ");
      navigator("/login")
    
  }catch (error){
setError(error.response.data.error);
toast.success("something went wrong!");
  }
};

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>habesha chat.</h1>
          <p>
            Habsha Chat is a vibrant platform where people from diverse
            backgrounds come together to connect, communicate, and share their
            unique stories and experiences, fostering a global community of
            understanding and friendship.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="Username"
              name="user_name"
              onChange={handleChange}
            />
            <input
              required
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              required
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              required
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {error && error}
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
