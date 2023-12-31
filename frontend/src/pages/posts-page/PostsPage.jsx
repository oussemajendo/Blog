import "./posts-page.css";
import { useEffect, useState } from "react";
import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination/Pagination";
import { fetchPosts,getPostsCount } from "../../redux/apiCalls/postApiCall";
import { useDispatch,useSelector } from "react-redux";

const POST_PER_PAGE = 3;
  
const PostsPage = () => {
  const dispatch = useDispatch();
  const { postsCount,posts } = useSelector(state => state.post);
  const pages = Math.ceil(postsCount / POST_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(fetchPosts(currentPage));
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    dispatch(getPostsCount());
  }, [currentPage,dispatch]);

  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>
      <Pagination 
      pages={pages} 
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PostsPage;
