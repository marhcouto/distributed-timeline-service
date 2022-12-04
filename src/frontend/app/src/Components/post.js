import React from "react";
import PropTypes from "prop-types";
import { Feed, Icon } from 'semantic-ui-react';
// import { format } from "date-fns";

Post.propTypes = {
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  };

export default function Post(props) {
    const post = props;

    // const getPublishPostDate = (dateString) => {
    //     const publishDate = new Date(dateString);
    //     return format(publishDate, "D/MM/YYYY HH:mm");
    // }

    return (
      <Feed.Event>
      <Feed.Content>
        <Feed.Summary>
          <a>{post.user}</a> posted
          <Feed.Date>{post.createdAt}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          {post.text}
        </Feed.Extra>
        <Feed.Meta>
          <Feed.Like>
            <Icon name='like' />5 Likes
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
      </Feed.Event>
    );

}