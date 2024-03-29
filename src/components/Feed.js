/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import FeedPosts from "./FeedPosts";

const Feed = ({ posts, userData, setLoader, likeComment, GetPosts, data }) => {
  
  useEffect(() => {
    GetPosts(data.page)
  }, [data.page])

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
