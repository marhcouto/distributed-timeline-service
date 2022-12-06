import Post from '../Components/post';
import UserCard from '../Components/userCard';
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


function User() {
    return (
        <><div className="App">
            <UserCard></UserCard>
            <div className="d-flex p-3 border-bottom">
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
                    @MIguel
                    <span className="small text-muted font-weight-normal me-1">
                      •
                    </span>
                    <span className="small text-muted font-weight-normal me-1">
                    02/12/2022 15:05
                    </span>
                    <span>
                      <MDBIcon fas icon="angle-down" className="float-end" />
                    </span>
                  </h6>
                </a>
                <p style={{ lineHeight: "1.2" }}>
                grande golo de portugal!
                </p>
                <MDBTypography
                  listUnStyled
                  className="d-flex justify-content-between mb-0 pe-xl-5"
                >
                  <li>
                    <MDBIcon far icon="comment" />
                  </li>
                  <li>
                    <MDBIcon fas icon="retweet" />
                    <span className="small ps-2">7</span>
                  </li>
                  <li>
                    <MDBIcon far icon="heart" />
                    <span className="small ps-2">35</span>
                  </li>
                  <li>
                    <MDBIcon far icon="share-square" />
                  </li>
                </MDBTypography>
              </div>
            </div>
          </div>
        </div></>
    );
  }
  
  export default User;