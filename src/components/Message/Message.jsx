import { useContext, useState } from "react";
import "./Message.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "react-query";
import makeRequest from "../../axios";
import { useLocation } from "react-router-dom";

function Message() {
  const [message, setMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const followed_user_id = parseInt(useLocation().pathname.split("/")[2]);
  const QueryClient = useQueryClient();
  // Fetch existing messages
  const { data: messages, isLoading } = useQuery(
    ["messages", followed_user_id],
    () =>
      makeRequest
        .get(`/messages/getMessage?followed_user_id=${followed_user_id}`)
        .then((res) => res.data)
  );

  const mutation = useMutation(
    (newMessage) => {
      return makeRequest.post("/messages/addMessage?", newMessage);
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["messages", followed_user_id]);
      },
    }
  );

  const formatDate = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleTimeString(undefined, options);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ message: message, followed_user_id: followed_user_id });
    setMessage("");
  };

  return (
    <div className="message-container">
      <div className="Message__overlay">
        {isLoading
          ? "Loading..."
          : messages?.map((msg, index) => (
              <div
                key={index}
                className={` ${
                  msg.followers_user_id === currentUser.id
                    ? "currentUser-Message"
                    : "message"
                }`}
              >
                <p className="message-Holder">
                  {msg.message}
                  <br />
                  <span className="date">{formatDate(msg.created_date)}</span>
                </p>
              </div>
            ))}

        <form onSubmit={handleClick} className="message-form-rapper">
          <input
            type="text"
            className="input-message"
            placeholder="Enter your message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Message;
