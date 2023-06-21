import { postActions } from "../slices/postSlice";
import request from "../../utils/request";
import {toast} from "react-toastify"

//create comment
export function createComment(newComment){
    return async (dispatch,getstate) => {
          try{            
             const { data } = await request.post("/api/comments",newComment,{
                headers : {
                    Authorization : "Bearer " + getstate().auth.user.token,
                }
             });
               dispatch(postActions.addCommentToPost(data));
          }catch(error){
           toast.error(error.response.data.message);
          }
    }
}

//Updtae comment
export function updateComment(CommentId,comment){
    return async (dispatch,getstate) => {
          try{            
             const { data } = await request.put(`/api/comments/${CommentId}`,comment,{
                headers : {
                    Authorization : "Bearer " + getstate().auth.user.token,
                }
             });
               dispatch(postActions.updateCommentPost(data));
          }catch(error){
           toast.error(error.response.data.message);
          }
    }
}

//Delete comment
export function deleteComment(CommentId){
    return async (dispatch,getstate) => {
          try{            
             const { data } = await request.delete(`/api/comments/${CommentId}`,{
                headers : {
                    Authorization : "Bearer " + getstate().auth.user.token,
                }
             });
               dispatch(postActions.deletCommentFromPost(data));
          }catch(error){
            console.log(error)
           toast.error(error.response.data.message);
          }
    }
}