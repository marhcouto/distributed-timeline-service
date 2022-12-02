import Post from '../Components/Post';
import TopNavbar from '../Components/navbar';
import UserCard from '../Components/userCard';


function User() {
    return (
        <><TopNavbar></TopNavbar><div className="App">
            <UserCard></UserCard>
        </div></>
    );
  }
  
  export default User;