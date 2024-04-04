/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import FeedPosts from "./FeedPosts";
import Pagination from "./Pagination";

const Feed = ({
  posts,
  userData,
  setLoader,
  likeComment,
  GetPosts,
  data,
  setData,
}) => {
  useEffect(() => {
    GetPosts(data.page);
  }, [data.page]);

  return (
    <>
      <div className="allPosts col-md-4">
        {posts?.map((item, index) => (
          <div className="card" key={index}>
            <FeedPosts
              item={item}
              userData={userData}
              setLoader={setLoader}
              likesComments={likeComment[index]}
              GetPosts={GetPosts}
              data={data}
            />
          </div>
        ))}
      </div>
      <Pagination data={data} setData={setData} />
    </>
  );
};

export default Feed;
