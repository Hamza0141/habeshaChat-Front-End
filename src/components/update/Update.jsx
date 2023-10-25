
import React, { useEffect, useState } from "react";
import "./update.scss";
import makeRequest from "../../axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Update({ setopenUpdate, user }) {
  const [text, setText] = useState({
    name: "",
    city: "",
    website: "",
    facebook_address: "",
    instagram_address: "",
    twitter_address: "",
    linkedin_address:"",

  });

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

const upload = async (file) => {
  try {
      toast.loading("Profile Uploading...");
    const formData = new FormData();
    formData.append("image", file);
    const res = await makeRequest.post("/upload", formData);
          toast.dismiss();
        toast.success("Profile Uploaded");
    return res.data.imageName;
  } catch (err) {
    console.error(err);
     toast.success("image size error")
    return null;
  }
};
  const QueryClient = useQueryClient();
  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["user"]);
      },
    }
  );

 useEffect(() => {
   // Update the component's text state when the user prop changes
   setText({
     name: user.name,
     city: user.city,
     website: user.website,
     facebook_address: user.facebook_address,
     instagram_address: user.instagram_address,
     twitter_address: user.twitter_address,
     //  linkedin_address: user.linkedin_address,
   });
 }, [user]);

  const handleChange = (e) => {
    setText((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    let coverUrl = cover ? await upload(cover) : user.cover_pic;
    let profileUrl = profile ? await upload(profile) : user.profile_pic;

    mutation.mutate({
      ...text,
      cover_pic: coverUrl,
      profile_pic: profileUrl,
    });
    setopenUpdate(false);
  };

  return (
    <div className="update">
      <div className="update__overlay">
        <form className="update__form" onSubmit={handleClick}>
          <input
            type="file"
            className="update__file-input"
            onChange={(e) => setCover(e.target.files[0])}
          />
          <input
            type="file"
            className="update__file-input"
            onChange={(e) => setProfile(e.target.files[0])}
          />
          <label>Name</label>
          <input
            type="text"
            className="update__text-input"
            name="name"
            onChange={handleChange}
            placeholder="Name"
            value={text.name}
            required
          />
          <label>City</label>
          <input
            type="text"
            className="update__text-input"
            name="city"
            onChange={handleChange}
            placeholder="City"
            value={text.city}
          />
          <label>Website</label>
          <input
            type="text"
            className="update__text-input"
            name="website"
            onChange={handleChange}
            placeholder="Website"
            value={text.website}
          />
          <label>Facebook</label>
          <input
            type="text"
            className="update__text-input"
            name="facebook_address"
            onChange={handleChange}
            placeholder="facebook_address"
            value={text.facebook_address}
          />
          <label>Instagram</label>
          <input
            type="text"
            className="update__text-input"
            name="instagram_address"
            onChange={handleChange}
            placeholder="instagram_address"
            value={text.instagram_address}
          />
          <label>Twitter</label>
          <input
            type="text"
            className="update__text-input"
            name="twitter_address"
            onChange={handleChange}
            placeholder="twitter_address"
            value={text.twitter_address}
          />
          <label>LinkedIn</label>
          <input
            type="text"
            className="update__text-input"
            name="linkedin_address"
            onChange={handleChange}
            placeholder="linkedin.com/in/example-example-e12345/"
            value={text.linkedin_address}
          />
          <button className="update__submit-button" type="Submit">
            Update
          </button>
        </form>
        <button
          className="update__cancel-button"
          onClick={() => setopenUpdate(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Update;
