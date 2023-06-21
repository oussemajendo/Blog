import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";
import request from "../../utils/request";
import {toast} from "react-toastify"

//Get User Profile
export function getUserProfile(userId){
    return async (dispatch) => {
          try{
               
      const {data} = await request.get(`/api/users/profile/${userId}`);

          dispatch(profileActions.setProfile(data));
          }catch(error){
           toast.error(error.response.data.message);
          }
    };
}
//Upload Profile Photo
export function uploadProfilePhoto(newphoto){
    return async (dispatch,getState) => {
          try{
            
      const { data } = await request
      .post(`/api/users/profile/profile-photo-upload`, newphoto , {
        headers : {
             Authorization : "Bearer " + getState().auth.user.token,
            "Content-Type" : "multipart/form-data"
        }
      });
      dispatch(profileActions.setProfilePhoto(data.profilePhoto));
      dispatch(authActions.setUserPhoto(data.profilePhoto));
      toast.success(data.message);    

        // Modify the user's local storage with the new photo

        const user = JSON.parse(localStorage.getItem("userInfo"));
        user.profilePhoto = data?.profilePhoto;
        localStorage.setItem("userInfo", JSON.stringify(user));
        

          }catch(error){
           toast.error(error.response.data.message);
           
          }
    }
};

//update Profile 
export function updateProfile(userId,profile){
  return async (dispatch,getState) => {
        try{
          
    const { data } = await request
    .put(`/api/users/profile/${userId}`, profile , {
      headers : {
           Authorization : "Bearer " + getState().auth.user.token,
                }
    });
    dispatch(profileActions.updateProfile(data));
    dispatch(authActions.setUsename(data.username));

      // Modify the user's local storage with the new username

      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.username = data?.username;
      localStorage.setItem("userInfo", JSON.stringify(user));
      

        }catch(error){
         toast.error(error.response.data.message);
         
        }
  }
}


