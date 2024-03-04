import React, { useState } from "react";
import { ReactComponent as EditIcon } from "./Edit_Icon.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import { ReactComponent as ThumbIcon } from "./Thumb_Icon.svg";
import { ReactComponent as MsgIcon } from "./Msg_Icon.svg";

const UserPost =({ item, handleEditClick, setDel, setNewId }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
const [isLiked, setIsLiked] = useState(false);
const [likes, setLikes] = useState(item.likes)

const handleLikeClick = async() => {
  !isLiked? setLikes((prevLikes) => prevLikes + 1) : setLikes((prevLikes) => prevLikes - 1);
  
  try {
    const response = await fetch(`${baseUrl}/like/${item._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({isLiked: !isLiked})
    });
    if (!response.ok) {
      throw new Error("Failed to Like")
    }

    const updatedLikes = await response.json();
    setLikes(updatedLikes);
    setIsLiked(!isLiked);
  } catch (error) {
    console.error("Failed to Like: ", error);
  }

}

  return (
    <div className="card-body posts">
      <div className="badge bg-primary" style={{ fontSize: "14px" }}>
        {item.author}
      </div>
      <div className="post-head">
        <h6 className="card-title">{item.title ? item.title : "This is Heading"}</h6>
        <div className="edde">
          <span onClick={() => handleEditClick(item._id)} style={{ cursor: "pointer" }}>
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
      <p className="card-text">{item.content ? item.content : "No Content to Display"}</p>
      <div className="lico">
        <div onClick={handleLikeClick} style={{cursor: "pointer"}} >
          <ThumbIcon /> {likes} Likes
        </div>
        <div>
          <MsgIcon /> Comment
        </div>
      </div>
    </div>
  );
}

export default UserPost;
