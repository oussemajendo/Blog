import "./form.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getResetPassword, resetPassword } from "../../redux/apiCalls/passwordApiCall";


const ResetPassword = () => {
  const dispatch = useDispatch();
  const { isError } = useSelector(state => state.password)
  const [password, setPassword] = useState("");

  const {userId,token} = useParams();
  useEffect(()=>{
        dispatch(getResetPassword(userId,token))
  },[userId,token])

  // From Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (password.trim() === "") return toast.error("Password is required");

     dispatch(resetPassword(password,{userId,token}));
  };

  return (
    <section className="form-container">
      {isError ? <h1>Not Found</h1>:
      <>
           <h1 className="form-title">Reset Password</h1>
      <form onSubmit={formSubmitHandler} className="form">
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            id="password"
            placeholder="Enter your new password"
            className="form-input"
          />
        </div>
        <button type="submit" className="form-btn">
          Submit
        </button>
      </form>
      </>
      }
      
    </section>
  );
};

export default ResetPassword;
