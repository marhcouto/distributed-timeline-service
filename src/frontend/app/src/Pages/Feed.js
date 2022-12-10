import CreatePost from '../Components/createPost.js';
import Post from '../Components/post.js';
import TopNavbar from '../Components/navbar';
import { useEffect, useState } from "react";
import {
  MDBCard,
  MDBContainer,
} from "mdb-react-ui-kit";


function Feed() {

    const [feedPosts, setFeedPosts] = useState([{user:"ze", text: "ola", createdAt: "02/12/2022 15:05"}, {user:"MIguel", text:"grande golo de portugal!", createdAt:'02/12/2022 15:05'}]);
    const [id, setId] = useState("");

    const getId = async() => {
      try{
        const resId = await fetch('http://localhost:5000/api/identity')
        setId((await resId.json()).id);    
      }
      catch(err){
        console.log(err)
      }       
    }

    const getFeed = async () => {
      try{
        const resTimeline = await fetch('http://localhost:5000/api/timeline')
        setFeedPosts((await resTimeline.json()));    
      }
      catch(err){
        console.log(err)
      }       
  };

  useEffect(() => {
      getId();
      getFeed();
  }, []);

    return (
      <>
        <TopNavbar />
        <MDBContainer className="py-5">
          <MDBCard style={{ width: "48rem" }}>
            <CreatePost id={id}/>
            {feedPosts.map((post, index) => (
              <Post postData={post} key={index}/>
            ))}
            
          </MDBCard>
        </MDBContainer>
      </> 
    );
}

export default Feed;