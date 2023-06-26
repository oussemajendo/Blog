import "./Verify-Email.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyEmail } from "../../redux/apiCalls/authApiCall";

const VerifyEmail = () => {
        const dispatch = useDispatch();
        const { isEmailVerified } = useSelector(state => state.auth);
         
        const { userId,token } = useParams();

        useEffect(()=>{
            dispatch(verifyEmail(userId,token));
        },[userId,token]);

    return (  
        <div className="verify-email">
           {isEmailVerified ? 
           <> 
           <i className="bi bi-patch-check verify-email-icon"></i>
              <h1 className="verify-email-title">
                Your email address has been successfully verified
              </h1>
              <Link to="/login" className="verify-email-link">
                  Got to Login Page
              </Link>
           </> 
           : 
           <>
           <h1 className="verified-email-not-found">
                 Not found
           </h1>
           </>
           }
        </div>
    );
}
 
export default VerifyEmail;