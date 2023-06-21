import { Link, } from "react-router-dom";

const PostItem = ({post,username,userId,user}) => {
  const profileLink = userId ? `/profile/${userId}` : `/profile/${post?.user._id}`

  // const navigate = useNavigate();

  // const handleReadMoreClick = () => {
  //   // Check if the user is a visitor (assuming you have a way to determine this)
  //   const isVisitor = !user && !isAdmin; // Replace with your logic to determine if the user is a visitor

  //   if (isVisitor) {
  //     // Redirect the visitor to the registration page
  //     navigate('/register');
  //   }
  // };
  return (
    <div className="post-item">
      <div className="post-item-image-wrapper">
        <img src={post?.image.url} alt="" className="post-itme-image" />
      </div>
      <div className="post-item-info-wrapper">
        <div className="post-item-info">
          <div className="post-item-author">
            <strong>Author: </strong>
            <Link
            className="post-item-username"
            to={profileLink}>
              {username ? username : post?.user.username}
              </Link>
          </div>
          <div className="post-itme-date">
            {new Date(post?.createdAt).toDateString()}
          </div>
        </div>
        <div className="post-item-details">
          <h4 className="post-item-title">{post?.title}</h4>
          <Link className="post-item-category" to={`/posts/categories/${post?.category}`}>{post?.category}</Link>
        </div>
        <p className="post-item-description">
          {post?.description}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat natus
          delectus blanditiis accusamus. Fugit vitae odit accusamus, error nobis
          debitis, rerum ex saepe quisquam rem qui sint deserunt consectetur
          voluptas! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Repudiandae itaque atque, molestiae totam, unde minus corrupti dicta
          distinctio repellat enim doloribus consectetur odit nisi optio,
          repellendus ea ex impedit incidunt.
        </p>
                    {user ? (
              <Link className="post-item-link" to={`/posts/details/${post._id}`}>
                Read More...
              </Link>
            ) : (
              <Link className="post-item-link" to="/register">
                Read More...
              </Link>
            )}

        {/* // {  <Link className="post-item-link" onClick={handleReadMoreClick}>  check 
        //   Read More...
        //   </Link> } */}
        
         
      </div>
    </div>
  );
};

export default PostItem;
