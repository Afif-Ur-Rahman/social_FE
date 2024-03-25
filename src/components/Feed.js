import React, { useState } from "react";
import { ReactComponent as ThumbIcon } from "./Thumb_Icon.svg";
import { ReactComponent as MsgIcon } from "./Msg_Icon.svg";
import { ReactComponent as ThumbIcon2 } from "./Thumb_Icon2.svg";
import { ReactComponent as SendIcon } from "./Send.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import mongoose from "mongoose";

const Feed = ({ item, userData, setLoader }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [likes, setLikes] = useState(item.likes || []);
  const [comments, setComments] = useState(item.comments || []);
  const [addComment, setAddComment] = useState("");
  const [showCmnt, setShowCmnt] = useState(false);

  const handleInputChange = (e) => {
    setAddComment(e.target.value);
  };

  const handleLikeClick = async () => {
    let updatedLikes = [];

    if (likes?.includes(userData._id)) {
      updatedLikes = likes.filter((userId) => userId !== userData._id);
    } else {
      updatedLikes = [...likes, userData._id];
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
      if (!response.ok) {
        throw new Error("Failed to Like");
      }
      setLikes(updatedLikes);
    } catch (error) {
      console.error("Failed to Like: ", error);
    }
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
    }
  };

  const handleDeleteCmnt = async (id) => {
    setLoader(true);
    let updatedComments = await comments.filter((comment) => comment._id !== id);
    console.log(updatedComments);
    console.log(id);

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
    <div className="card-body posts">
      <div className="post-head">
        <h6 className="card-title">{item.author}</h6>
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
              value={addComment}
              onChange={handleInputChange}
              placeholder="Write a comment..."
              style={{ margin: "5px 0 0 -7px" }}
            />
            <div className="sendIcon mx-2" onClick={handleCommentClick}>
              <SendIcon />
            </div>
          </form>
          {comments.length !== 0 && (
            <div className="cmntSection">
              {comments.map((item, index) => {
                return (
                  <>
                    <div className="indCmnt" key={index}>
                      <div className="hede">
                        <h6 className="h6">{item.username}</h6>
                        <DeleteIcon
                          onClick={() => handleDeleteCmnt(item._id)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <p style={{ marginBottom: "0px" }}>{item.comment}</p>
                    </div>
                    <div className="lire">
                      <span className="mx-2">Like</span>
                      <span className="mx-2">Reply</span>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
