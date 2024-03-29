import React from "react";
import mongoose from "mongoose";

function Post({
  button,
  postData,
  setPostData,
  setButton,
  setAddPost,
  setLoader,
  posts,
  newId,
  setPosts,
  userData,
  setNewId,
  setLikesComment,
}) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const db = process.env.REACT_APP_MONGO_DB_URI;

  const handleInputChange = (e) => {
    setPostData({ ...postData, content: e.target.value });
  };

  // Update Request
  const updatePost = async (e) => {
    e.preventDefault();
    setLoader(true);
    const API_LINK = `${baseUrl}/update`;
    try {
      const response = await fetch(API_LINK, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newId,
          author: userData.name,
          content: postData.content,
        }),
      });
      if (response.ok) {
        const updatedPost = posts.map((post) =>
          post._id === newId
            ? {
                ...post,
                content: postData.content,
              }
            : post
        );
        setPosts(updatedPost);
      }
      setPostData({ ...postData, content: "" });
      setNewId(null);
      setButton(true);
      setLoader(false);
      setAddPost(false);
    } catch (error) {
      console.error(`Error updating the data from ${db}: ${error}`);
    }
  };

  // Submit Request
  const publishPost = async (e) => {
    setLoader(true);
    e.preventDefault();

    const payload = {
      _id: new mongoose.Types.ObjectId(),
      id: userData._id,
      author: userData.name,
      content: postData.content,
      likes: postData.likes,
      comments: postData.comments,
    };

    const likeComment = {
      _id: payload._id,
      likes: postData.likes,
      comments: postData.comments,
    }

    let API_LINK = `${baseUrl}/submit`;

    try {
      const response = await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setPosts((prevUsers) => [payload, ...prevUsers]);
        setLikesComment((prevlikesComment) => [likeComment, ...prevlikesComment])
      }
      setPostData({ ...postData, content: "" });
      setLoader(false);
      setAddPost(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
      setAddPost(false);
    }
  };

  return (
    <div
      className="data d-flex flex-column align-items-center justify-content-center"
      autoComplete="off"
    >
      <div>
        <form
          className="container d-flex flex-column justify-content-center"
          method="POST"
          encType="multipart/form-data"
          style={{
            padding: "10px",
            margin: "auto 10px",
            width: "auto",
            height: "fit-content",
            borderRadius: "10px",
            border: "1px solid gray",
            backgroundColor: "whitesmoke",
          }}
        >
          <h5 className="text-center">{button ? "Create" : "Update"} Post</h5>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              type="text"
              className="form-control"
              id="content"
              autoComplete="off"
              value={postData.content}
              onChange={handleInputChange}
            />
            <br />
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-success mx-1"
              onClick={button ? publishPost : updatePost}
            >
              {button ? "Publish" : "Update"}
            </button>
            <button
              type="submit"
              className="btn btn-danger mx-1"
              onClick={() => {
                setPostData({ ...postData, content: "" });
                setButton(true);
                setAddPost(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Post;
