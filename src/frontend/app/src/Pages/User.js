import Post from '../Components/post';
import UserCard from '../Components/userCard';
import TopNavbar from '../Components/navbar';
import { useEffect, useState } from "react";
import {
    MDBIcon,
    MDBTypography,
  } from "mdb-react-ui-kit";


function User() {

    const [id, setId] = useState("");
    const [userTimeline, setUserTimeline] = useState([]);

    const getId = async() => {
      try{
        const resId = await fetch('http://localhost:5000/api/identity')
        setId((await resId.json()).id);    
      }
      catch(err){
        console.log(err)
      }       
    }

    const getUserTimeline = async () => {
      try{
        const resTimeline = await fetch('http://localhost:5000/api/timeline/' + id)
        setUserTimeline((await resTimeline.json()));    
      }
      catch(err){
        console.log(err)
      }    
    }



    useEffect(() => {
      getId();
      getUserTimeline();
  }, []);

    return (
        <>
        <TopNavbar />
        <div className="App">
            <UserCard id={id}></UserCard>
            {userTimeline.map((post, index) => (
              <Post postData={post} key={index}/>
            ))}
        </div>
        </>
    );
  }
  
  export default User;