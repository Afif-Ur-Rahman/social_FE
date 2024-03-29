/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Alerts from "./Alerts";
import "../App.css";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import Post from "./Post";
import UserProfile from "./User_Profile";
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
            <button
              className="btn btn-success mx-1"
              onClick={() => {
                setProfile(!profile);
                setData({ ...data, page: 1 });
              }}
            >
              {profile ? "Profile" : "News Feed"}
            </button>
            <button
              className="btn btn-success mx-1"
              onClick={async () => {
                setAddPost(!profile);
                setData({ ...data, page: 1 });
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
            <UserProfile
              newId={newId}
              setNewId={setNewId}
              userData={userData}
              setAddPost={setAddPost}
              setPostData={setPostData}
              setButton={setButton}
              posts={posts}
              setPosts={setPosts}
              setLoader={setLoader}
              likeComment={likesComment}
              GetPosts={GetPosts}
              data={data}
              setData={setData}
            />
          )}

          {profile && (
            <Feed
              userData={userData}
              setLoader={setLoader}
              likeComment={likesComment}
              posts={posts}
              GetPosts={GetPosts}
              data={data}
              setData={setData}
            />
          )}
        </div>

        <CodeDownload />
      </div>
    </>
  );
}

export default UserData;
