import React from "react";
import PropTypes from "prop-types";
import {
  MDBIcon,
  MDBTypography,
} from "mdb-react-ui-kit";

Post.propTypes = {
    postData: PropTypes.array,
  };

export default function Post(props) {
    const postD = props.postData;

    return (
      <div>
      {postD.map((p) => (
        <div key={p.user} className="d-flex p-3 border-bottom">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (29).webp"
          className="rounded-circle"
          height="50"
          alt="Avatar"
          loading="lazy"
        />
        <div className="d-flex w-100 ps-3">
          <div>
            <a href="#!">
              <h6 className="text-body">
                @{p.user}
                <span className="small text-muted font-weight-normal me-1">
                  •
                </span>
                <span className="small text-muted font-weight-normal me-1">
                  {p.createdAt}
                </span>
                <span>
                  <MDBIcon fas icon="angle-down" className="float-end" />
                </span>
              </h6>
            </a>
            <p style={{ lineHeight: "1.2" }}>
              {p.text}
            </p>
            <MDBTypography
              listUnStyled
              className="d-flex justify-content-between mb-0 pe-xl-5"
            >
            </MDBTypography>
          </div>
        </div>
      </div>
    ))}
    </div>
    );

}