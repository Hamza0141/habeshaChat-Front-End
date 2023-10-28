import { useContext, useState } from "react";
import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ImagePoket } from "../../context/ImageStore";

const RightBar = () => {
  const [suggestionOpen, setSuggestionOpen] = useState(false);
    const [searchPeople, setSearchPeople] = useState("");
  const [friendsOpen, setFriendsOpen] = useState(false);
  
  const toggleSuggestions = () => {
    setSuggestionOpen(!suggestionOpen);
  };
  const toggleFriends = () => {
    setFriendsOpen(!friendsOpen);
  };
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
  const { data: followerData } = useQuery(["followers", currentUser.id], () => {
    return makeRequest.get(`/users/followers/${currentUser.id}`).then((res) => {
      return res.data;
    });
  });

  return (
    <div className="rightBar">
      <div className="container">
        <div className="userListWrapper" onClick={toggleSuggestions}>
          Suggestions
        </div>

        {suggestionOpen && (
          <div className="item">
            <input
              type="text"
              className="searchTitle"
              Placeholder="Search People ..."
              onChange={(e) => setSearchPeople(e.target.value)}
            />
            {suggestionData
              ?.filter((users) => {
                if (searchPeople === "") {
                  return true;
                } else if (
                  users.name.toLowerCase().includes(searchPeople.toLowerCase())
                ) {
                  return true; // Show users whose names match the search input
                }
                return false; // Hide other users
              })
              ?.map((users) => (
                <div className="user">
                  <div className="userInfo" key={users.id}>
                    <Link to={`/profile/${users.id}`}>
                      <img src={getImageUrl(users.profile_pic)} alt="" />
                    </Link>
                    <p>
                      <span>{users.name}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="item" style={{ marginTop: "10px" }}>
          Followers {followerData?.length > 0 && followerData?.length}
          {followerData?.map((followers) => (
            <div className="user">
              <div className="userInfo">
                <Link to={`/profile/${followers.id}`}>
                  <img src={getImageUrl(followers.profile_pic)} alt="" />
                </Link>
                <p>
                  <span>{followers.name}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="userListWrapper" onClick={toggleFriends}>
          Friends {friendsdata?.length > 0 && friendsdata?.length}
        </div>
        {friendsOpen && (
          <div className="item">
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
        )}
      </div>
    </div>
  );
};

export default RightBar;
