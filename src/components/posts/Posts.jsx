import makeRequest from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "react-query";

const Posts = ({ user_id }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?user_id=" + user_id).then((res) => {
      return res.data;
    })
  );

  console.log(data);

  console.log(user_id);
  return (
    <div className="posts">
      {error
        ? "something went wrong!"
        : isLoading
        ? "Loading..."
        : data?.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
