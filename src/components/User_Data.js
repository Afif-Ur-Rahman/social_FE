/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Alerts from "./Alerts";
import "../App.css";
import Loader from "./Loader";
import mongoose from "mongoose";
import { useNavigate } from "react-router-dom";
import Post from "./Post";
import UserPost from "./User_Posts";
import Feed from "./Feed";
import CodeDownload from "./Code_Download";

function UserData() {
  const BASE_URL = "http://localhost:5000";
  const db = "mongodb://localhost:27017/Social_App";
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [newId, setNewId] = useState(null);
  const [button, setButton] = useState(true);
  const [del, setDel] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [profile, setProfile] = useState(true);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });
  const [data, setData] = useState({
    page: 1,
    postCount: 6,
    totalPages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    GetPosts();
  }, [data.postCount]);

  const handlePaginationClick = async (page) => {
    const userId = userData._id;
    if (data.page === page) {
      return;
    }

    try {
      setLoader(true);
      const API_LINK = `${BASE_URL}/userdata?page=${page}&postCount=${data.postCount}`;
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
      setPosts(result.users);
      setData({ ...data, page: page, totalPages: result.totalPages });
      setLoader(false);
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
    }
  };

  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.id]: e.target.value });
  };

  const handleAddData = () => {
    setAddPost(true);
  };

  // Alert
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  // Get Request
  const GetPosts = async () => {
    try {
      setLoader(true);
      const API_LINK = `${BASE_URL}/userdata?page=${data.page}&postCount=${data.postCount}`;
      const token = localStorage.getItem("token");
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      setPosts(result.posts);
      setUserData(result.user);
      setData({ ...data, totalPages: result.totalPages });
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  // Get All Request
  const GetAllPosts = async () => {
    try {
      setLoader(true);
      const API_LINK = `${BASE_URL}/newsfeed?page=${data.page}&postCount=${data.postCount}`;
      const token = localStorage.getItem("token");
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      setPosts(result.posts);
      setUserData(result.user);
      setData({ ...data, totalPages: result.totalPages });
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  // Submit Request
  const publishPost = async (e) => {
    setLoader(true);
    e.preventDefault();

    const payload = {
      _id: new mongoose.Types.ObjectId(),
      id: userData._id,
      title: postData.title,
      author: userData.name,
      content: postData.content,
    };

    setPosts((prevUsers) => [
      payload,
      ...prevUsers.slice(0, data.postCount - 1),
    ]);

    let API_LINK = `${BASE_URL}/submit`;

    try {
      await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      showAlert(`Saved Successfully`, "success");
      setPostData({ title: "", content: "" });
      setLoader(false);
      setAddPost(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete One Request
  const DeleteOneUser = async (id) => {
    setLoader(true);
    const API_LINK = `${BASE_URL}/deleteOne`;
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
      showAlert(`Deleted Successfully`, "success");
      await GetPosts();
      setLoader(false);
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    }
  };

  // Set Data to From Request
  const handleEditClick = (id) => {
    setAddPost(true);
    const postToEdit = posts.find((posts) => posts._id === id);
    setPostData({
      title: postToEdit.title,
      author: postToEdit.author,
      content: postToEdit.content,
    });
    setNewId(id);
    setButton(false);
    window.scrollTo(0, 0);
  };

  // Update Request
  const updatePost = async (e) => {
    e.preventDefault();
    setLoader(true);

    // Update Post Locally
    const updatedPost = posts.map((post) =>
      post._id === newId
        ? {
            ...post,
            title: postData.title,
            author: postData.author,
            content: postData.content,
          }
        : post
    );
    setPosts(updatedPost);

    // Updating Data in Database
    const API_LINK = `${BASE_URL}/update`;
    try {
      await fetch(API_LINK, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newId,
          title: postData.title,
          author: userData.name,
          content: postData.content,
        }),
      });
      showAlert("Updated Successfully", "success");
      setPostData({ title: "", content: "" });
      setNewId(null);
      setButton(true);
      setLoader(false);
      setAddPost(false);
    } catch (error) {
      console.error(`Error updating the data from ${db}: ${error}`);
    }
  };

  return (
    <>
      <Alerts alert={alert} />
      {addPost && (
        <Post
          button={button}
          postData={postData}
          handleInputChange={handleInputChange}
          userData={userData}
          publishPost={publishPost}
          updatePost={updatePost}
          setPostData={setPostData}
          setButton={setButton}
          setAddPost={setAddPost}
          loader={loader}
        />
      )}

      <div className="container main">
        {loader && <Loader />}
        <div>
          <span style={{ fontWeight: "bold" }}>Logged In as: </span>{" "}
          <span>{userData.name}</span>
        </div>

        <div>
          {profile && <h2 style={{ textAlign: "center" }}>User's Posts</h2>}
          {!profile && <h2 style={{ textAlign: "center" }}>News Feed</h2>}
        </div>

        <div className="logout">
          <div
            className="form-group my-1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <label htmlFor="name">Number of Posts: </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              style={{ maxWidth: "20%" }}
              value={data.postCount}
              onChange={(e) =>
                setData({ ...data, postCount: e.target.value, page: 1 })
              }
            />
          </div>

          <div className="my-1">
            {profile && (
              <button
                className="btn btn-success mx-1"
                onClick={() => {
                  setProfile(false);
                  GetAllPosts()
                }}
              >
                News Feed
              </button>
            )}
            {!profile && (
              <button
                className="btn btn-success mx-1"
                onClick={() => {
                  setProfile(true);
                  GetPosts()
                }}
              >
                Profile
              </button>
            )}
            <button
              className="btn btn-success mx-1"
              onClick={() => {
                handleAddData();
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
          {profile && (
            <div className="allPosts col-md-4">
              {posts?.map((item, index) => (
                <div className="card" key={index}>
                    <UserPost
                      key={index}
                      item={item}
                      handleEditClick={handleEditClick}
                      setDel={setDel}
                      setNewId={setNewId}
                    />
                </div>
              ))}
            </div>
          )}

          {!profile && (
            <div className="allPosts col-md-4">
              {posts?.map((item, index) => (
              <div className="card" key={index}>
                <Feed item={item} />
              </div>
              ))}
            </div>
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
                onClick={() => handlePaginationClick(page)}
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
