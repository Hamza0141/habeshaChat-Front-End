// Post.js
import React, { useContext, useState } from "react";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { AuthContext } from "../../context/authContext";
import { ImagePoket } from "../../context/ImageStore";

import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import makeRequest from "../../axios";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
    const { getImageUrl } = useContext(ImagePoket);


  // Fetch comments data using React Query
  const {
    isLoading: commisLoading,
    error: commerror,
    data: commdata,
  } = useQuery(["comments", post.id], () =>
    makeRequest.get("/comments?post_id=" + post.id).then((res) => {
      return res.data;
    })
  );


  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?post_id=" + post.id).then((res) => {
      return res.data;
    })
  );
  const QueryClient = useQueryClient();
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?post_id=" + post.id);
      return makeRequest.post("/likes", { post_id: post.id });
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const DeleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = async () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    DeleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={getImageUrl(post.profile_pic)} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">
                {moment(post.created_date).fromNow()}
              </span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.user_id === currentUser.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={getImageUrl(post.image)} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading..."
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commdata?.length}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments post_id={post.id} commentsData={commdata} />}
      </div>
    </div>
  );
};

export default Post;
