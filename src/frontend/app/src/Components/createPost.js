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
            <div className="form-group">
                <div className="form-group">
                    <label className="form-group mt-2">
                    Name
                    <textarea className="form-control mt-2" rows="4" cols="50" name="postText" value={postText} onChange={handleChange} placeholder="Insert your message" />
                    </label>
                </div>
                <div className="form-group">
                    <button className="btn btn-success w-100" type="submit">Post message</button> 
                </div>
                
            </div>
        </form>
    );
}
