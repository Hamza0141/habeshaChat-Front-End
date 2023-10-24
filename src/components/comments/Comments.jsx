import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import makeRequest from "../../axios";
import moment from "moment";
import { ImagePoket } from "../../context/ImageStore";


const Comments = ({ post_id }) => {
  const [description, setDescription] = useState("");
   const [errdescription, seterrdescription] = useState("");
  const { currentUser } = useContext(AuthContext);
    const { getImageUrl } = useContext(ImagePoket);
  const { isLoading, error, data } = useQuery(["comments", post_id], () =>
    makeRequest.get("/comments?post_id=" + post_id).then((res) => {
      return res.data;
    })
  );
  console.log(data);

  const QueryClient = useQueryClient();
  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/add-comments", newComment);
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["comments"]);
      },
    }
  );


  const handleClick = async (e) => {
    e.preventDefault();

    // Check if the description is empty
    if (!description) {
      // Display an error message or take some other action
      seterrdescription("Comment is required");
      return; // Exit the function if the description is empty
    }

    // If description is not empty, proceed with the mutation
    mutation.mutate({ description: description, post_id: post_id });
    setDescription("");
    seterrdescription("")
  };


  return (
    <div className="comments">
      <div className="write">
        <img src={getImageUrl(currentUser.profile_pic)} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            seterrdescription("");
          }}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {errdescription.length > 0 && (
        <p style={{ color: "red" }}>{errdescription}</p>
      )}
      {isLoading
        ? "Loading"
        : data.map((comment) => (
            <div className="comment">
              <img src={getImageUrl(comment.profile_pic)} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.description}</p>
              </div>
              <span className="date">
                {moment(comment.created_date).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
