import React from "react";
import { ReactComponent as EditIcon } from "./Edit_Icon.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import { ReactComponent as ThumbIcon } from "./Thumb_Icon.svg";
import { ReactComponent as MsgIcon } from "./Msg_Icon.svg";

function UserPost({ item, handleEditClick, setDel, setNewId }) {
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
        <div>
          <ThumbIcon /> Like
        </div>
        <div>
          <MsgIcon /> Comment
        </div>
      </div>
    </div>
  );
}

export default UserPost;
