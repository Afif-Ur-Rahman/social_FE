import React, {useState, useEffect} from "react";
import FeedPosts from "./FeedPosts";

const Feed = ({ posts, userData, setLoader, likeComment }) => {
  const newLikeComment = likeComment;
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  console.log(likes);
  console.log(comments);

  useEffect(() => {
    // Update likes state based on newLikeComment and posts
    const updatedLikes = posts.map(post => {
      const like = newLikeComment.find(like => like._id === post._id);
      return like || null;
    });
    setLikes(updatedLikes);
  }, [newLikeComment, posts]);

  return (
    <div className="allPosts col-md-4">
      {posts?.map((item, index) => (
        <div className="card" key={index}>
          <FeedPosts
            item={item}
            userData={userData}
            setLoader={setLoader}
            likes={likes}
            setLikes={setLikes}
            comments={comments}
            setComments={setComments}
          />
        </div>
      ))}
    </div>
  );
};

export default Feed;
