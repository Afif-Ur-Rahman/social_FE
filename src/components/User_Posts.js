import React, { useState } from "react";
import { ReactComponent as EditIcon } from "./Edit_Icon.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import { ReactComponent as ThumbIcon } from "./Thumb_Icon.svg";
import { ReactComponent as ThumbIcon2 } from "./Thumb_Icon2.svg";
import { ReactComponent as MsgIcon } from "./Msg_Icon.svg";

const UserPost = ({ item, handleEditClick, setDel, setNewId, userData }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [likes, setLikes] = useState(item.likes || []);
  // const [isLiked, setIsLiked] = useState(second)

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

  return (
    <div className="card-body posts">
      <div className="badge bg-primary" style={{ fontSize: "14px" }}>
        {item.author}
      </div>
      <div className="post-head">
        <h6 className="card-title">
          {item.title ? item.title : "This is Heading"}
        </h6>
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
      <p className="card-text">
        {item.content ? item.content : "No Content to Display"}
      </p>
      <div className="lico">
        <div className="mx-2" onClick={handleLikeClick} style={{ cursor: "pointer" }}>
          <ThumbIcon /> {likes.length} {likes.length <= 1 ? "Like" : "Likes"}
        </div>
        <div className="mx-2">
          <MsgIcon /> Comment
        </div>
      </div>
    </div>
  );
};

export default UserPost;
