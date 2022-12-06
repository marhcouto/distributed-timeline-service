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
            <CreatePost />
            <Post postData={feedPosts}/>
          </MDBCard>
    </MDBContainer>

    );
}

export default Feed;