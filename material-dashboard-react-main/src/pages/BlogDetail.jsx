import React from "react";
import { Link } from "react-router-dom";

function BlogDetail() {
  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header d-flex flex-column align-items-center justify-content-center pt-0 pt-lg-5 mb-5">
        <h1 className="display-4 text-white mb-3 mt-0 mt-lg-5">Blog Detail</h1>
        <div className="d-inline-flex text-white">
          <p className="m-0">
            <Link className="text-white" to="/">
              Home
            </Link>
          </p>
          <p className="m-0 px-2">/</p>
          <p className="m-0">Detail</p>
        </div>
      </div>

      {/* Blog Detail */}
      <div className="container py-5">
        <div className="row">
          {/* Blog Content */}
          <div className="col-lg-8">
            <div className="position-relative">
              <img className="img-fluid w-100" src="/img/blog-1.jpg" alt="" />
              <div
                className="position-absolute bg-primary d-flex flex-column align-items-center justify-content-center"
                style={{ width: 80, height: 80, bottom: 0, left: 0 }}
              >
                <h6 className="text-uppercase mt-2 mb-n2">Jan</h6>
                <h1 className="m-0">01</h1>
              </div>
            </div>
            <div className="pt-4 pb-2">
              <div className="d-flex mb-3">
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle"
                    style={{ width: 40, height: 40 }}
                    src="/img/user.jpg"
                    alt=""
                  />
                  <Link className="text-muted ml-2" to="#">
                    John Doe
                  </Link>
                </div>
                <div className="d-flex align-items-center ml-4">
                  <i className="far fa-bookmark text-primary"></i>
                  <Link className="text-muted ml-2" to="#">
                    Web Design
                  </Link>
                </div>
              </div>
              <h2 className="font-weight-bold">
                Kasd tempor diam sea justo dolor kasd amet dolor labore amet clita est diam dolor
              </h2>
            </div>

            <div className="mb-5">
              <p>Sadipscing labore amet rebum est et justo gubergren...</p>
              <p>Voluptua est takimata stet invidunt sed rebum nonumy...</p>
              <h2 className="mb-4">Est dolor lorem et ea</h2>
              <img
                className="img-fluid w-50 float-left mr-4 mb-3"
                src="/img/blog-1.jpg"
                alt="Image"
              />
              <p>Diam dolor est labore duo invidunt ipsum clita et...</p>
              <h3 className="mb-4">Est dolor lorem et ea</h3>
              <img
                className="img-fluid w-50 float-right ml-4 mb-3"
                src="/img/blog-2.jpg"
                alt="Image"
              />
              <p>Diam dolor est labore duo invidunt ipsum clita et...</p>
            </div>

            {/* Comments */}
            <div className="mb-5">
              <h3 className="font-weight-bold mb-4">3 Comments</h3>
              <div className="media mb-4">
                <img
                  src="/img/user.jpg"
                  alt="User"
                  className="img-fluid mr-3 mt-1"
                  style={{ width: 45 }}
                />
                <div className="media-body">
                  <h6>
                    John Doe{" "}
                    <small>
                      <i>01 Jan 2045 at 12:00pm</i>
                    </small>
                  </h6>
                  <p>Diam amet duo labore stet elitr invidunt ea...</p>
                  <button className="btn btn-sm btn-light font-weight-semi-bold">Reply</button>
                </div>
              </div>
              {/* ... más comentarios anidados */}
            </div>

            {/* Comment Form */}
            <div className="border p-5">
              <h3 className="font-weight-bold mb-4">Leave a comment</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input type="text" className="form-control" id="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" className="form-control" id="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input type="url" className="form-control" id="website" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" rows="5" className="form-control"></textarea>
                </div>
                <button type="submit" className="btn btn-primary font-weight-semi-bold py-2 px-3">
                  Leave Comment
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 mt-5 mt-lg-0">
            {/* Search */}
            <div className="mb-5">
              <div className="input-group">
                <input type="text" className="form-control form-control-lg" placeholder="Keyword" />
                <div className="input-group-append">
                  <span className="input-group-text bg-transparent text-primary">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <h3 className="font-weight-bold mb-4">Categories</h3>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <Link to="#">
                    <i className="fa fa-angle-right mr-2"></i>Web Design
                  </Link>
                  <span className="badge badge-primary badge-pill">150</span>
                </li>
                {/* ... otros items */}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="mb-5">
              <h3 className="font-weight-bold mb-4">Recent Post</h3>
              {[1, 2, 1, 2, 1].map((n, i) => (
                <div className="d-flex mb-3" key={i}>
                  <img
                    className="img-fluid"
                    src={`/img/blog-${n}.jpg`}
                    style={{ width: 80, height: 80 }}
                    alt=""
                  />
                  <div
                    className="d-flex align-items-center border border-left-0 px-3"
                    style={{ height: 80 }}
                  >
                    <Link className="text-secondary font-weight-semi-bold" to="#">
                      Lorem ipsum dolor sit amet
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Tag Cloud */}
            <div className="mb-5">
              <h3 className="font-weight-bold mb-4">Tag Cloud</h3>
              <div className="d-flex flex-wrap m-n1">
                {["Design", "Development", "Marketing", "SEO", "Writing", "Consulting"].map(
                  (tag) => (
                    <Link key={tag} to="#" className="btn btn-outline-primary m-1">
                      {tag}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Plain Text */}
            <div className="border p-3">
              <h3 className="font-weight-bold mb-4">Plain Text</h3>
              <p>Aliquyam sed lorem stet diam dolor sed ut sit...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogDetail;
