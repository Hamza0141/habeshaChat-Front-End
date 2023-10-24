import { useContext } from "react";
import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { ImagePoket } from "../../context/ImageStore";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
    const { getImageUrl } = useContext(ImagePoket);


  const { data: suggestionData } = useQuery(["users", currentUser.id], () => {
    return makeRequest.get(`/users/${currentUser.id}`).then((res) => {
      return res.data;
    });
  });

    const { data: friendsdata } = useQuery(["friends", currentUser.id], () => {
      return makeRequest.get(`/users/friends/${currentUser.id}`).then((res) => {
        return res.data;
      });
    });
      const { data: followerData } = useQuery(
        ["followers", currentUser.id],
        () => {
          return makeRequest
            .get(`/users/followers/${currentUser.id}`)
            .then((res) => {
              return res.data;
            });
        }
      );
   


  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="SuggestionsList">
              {suggestionData?.map((post) => (
                <div className="Suggestions" key={post.id}>
                  <Link to={`/profile/${post.id}`}>
                    <img src={getImageUrl(post.profile_pic)} />
                  </Link>
                  <p>
                    <span>{post.name}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="item">
          <span>Followers</span>
          {followerData?.map((followers) => (
            <div className="user">
              <div className="userInfo">
                <Link to={`/profile/${followers.id}`}>
                  <img src={getImageUrl(followers.profile_pic)} />
                </Link>
                <p>
                  <span>{followers.name}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="item">
          <span>Friends</span>
          {friendsdata?.map((data) => (
            <div className="user">
              <div className="userInfo" key={data.id}>
                <Link to={`/profile/${data.id}`}>
                  <img src={getImageUrl(data.profile_pic)} alt="" />
                </Link>
                <div className="online" />
                <span>{data.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
