import CreatePost from '../Components/createPost.js';
import Post from '../Components/post.js';
import TopNavbar from '../Components/navbar';
import { useEffect, useState } from "react";
import {
  MDBCard,
  MDBContainer,
} from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';


function Feed() {
    const [searchUserName, setSearchUserName] = useState("");
    const [feedPosts, setFeedPosts] = useState([{user:"ze", text: "ola", createdAt: "02/12/2022 15:05"}, {user:"MIguel", text:"grande golo de portugal!", createdAt:'02/12/2022 15:05'}]);
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const getId = async() => {
      try{
        const resId = await fetch(`${window.location.origin}/api/identity`)
        setId((await resId.json()).id);    
      }
      catch(err){
        console.log(err)
      }       
    }

    const getFeed = async () => {
      try{
        const resTimeline = await fetch(`${window.location.origin}/api/timeline`)
        setFeedPosts((await resTimeline.json()));    
      }
      catch(err){
        console.log(err)
      }       
  };

  const syncTimeline = async (_) => {
    try {
      await fetch(`${window.location.origin}/api/timeline/sync`);
      await getFeed();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
      getId();
      getFeed();
  }, []);


    return (
      <>
        <TopNavbar id={id} />
        <MDBContainer className="py-5">
          <MDBCard style={{ width: "48rem" }}>
            <div className="d-flex justify-content-between">
              <form onSubmit={() => navigate(`/user/${searchUserName}`)}>
                <input className="search-bar"
                  placeholder="Search for someone"
                  onChange={(e) => setSearchUserName(e.target.value)}
                  value={searchUserName}
                />
                <button onClick={syncTimeline} className="btn btn-primary btn-rounded" type="submit">Search</button>
              </form>
              <button className="btn btn-primary btn-rounded" onClick={syncTimeline}>Sync</button>
            </div>
            <CreatePost id={id} onSubmit={() => getFeed()}/>
            {feedPosts.map((post, index) => (
              <Post postData={post} key={index}/>
            ))}
            
          </MDBCard>
        </MDBContainer>
      </> 
    );
}

export default Feed;