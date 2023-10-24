import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Posts from "../../components/posts/Posts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import makeRequest from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import Message from "../../components/Message/Message";
import { ImagePoket } from "../../context/ImageStore";


const Profile = () => {
  const [openUpdate, setopenUpdate] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
  const { currentUser } = useContext(AuthContext);
    const { getImageUrl } = useContext(ImagePoket);
  const user_id = parseInt(useLocation().pathname.split("/")[2]);
  const navigate = useNavigate()


  const { isLoading, error, data } = useQuery("user", () =>
    makeRequest.get("/users/find/" + user_id).then((res) => {
      return res.data;
    })
  );
  console.log(data);
  const { isLoading: rsloading, data: relationshipData } = useQuery(
    "relationship",
    () =>
      makeRequest
        .get("/relationships?followed_user_id=" + user_id)
        .then((res) => {
          return res.data;
        })
  );

  const QueryClient = useQueryClient();
  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?user_id=" + user_id);
      return makeRequest.post("/relationships", { user_id: user_id });
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    if (relationshipData.includes(currentUser.id)) {
      // If the user is already following, unfollow
      mutation.mutate(true); // Pass true to indicate unfollow
    } else {
      // If the user is not following, follow
      mutation.mutate(false); // Pass false to indicate follow
    }
  };


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img
              src={getImageUrl(data.cover_pic)}
              alt=""
              className="cover"
            />
            <img
              src={getImageUrl(data.profile_pic)}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href={`http://facebook.com/${data.facebook_address}`}>
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href={`https://www.instagram.com/${data.instagram_address}`}>
                  <InstagramIcon fontSize="large" />
                </a>
                <a href={`https://twitter.com/${data.twitter_address}`}>
                  <TwitterIcon fontSize="large" />
                </a>
                <a href={data.linkedin_address}>
                  <LinkedInIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rsloading ? (
                  "loading..."
                ) : user_id === currentUser.id ? (
                  <button
                    onClick={() => {
                      setopenUpdate(true);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <>
                    <button onClick={handleFollow}>
                      {relationshipData.includes(currentUser.id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                    {/* Conditionally render the Message button */}
                    {relationshipData.includes(currentUser.id) && (
                      <button
                        onClick={() => {
                          setOpenMessage(true);
                          // navigate("/message");
                        }}
                      >
                        Message
                      </button>
                    )}
                    {openMessage && <Message />}
                  </>
                )}
              </div>
              <div className="right"></div>
            </div>
            <Posts user_id={user_id} />
          </div>
        </>
      )}
      {openUpdate && <Update setopenUpdate={setopenUpdate} user={data} />}
    </div>
  );
};

export default Profile;

