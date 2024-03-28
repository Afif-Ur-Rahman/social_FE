/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import UserPosts from "./UserPosts";

const UserProfile = ({
  setDel,
  setNewId,
  userData,
  setAddPost,
  setPostData,
  setButton,
  posts,
  setLoader,
  likeComment,
  GetPosts,
  data,
}) => {
  useEffect(() => {
    GetPosts(data.page)
  }, [data.page])
  

  return (
    <div className="allPosts col-md-4">
      {posts?.map((item, index) => (
        <div className="card" key={index}>
          <UserPosts
            item={item}
            setDel={setDel}
            setNewId={setNewId}
            userData={userData}
            setAddPost={setAddPost}
            setPostData={setPostData}
            setButton={setButton}
            posts={posts}
            setLoader={setLoader}
            likesComments={likeComment[index]}
          />
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
