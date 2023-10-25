import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePoket } from "../../context/ImageStore";
import { useQuery } from "react-query";
import makeRequest from "../../axios";
import moment from "moment";

const LeftBar = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { getImageUrl } = useContext(ImagePoket);
  const toggleMessage = () => {
    setMessageOpen(!messageOpen);
  };

  // const QueryClient = useQueryClient();
  // Fetch existing messages
  const { data: messages, isLoading } = useQuery(["messages"], () =>
    makeRequest.get(`/messages/getSingleMessage`).then((res) => res.data)
  );
  console.log(messages);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={getImageUrl(currentUser.profile_pic)} alt="" />
            <Link to={`/profile/${currentUser.id}`}>
              <span>{currentUser.name}</span>
            </Link>
          </div>
          <div className="item">
            <Link to={`/profile/${currentUser.id}`}>
              <img src={Friends} alt="" />
              <span className="profileHolder">Profile</span>
            </Link>
          </div>

          <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
        <div className="item">
          <img src={Messages} alt="" />
          <spn className="massage-note" onClick={toggleMessage}>
            Messages
          </spn>
          {messageOpen &&
            (isLoading
              ? "Loading..."
              : messages?.map((msg, index) => (
                  <div key={index} className="messageWrapper">
                    <p className="message-Holder">
                      <Link to={`/profile/${msg.sender_id}`}>
                        {msg.message_content}
                      </Link>
                      <br />
                    </p>
                    <div className="date">
                      <span>{moment(msg.message_time).fromNow()}</span>
                      <span>{msg.sender_name}</span>
                    </div>
                  </div>
                )))}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
