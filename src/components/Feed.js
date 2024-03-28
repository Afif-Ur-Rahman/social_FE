import React from "react";
import FeedPosts from "./FeedPosts";

const Feed = ({ posts, userData, setLoader, likeComment }) => {
  
  return (
    <div className="allPosts col-md-4">
      {posts?.map((item, index) => (
        <div className="card" key={index}>
          <FeedPosts
            item={item}
            userData={userData}
            setLoader={setLoader}
            likesComments={likeComment[index]}
          />
        </div>
      ))}
    </div>
  );
};

export default Feed;
