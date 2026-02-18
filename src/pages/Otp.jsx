import { Navigate, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import "./Otp.css";

const OTP_LENGTH = 6;
const Otp = () => {
  const navigate = useNavigate();
  const email = useLocation().state?.email;
  if (!email) {
    return <Navigate to="/signup" replace />;
  }
  const [isResendAllowed, setIsResendAllowed] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const intervalIdRef = useRef(null);

  const sendOtp = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.log(error);
      navigator.onLine
        ? toast.error("Failed to send OTP. Please try again later.")
        : toast.error("Network error. Please check your connection.");

      clearInterval(intervalIdRef.current);

      setIsResendAllowed(true);
      setTimer(30);
    }
  };

  const verifyOtp = async (otp) => {
    if (isVerifying) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        },
      );
      if (!response.ok) {
        clearOtp();
        return toast.error("Verification failed, Wrong OTP");
      }
      toast.success("Email verified successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    Ï;
    sendOtp();
  }, []);

  useEffect(() => {
    if (isResendAllowed) return;

    intervalIdRef.current = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [isResendAllowed]);

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalIdRef.current);
      setIsResendAllowed(true);
    }
  }, [timer]);

  const handleResendClick = () => {
    if (!isResendAllowed) return;
    sendOtp();
    setIsResendAllowed(false);
    setTimer(30);
  };

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Onl allow numbers
    if (!/^\d?$/.test(value)) return;

    e.target.value = value;

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }

    checkAndSubmit();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;

    pasted.split("").forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit;
      }
    });

    checkAndSubmit();
  };
  const clearOtp = () => {
    inputsRef.current.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });

    // Focus back to first box
    inputsRef.current[0]?.focus();
  };

  const checkAndSubmit = async () => {
    const otp = inputsRef.current.map((input) => input.value).join("");
    if (otp.length === OTP_LENGTH) {
      console.log("OTP:", otp);
      setIsVerifying(true);
      await verifyOtp(otp);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-header">
          <img src={logo} alt="Logo" className="otp-logo" />
          <h2>Verify OTP</h2>
          <p>
            Please enter the OTP sent to <span>{email}</span>
          </p>
        </div>

        <div className="otp-inputs" onPaste={handlePaste}>
          {[...Array(OTP_LENGTH)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isVerifying}
              autoComplete="one-time-code"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onBeforeInput={(e) => {
                if (!/^\d$/.test(e.data)) {
                  e.preventDefault();
                }
              }}
            />
          ))}
        </div>

        <div className="otp-footer">
          {!isResendAllowed ? (
            <p>Resend OTP in {timer}s</p>
          ) : (
            <>
              <p>Didn't receive a code?</p>
              <button onClick={handleResendClick} className="resend-btn">
                Resend
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otp;
