import React from "react";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="container-fluid pt-5 pb-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 text-center mb-5">
            <small className="bg-primary text-white text-uppercase font-weight-bold px-1">
              What we do
            </small>
            <h1 className="mt-2 mb-3">We Offer Creative Services</h1>
            <h4 className="font-weight-normal text-muted mb-4">
              Lorem ut kasd dolores elitr sed est duo ea ipsum justo diam, est erat lorem. Est magna
              sea clita diam tempor elitr
            </h4>
            <Link to="/discover" className="btn btn-primary py-md-2 px-md-4 font-weight-semi-bold">
              Discover More
            </Link>
          </div>
        </div>
        <div className="row">
          {[
            { icon: "fa-laptop-code", title: "Web Design" },
            { icon: "fa-code", title: "Development" },
            { icon: "fa-envelope-open-text", title: "Marketing" },
            { icon: "fa-chart-line", title: "Strategy" },
            { icon: "fa-search", title: "SEO" },
            { icon: "fa-pen", title: "Content Writing" },
          ].map((service, index) => (
            <div className="col-md-4 mb-5" key={index}>
              <div className="d-flex">
                <i className={`fa fa-3x ${service.icon} text-primary me-4`}></i>
                <div className="d-flex flex-column">
                  <h4 className="font-weight-bold mb-3">{service.title}</h4>
                  <p>
                    Et kasd justo clita amet kasd, vero amet vero eos kasd diam justo, ipsum diam
                    sed elitr erat
                  </p>
                  <Link
                    to={`/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="font-weight-semi-bold"
                  >
                    Read More <i className="fa fa-angle-double-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;
