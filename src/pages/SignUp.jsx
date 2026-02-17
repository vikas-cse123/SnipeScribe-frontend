import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { validateSchema } from "../utils/validateSchema";
import { signUpSchema } from "../schemas/auth.schema";
import { toast } from "sonner";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (key) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { success, error, data } = validateSchema(signUpSchema, formData);

    if (!success) {
      setErrors(error);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/pending`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 500) {
        toast.error(
          "We couldn’t create your account right now. Please try again."
        );
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const newErrors = {};
          result.errors.forEach(({ field, message }) => {
            newErrors[field] = message;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        } else {
          toast.error(result.message || "Something went wrong.");
        }
        return;
      }

      console.log("Redirect to OTP page");
    } catch (err) {
      toast.error(
        !navigator.onLine
          ? "You are offline. Check your internet connection."
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Welcome. Let’s get you started.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <p className={`error ${errors.name ? "visible" : ""}`}>
              {errors.name}
            </p>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <p className={`error ${errors.email ? "visible" : ""}`}>
              {errors.email}
            </p>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={passwordVisibility.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => togglePasswordVisibility("password")}
              >
                {passwordVisibility.password ? (
                  <IoEye size={20} />
                ) : (
                  <IoEyeOff size={20} />
                )}
              </button>
            </div>
            <p className={`error ${errors.password ? "visible" : ""}`}>
              {errors.password}
            </p>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={
                  passwordVisibility.confirmPassword ? "text" : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  togglePasswordVisibility("confirmPassword")
                }
              >
                {passwordVisibility.confirmPassword ? (
                  <IoEye size={20} />
                ) : (
                  <IoEyeOff size={20} />
                )}
              </button>
            </div>
            <p
              className={`error ${
                errors.confirmPassword ? "visible" : ""
              }`}
            >
              {errors.confirmPassword}
            </p>
          </div>

          <button className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
