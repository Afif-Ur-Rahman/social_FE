/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import UserPosts from "./UserPosts";
import Pagination from "./Pagination";

const UserProfile = ({
  newId,
  setNewId,
  userData,
  setAddPost,
  setPostData,
  setButton,
  posts,
  setPosts,
  setLoader,
  likeComment,
  GetPosts,
  data,
  setData,
}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [del, setDel] = useState(false);

  const DeletePost = async (id) => {
    setLoader(true);
    const API_LINK = `${baseUrl}/deleteOne`;
    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const updatedPosts = posts.filter((post) => post._id !== id);
        setPosts(updatedPosts);
      }
      setDel(false);
      setPostData({ title: "", content: "" });
      setButton(true);
      setNewId(null);
      setLoader(false);
    } catch (error) {
      console.error(`Error deleting the data: ${error}`);
    }
  };
  useEffect(() => {
    GetPosts(data.page);
  }, [data.page]);

  return (
    <>
      <div className="allPosts col-md-4">
        {posts?.map((item, index) => (
          <div className="card" key={index}>
            <UserPosts
              item={item}
              setNewId={setNewId}
              userData={userData}
              setAddPost={setAddPost}
              setPostData={setPostData}
              setButton={setButton}
              posts={posts}
              setLoader={setLoader}
              likesComments={likeComment[index]}
              setDel={setDel}
            />
          </div>
        ))}
      </div>
      <Pagination data={data} setData={setData} />
      <div
        className="delOne"
        style={{
          display: del ? "block" : "none",
        }}
      >
        Are you sure you want to delete?
        <div className="align-right">
          <button
            className="btn btn-success mt-2 mx-1"
            onClick={() => {
              setDel(false);
              setNewId(null);
            }}
          >
            No
          </button>
          <button
            className="btn btn-danger mt-2 mx-1"
            onClick={() => DeletePost(newId)}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
