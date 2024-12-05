import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import menu from "../assets/menu.png";
import close from "../assets/close.png";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { Button, Modal } from 'antd';
import UserProfileCard from "../Component/UserProfileCard";

const Profile = (props) => {
  let userStore = useSelector((state) => state.user);
  console.log(userStore);

  let followers = userStore.user.followers;
  // console.log(followers)
  let followings = userStore.user.followings;
  // console.log(followings)

  let userDetails = userStore.user;

  const [CloseForm, setCloseForm] = useState(false);

  const [details, setdetails] = useState({
    name: userDetails.name ? userDetails.name : "",
    email: userDetails.email ? userDetails.email : "",
    password: userDetails.password ? userDetails.password : "",
    bio: userDetails.bio ? userDetails.bio : "",
    address: userDetails.address ? userDetails.address : "",
  });

  const [showFollowersModal, setShowFollowersModal] = useState(false); // State for Followers modal
  const [showFollowingModal, setShowFollowingModal] = useState(false); // State for Following modal
  // console.log(details)

  const handleForm = () => {
    // console.log("hello");
    setCloseForm(true);
  };

  const handleCancel = () => {
    setCloseForm(false);
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setdetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.put(
      `https://blogapp-anlu.onrender.com/users/update/${userDetails._id}`,
      details
    );
    let data = res.data;
    // console.log(data)
    if (data.success) {
      props.getUserDetails();
    }
    if (res.data.success) {
      toast.success(res.data.msg, { position: "top-center", theme: "dark" });
    } else {
      toast.error(res.data.msg, { position: "top-center", theme: "dark" });
    }
    setCloseForm(false);
  };

  const [userPics, setuserPics] = useState({
    coverPic: "",
    profilePic: "",
  });
  // console.log(userPics)

  const handleCoverChanger = (e) => {
    let file = e.target.files[0];
    // console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      // console.log(reader.result)
      setuserPics({ ...userPics, coverPic: reader.result });

      let res = await axios.put(
        `https://blogapp-anlu.onrender.com/users/update/${userDetails._id}`,
        { coverPic: reader.result },
        { profilePic: reader.result }
      );

      let data = res.data;
      if (data.success) {
        toast.success(res.data.msg, { position: "top-center", theme: "dark" });
      } else {
        toast.error(res.data.msg, { position: "top-center", theme: "dark" });
      }
    };

    reader.onerror = () => {
      // console.log(reader.error);
    };
  };

  const handleProfileChanger = (e) => {
    let file = e.target.files[0];
    // console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      // console.log(reader.result);
      setuserPics({ ...userPics, profilePic: reader.result });

      let res = await axios.put(
        `https://blogapp-anlu.onrender.com/users/update/${userDetails._id}`,
        { profilePic: reader.result }
      );

      let data = res.data;
      if (data.success) {
        toast.success(res.data.msg, { position: "top-center", theme: "dark" });
      } else {
        toast.error(res.data.msg, { position: "top-center", theme: "dark" });
      }
    };
    reader.onerror = () => {
      // console.log(reader.error);
    };
  };

  //show total likes of user
  const [countLikes, setcountLikes] = useState("");

  const getLikes = (ans) => {
    // console.log(ans)
    setcountLikes(ans);
  };


  

  return (
    <div className="bg-pink-300 relative overflow-hidden h-[] ">
      {/* profile page */}
      <div className="relative  w-full max-w-screen-lg mx-auto p-4">
        {/* Cover Picture */}
        <div
          className=" relative w-full h-60 bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: `url(${
              userPics?.coverPic ? userPics.coverPic : userStore.user.coverPic
            })`,
          }}
        >
          <div className="absolute right-1 top-[87%]">
            <label htmlFor="id">
              <FaCamera className="text-red-400 cursor-pointer" size={30} />
            </label>
            <input onChange={handleCoverChanger} hidden id="id" type="file" />
          </div>
        </div>
        <img
          onClick={handleForm}
          className="absolute right-5 top-5 cursor-pointer"
          src={menu}
          alt=""
        />
        {/* for update form */}
        {/* Profile Picture */}
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg">
          <img
            src={
              userPics?.profilePic
                ? userPics.profilePic
                : userStore.user.profilePic
            }
            alt="Profile"
            className="w-full h-full object-fill rounded-full "
          />

          <div className="absolute bottom-0 right-0">
            <label htmlFor="Profile">
              <FaCamera className="text-red-400 cursor-pointer" size={30} />
            </label>
            <input
              onChange={handleProfileChanger}
              hidden
              id="Profile"
              type="file"
            />
          </div>
        </div>

        {/* Name and Address */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold">{userDetails.name}</h2>
          <p className="text-xl mt-2">{details.address}</p>
          <p className="text-xl mt-2">
            {userDetails.bio ? userDetails.bio : "Enter a bio"}
          </p>
        </div>

        {/* Followers and Following */}
        <div className="mt-6 flex justify-center gap-10 text-center">
          <div className="">
            {/* <h3 className="font-semibold">Likes</h3> */}
            <p>
              <FcLike className="" size={30} />
              <sup>{countLikes}</sup>
            </p>
          </div>
          <div>
            {/* <h3 className="font-semibold">Followers</h3> */}
            <button
            onClick={() => setShowFollowersModal(true)} // Open Followers Modal
            className=" h-8 w-[90px] bg-red-500 rounded-md font-semibold text-blue-500 list-none no-underline"
          >
            Followers
          </button>

            <p>{followers?.length}</p>
          </div>
          <div>
            {/* <h3 className="font-semibold">Following</h3> */}
            <button
            onClick={() => setShowFollowingModal(true)} // Open Following Modal
            className="font-semibold text-blue-500  h-8 w-[90px] no-underline bg-red-500 rounded-md"
          >
            Following
          </button>

            <p>{followings?.length}</p>
          </div>
        </div>
      </div>
<hr className="border-2 border-black mb-2"  />
      {/* postFetch */}
      
      <Modal
        title="Followers"
        open={showFollowersModal}
        onOk={() => setShowFollowersModal(false)}
        onCancel={() => setShowFollowersModal(false)}
        getContainer={false}
        
        // Close Modal
        // footer={null}
        
      >
        {followers.map((follower, index) => (
          <div key={index} className="flex items-center gap-3 py-2">
            <img
              className="w-10 h-10 rounded-full"
              src={follower.profilePic}
              alt={follower.name}
            />
            <p>{follower.name}</p>
          </div>
        ))}
      </Modal>

      {/* Following Modal */}
      <Modal
        title="Following"
        open={showFollowingModal}
        onOk={() => setShowFollowingModal(false)}
        onCancel={() => setShowFollowingModal(false)}
        getContainer={false}
        // Close Modal
        // footer={null}
      >
        {followings.map((following, index) => (
          <div key={index} className="flex items-center gap-3 py-2">
            <img
              className="w-10 h-10 rounded-full"
              src={following.profilePic}
              alt={following.name}
            />
            <p>{following.name}</p>
          </div>
        ))}
      </Modal>

      

      <UserProfileCard getLikes={getLikes} />

      {/* update page */}
      {CloseForm && (
        <div className=" absolute max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-pink-400 top-0 right-[40%]  z-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Update Your Profile
          </h2>
          <img
            onClick={handleCancel}
            className="absolute right-2 top-2 size-[15px] cursor-pointer"
            src={close}
            alt=""
          />
          {/* <form > */}
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="name"
              value={details.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={details.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              disabled
              type="email"
              id="email"
              name="email"
              value={details.email}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
        

          {/* Bio */}
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={details.bio}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
          </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-[48%]  py-2 px-4 mx-1 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save{" "}
          </button>

          <button
            onClick={handleCancel}
            type="submit"
            className="w-[48%] py-2  bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Cancel
          </button>
          {/* </form> */}
        </div>
      )}
    </div>
  );
};

export default Profile;
