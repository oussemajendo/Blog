import { postActions } from "../slices/postSlice";
import { commentActions } from "../slices/commentSlice";
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
              await request.delete(`/api/comments/${CommentId}`,{
                headers : {
                    Authorization : "Bearer " + getstate().auth.user.token,
                }
             });
               dispatch(commentActions.deleteComment(CommentId))
               dispatch(postActions.deletCommentFromPost(CommentId));
          }catch(error){
           toast.error(error.response.data.message);
          }
    }
}
//Fetch All comments
export function fetchAllComments(){
    return async (dispatch,getstate) => {
          try{            
              const { data} = await request.get(`/api/comments/`,{
                headers : {
                    Authorization : "Bearer " + getstate().auth.user.token,
                }
             });
               dispatch(commentActions.setComments(data))
          }catch(error){
           toast.error(error.response.data.message);
          }
    }
}