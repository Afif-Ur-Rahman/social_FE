import React from "react";

function Post({
  button,
  postData,
  handleInputChange,
  userData,
  publishPost,
  updatePost,
  setPostData,
  setButton,
  setAddPost,
  loader,
}) {
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
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              aria-describedby="title"
              autoComplete="off"
              value={postData.title}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="author">Author:</label>
            <input
              type="text"
              className="form-control"
              id="author"
              autoComplete="off"
              value={userData.name}
              disabled
            />
            <br />

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
              disabled={loader}
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
                setPostData({ title: "", content: "" });
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
