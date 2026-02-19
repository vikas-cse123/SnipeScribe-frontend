import { useState } from "react";
import logo from "../assets/logo.png";
import { validateSchema } from "../utils/validateSchema";
import { loginSchema } from "../schemas/auth.schema";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import "./Login.css"
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    if (isLoggingIn) return;
    e.preventDefault();
    const { success, error, data } = validateSchema(loginSchema, {
      ...formData,
      isRememberMe: isChecked,
    });
    console.log({ success, error, data });
    if (!success) {
      return setErrors(error);
    }
    setIsLoggingIn(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.message);
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      navigator.onLine
        ? toast.error("Login failed. Please try again later.")
        : toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-wrapper">
            <img src={logo} alt="logo" />
          </div>
          <h2>Log in to your account</h2>
          <p>Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            {/* {errors.email && <p className="error-text">{errors.email}</p>} */}
            <p className="error-text">
  {errors.email || ""}
</p>

          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <IoEye /> : <IoEyeOff />}
              </button>
            </div>

            {/* {errors.password && <p className="error-text">{errors.password}</p>} */}
            <p className="error-text">
  {errors.password || ""}
</p>

          </div>

          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="bottom-text">
          Don't have an account? <Link to="/signup">Sign Up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
