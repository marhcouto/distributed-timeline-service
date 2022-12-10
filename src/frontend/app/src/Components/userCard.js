import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import {
  MDBBtn,
} from "mdb-react-ui-kit";


export default function UserCard(props) {
  const [following, setFollowing] = useState(false)

  const getFollowing = async () => {
    try{
      const resTimeline = await fetch('http://localhost:5000/api/following/' + props.id)
      setFollowing(true);    
    }
    catch(err){
      console.log(err)
    }
  }  

  const handleClick = (event) => {
    if (following){
      fetch('http://localhost:5000/api/following/' + props.id,{
            method: 'DELETE',        
          }).then(res =>{
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
    }   
    else{
      fetch('http://localhost:5000/api/following/' + props.id,{
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
    getFollowing();
  }, []);

  return (
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
            {props.id}
          </Typography>
          <MDBBtn onClick={handleClick} type="submit" color = {following? "danger":"primary" } size='lg' rounded>{following? "Unfollow": "Follow"}</MDBBtn>     
        </CardContent>
      </Card>
  );
}
