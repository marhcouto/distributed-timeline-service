import Post from '../Components/post';
import TopNavbar from '../Components/navbar';
import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  MDBBtn,
} from "mdb-react-ui-kit";

function User() {
    const {id} = useParams();
    const [following, setFollowing] = useState(false)
    const [userTimeline, setUserTimeline] = useState([]);

    const getFollowing = async () => {
      try{
        const resFollow = await fetch(`http://localhost:5000/api/following/` + id)
        if (resFollow.ok) setFollowing(true);
        else setFollowing(false);
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

    const handleClick = (event) => {
      if (following){
        fetch('http://localhost:5000/api/following/' + id,{
              method: 'DELETE',        
            }).then(res =>{
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
      }   
      else{
        fetch('http://localhost:5000/api/following/' + id,{
              method: 'POST',        
            }).then(res =>{
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
        }
      
      setFollowing(!following); 
    }

    useEffect(() => {
      (async () => {      
         await getUserTimeline();
         await getFollowing();
      })()}, []);

    return (
        <>
        <TopNavbar />
        <div className="App">
          <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (29).webp"
              className="rounded-circle"
              height="200"
              alt="Avatar"
              loading="lazy"
            />
            <Typography sx={{ fontSize: 100 }} color="text.secondary" gutterBottom>
              {id}
            </Typography>
            <MDBBtn onClick={handleClick} type="submit" color = {following? "danger":"primary" } size='lg' rounded>{following? "Unfollow": "Follow"}</MDBBtn>     
          </CardContent>
        </Card>
            {userTimeline.map((post, index) => (
              <Post postData={{...post, userName: id}} key={index}/>
            ))}
        </div>
        </>
    );
  }
  
  export default User;