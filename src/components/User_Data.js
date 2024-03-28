/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Alerts from "./Alerts";
import "../App.css";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import Post from "./Post";
import UserPost from "./User_Posts";
import Feed from "./Feed";
import CodeDownload from "./Code_Download";

function UserData() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const db = process.env.REACT_APP_MONGO_DB_URI;
  const [userData, setUserData] = useState({});
  const [likesComment, setLikesComment] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newId, setNewId] = useState(null);
  const [button, setButton] = useState(true);
  const [del, setDel] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [profile, setProfile] = useState(true);
  const [postData, setPostData] = useState({
    author: userData.name,
    content: "",
    likes: [],
    comments: [],
  });
  const [data, setData] = useState({
    page: 1,
    postCount: 6,
    totalPages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    GetPosts(data.page);
  }, [data.page]);

  // Get Posts
  const GetPosts = async (page) => {
    const userId = userData._id;

    try {
      setLoader(true);
      const API_LINK = profile
        ? `${baseUrl}/newsfeed?page=${page}&postCount=${data.postCount}`
        : `${baseUrl}/userdata?page=${page}&postCount=${data.postCount}`;
      const token = localStorage.getItem("token");
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "User-Id": userId,
        },
      });
      const result = await response.json();
      setPosts(result.posts);
      setUserData(result.user);
      setData({
        ...data,
        page: result.currentPage,
        totalPages: result.totalPages,
      });
      setLikesComment(result.likeComment);
      setLoader(false);
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
      setLoader(false);
    }
  };

  // Delete One Request
  const DeleteOneUser = async (id) => {
    setLoader(true);
    const API_LINK = `${baseUrl}/deleteOne`;
    try {
      await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setDel(false);
      setPostData({ title: "", content: "" });
      setButton(true);
      setNewId(null);
      await GetPosts();
      setLoader(false);
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    }
  };

  return (
    <>
      <Alerts alert={alert} />
      {addPost && (
        <Post
          button={button}
          postData={postData}
          userData={userData}
          setPostData={setPostData}
          setButton={setButton}
          setAddPost={setAddPost}
          setLoader={setLoader}
          posts={posts}
          newId={newId}
          setPosts={setPosts}
          setNewId={setNewId}
          data={data}
          setLikesComment={setLikesComment}
        />
      )}

      <div className="container main">
        {loader && <Loader />}
        <div>
          <span style={{ fontWeight: "bold" }}>Logged In as: </span>{" "}
          <span>{userData.name}</span>
        </div>

        <div>
          {!profile && <h2 style={{ textAlign: "center" }}>User's Posts</h2>}
          {profile && <h2 style={{ textAlign: "center" }}>News Feed</h2>}
        </div>

        <div className="logout">
          <div
            className="form-group my-1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></div>

          <div className="my-1">
            {!profile && (
              <button
                className="btn btn-success mx-1"
                onClick={() => {
                  setProfile(true);
                  GetPosts();
                }}
              >
                News Feed
              </button>
            )}
            {profile && (
              <button
                className="btn btn-success mx-1"
                onClick={() => {
                  setProfile(false);
                  GetPosts();
                }}
              >
                Profile
              </button>
            )}
            <button
              className="btn btn-success mx-1"
              onClick={() => {
                setAddPost(true);
              }}
            >
              Create Post
            </button>
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setLoader(true);
                localStorage.clear();
                navigate("/");
                setLoader(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="container">
          {!profile && (
            <UserPost
              setDel={setDel}
              setNewId={setNewId}
              userData={userData}
              setAddPost={setAddPost}
              setPostData={setPostData}
              setButton={setButton}
              posts={posts}
              setLoader={setLoader}
              likeComment={likesComment}
            />
          )}

          {profile && (
            <Feed
              userData={userData}
              setLoader={setLoader}
              likeComment={likesComment}
              posts={posts}
            />
          )}

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
                onClick={() => DeleteOneUser(newId)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>

        <div className="pagination d-block" style={{ textAlign: "center" }}>
          {Array.from({ length: data.totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={`btn ${
                  page === data.page ? "btn-primary" : "btn-light"
                } mx-1 my-1`}
                onClick={() => {
                  setData({ ...data, page: page });
                }}
              >
                {page}
              </button>
            )
          )}
        </div>
        <CodeDownload />
      </div>
    </>
  );
}

export default UserData;
