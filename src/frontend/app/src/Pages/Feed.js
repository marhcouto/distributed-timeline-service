import CreatePost from '../Components/createPost.js';
import Post from '../Components/post.js';
import { useEffect, useState } from "react";
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


function Feed() {

    const [feedPosts, setFeedPosts] = useState([{user:"ze", text: "ola", createdAt: "02/12/2022 15:05"}, {user:"MIguel", text:"grande golo de portugal!", createdAt:'02/12/2022 15:05'}]);

    const getFeed = async () => {
      // axios.get(`feed/`, {
      //     headers: { "Content-Type": "application/json" },
      // })
      //     .then((res) => {
      //         setFeedPosts(res.data);
      //     })
      //     .catch((err) => {
      //         console.log("Get posts request error:" + err);
      //     });
  };

  useEffect(() => {
      getFeed();
  }, []);

    return ( 
      <MDBContainer className="py-5">
      <MDBCard style={{ width: "48rem" }}>
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
                  <MDBBtn rounded>Tweet</MDBBtn>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
          {feedPosts.map((postData) => (
                    <div key={postData.user} className="d-flex p-3 border-bottom">
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
                            @{postData.user}
                            <span className="small text-muted font-weight-normal me-1">
                              •
                            </span>
                            <span className="small text-muted font-weight-normal me-1">
                              {postData.createdAt}
                            </span>
                            <span>
                              <MDBIcon fas icon="angle-down" className="float-end" />
                            </span>
                          </h6>
                        </a>
                        <p style={{ lineHeight: "1.2" }}>
                          {postData.text}
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
                ))}
                </div>
          </MDBCard>
    </MDBContainer>

    );
}

export default Feed;