import React, { useState } from "react";
import { ReactComponent as EditIcon } from "./Edit_Icon.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import { ReactComponent as ThumbIcon } from "./Thumb_Icon.svg";
import { ReactComponent as ThumbIcon2 } from "./Thumb_Icon2.svg";
import { ReactComponent as MsgIcon } from "./Msg_Icon.svg";
import { ReactComponent as SendIcon } from "./Send.svg";
import mongoose from "mongoose";
import LikeComment from "./LikeComment";

const UserPosts = ({
  item,
  userData,
  setAddPost,
  setPostData,
  setButton,
  posts,
  setLoader,
  likesComments,
  setDel,
  setNewId,
}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [likes, setLike] = useState(likesComments.likes || []);
  const [comments, setComments] = useState(likesComments.comments || []);
  const [addComment, setAddComment] = useState("");
  const [showCmnt, setShowCmnt] = useState(false);
  // console.log("Post",item);
  // console.log("Likes",likes);
  console.log("Comments",comments);

  const handleInputChange = (e) => {
    setAddComment(e.target.value);
  };

  const handleLikeClick = async () => {
    let updatedLikes = [];
    if (likes?.some((like) => like.userId === userData._id)) {
      updatedLikes = likes.filter((like) => like.userId !== userData._id);
    } else {
      updatedLikes = [
        ...likes,
        { userId: userData._id, username: userData.name },
      ];
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/like/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedLikes),
      });
      if (response.ok) {
        setLike(updatedLikes);
      }
    } catch (error) {
      console.error("Failed to Like: ", error);
    }
  };

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
  };

  const handleCommentClick = async () => {
    setLoader(true);
    let updatedComments = [
      ...comments,
      {
        _id: new mongoose.Types.ObjectId(),
        userId: userData._id,
        username: userData.name,
        comment: addComment,
      },
    ];

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/comment/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedComments),
      });
      if (!response.ok) {
        throw new Error("Failed to Comment");
      }
      setComments(updatedComments);
      setAddComment("");
      setLoader(false);
    } catch (error) {
      console.error("Failed to Comment", error);
      setLoader(false);
    }
  };

  const handleDeleteCmnt = async (id) => {
    setLoader(true);
    let updatedComments = await comments.filter(
      (comment) => comment._id !== id
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/deletecomment/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedComments),
      });
      if (!response.ok) {
        throw new Error("Failed to Delete Comment");
      }
      setComments(updatedComments);
      setLoader(false);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <>
      <div className="card-body posts">
        <div className="post-head">
          <h6 className="card-title">{item.author}</h6>
          <div className="edde">
            <span
              onClick={() => handleEditClick(item._id)}
              style={{ cursor: "pointer" }}
            >
              <EditIcon />
            </span>
            <span
              onClick={() => {
                setDel(true);
                setNewId(item._id);
              }}
              style={{ cursor: "pointer" }}
            >
              <DeleteIcon />
            </span>
          </div>
        </div>
        <div className="date">
          {" "}
          Published At : {item.time} / {item.date}
        </div>
        <p className="card-text">
          {item.content ? item.content : "No Content to Display"}
        </p>
        <div className="lico">
          <div
            className="mx-2"
            onClick={handleLikeClick}
            style={{ cursor: "pointer" }}
          >
            {likes?.includes(userData._id) ? <ThumbIcon2 /> : <ThumbIcon />}{" "}
            {likes.length} {likes.length <= 1 ? "Like" : "Likes"}
          </div>
          <div
            className="mx-2"
            onClick={() => setShowCmnt(!showCmnt)}
            style={{ cursor: "pointer" }}
          >
            <MsgIcon /> {comments.length}{" "}
            {comments.length <= 1 ? "Comment" : "Comments"}
          </div>
        </div>
        {showCmnt && (
          <>
            <form
              className="container cmnt"
              method="POST"
              encType="multipart/form-data"
              style={{
                height: "fit-content",
              }}
            >
              <input
                type="text"
                className="form-control"
                id="title"
                aria-describedby="title"
                autoComplete="off"
                value={addComment.comment}
                onChange={handleInputChange}
                placeholder="Write a comment..."
                style={{ margin: "5px 0 0 -7px" }}
              />
              <div className="sendIcon mx-2" onClick={handleCommentClick}>
                <SendIcon />
              </div>
            </form>
            <LikeComment
              comments={comments}
              handleDeleteCmnt={handleDeleteCmnt}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UserPosts;
