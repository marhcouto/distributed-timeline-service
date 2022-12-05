import React, { useState } from "react";

export default function CreatePost(props) {
    const [postText, setPostText] = useState("");
     
    const handleChange = (event) => {
        console.log(event.target.value)
        setPostText(event.target.value)
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        //todo post
      }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div className="feed p-2">
                    <div className="d-flex form-group flex-row justify-content-between align-items-center p-2 bg-white border">
                        <label className="form-group mt-2"> Name           
                        <textarea className="form-control mt-3" rows="4" cols="105" name="postText" value={postText} onChange={handleChange} placeholder="What's on your mind?" />
                        <button className="btn btn-success w-100 mt-2" type="submit">Post message</button> 
                        </label>
                    </div>
                    <hr/>                                                       
                </div>
            </div>
        </form>
    );
}
