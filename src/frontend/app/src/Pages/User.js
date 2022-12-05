import Post from '../Components/post';
import UserCard from '../Components/userCard';


function User() {
    return (
        <><div className="App">
            <UserCard></UserCard>
            <Post post={{user:"MIguel", text:"grande golo de portugal!", createdAt:'02/12/2022 15:05'}} />
        </div></>
    );
  }
  
  export default User;