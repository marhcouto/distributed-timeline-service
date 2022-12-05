import React from "react";
import PropTypes from "prop-types";
import { Feed, Icon } from 'semantic-ui-react';
// import { format } from "date-fns";

Post.propTypes = {
    post: PropTypes.object.isRequired,
  };

export default function Post(props) {
    const post = props.post;

    // const getPublishPostDate = (dateString) => {
    //     const publishDate = new Date(dateString);
    //     return format(publishDate, "D/MM/YYYY HH:mm");
    // }

    return (
      // <Feed.Event>
      // <Feed.Content>
      //   <Feed.Summary>
      //     <a>{post.user}</a> posted
      //     <Feed.Date>{post.createdAt}</Feed.Date>
      //   </Feed.Summary>
      //   <Feed.Extra text>
      //     {post.text}
      //   </Feed.Extra>
      //   <Feed.Meta>
      //     <Feed.Like>
      //       <Icon name='like' />5 Likes
      //     </Feed.Like>
      //   </Feed.Meta>
      // </Feed.Content>
      // </Feed.Event>
          <div>
            <div className="feed py-2"></div>
            <div className="bg-white border mt-2">
              <div className="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                <div className="d-flex flex-row align-items-center feed-text px-2 py-2"><img className="rounded-circle" src="https://imgur.com/V4RclNb.jpg" width="45"/>
                    <div className="d-flex flex-column flex-wrap px-2">
                      <span className="font-weight-bold">{post.user}</span>
                      <span className="text-black-50 time">{post.createdAt}</span>
                    </div>
                </div>
              </div>
              <div className="p-2 px-3"><span>{post.text}</span></div>
            </div>
          </div>
    );

}