import React from "react";

const Pagination = ({
  data,
  setData,
}) => {
  return (
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
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
              }}
            >
              {page}
            </button>
          )
        )}
      </div>
  );
};

export default Pagination;
