import CreatePost from '../Components/createPost.js';
import Post from '../Components/post.js';
import { useEffect, useState } from "react";


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
      <div className="container mt-4 mb-5">
         <div className="d-flex justify-content-center row">
            <div className="col-md-8">
              <div className="align-items-center justify-content-center">
                <CreatePost/>
              </div>
              <hr className='px-20'/>   
              <div className="align-items-center justify-content-center">
                {feedPosts.map((postData) => (
                    <Post 
                      key={"id__" + postData.createdAt + "__" + postData.user}
                      post={postData}
                    />
                ))}
              </div>
            </div>
        </div>
      </div>    

    );
}

export default Feed;