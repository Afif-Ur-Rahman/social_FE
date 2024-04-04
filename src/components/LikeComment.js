import React from "react";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";

const LikeComment = ({ comments, handleDeleteCmnt }) => {
  return (
    <>
      {comments.length !== 0 && (
        <div className="cmntSection">
          {comments.map((item, index) => {
            return (
              <div key={index}>
                <div className="indCmnt">
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default LikeComment;
