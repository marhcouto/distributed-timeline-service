import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { format } from "date-fns";

Post.propTypes = {
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  };

export default function Post(props) {
    const post = props;

    const getPublishPostDate = (dateString) => {
        const publishDate = new Date(dateString);
        return format(publishDate, "D/MM/YYYY HH:mm");
    }

    return (
        <Card className="post">
        <Typography className="post__title" variant="subtitle1">
          {post.user}
        </Typography>
        <Typography className="post__date" variant="subtitle2">
          {getPublishPostDate(post.createdAt)}
        </Typography>
        <Typography className="post__text" component="p">
          {post.text}
        </Typography>
      </Card>
    );

}