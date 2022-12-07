import React, { useState } from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBIcon,
    MDBInput,
    MDBTypography,
    MDBCardText,
  } from "mdb-react-ui-kit";

export default function CreatePost(props) {
    const [postText, setPostText] = useState("");
     
    const handleChange = (event) => {
        console.log(event.target.value)
        setPostText(event.target.value)
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        //todo post
      }

    return (
        <div className="border border-left border-right px-0">
          <div className="p-3 border-bottom">
            <h4 className="d-flex align-items-center mb-0">
              Home
              <MDBIcon
                far
                icon="star"
                size="xs"
                color="primary"
                className="ms-auto"
              />
            </h4>
          </div>
          <MDBCard className="shadow-0">
            <MDBCardBody className="border-bottom pb-2">
              <div className="d-flex">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                  className="rounded-circle"
                  height="50"
                  alt="Avatar"
                  loading="lazy"
                />
                <div className="d-flex align-items-center w-100 ps-3">
                  <div className="w-100">
                    <input
                      type="text"
                      id="form1"
                      className="form-control form-status border-0 py-1 px-0"
                      placeholder="What's happening"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography
                  listUnStyled
                  className="d-flex flex-row ps-3 pt-3"
                  style={{ marginLeft: "50px" }}
                >
                  <li>
                    <a href="#!">
                      <MDBIcon far icon="image" className="pe-2" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <MDBIcon fas icon="photo-video" className="px-2" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <MDBIcon fas icon="chart-bar" className="px-2" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <MDBIcon far icon="smile" className="px-2" />
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <MDBIcon far icon="calendar-check" className="px-2" />
                    </a>
                  </li>
                </MDBTypography>
                <div className="d-flex align-items-center">
                  <MDBBtn rounded>Honk</MDBBtn>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
          </div>
    );
}
