import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { Link, useLocation } from "react-router-dom";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import UserProfileCard from "../Component/UserProfileCard";

const FriendProfile = (props) => {
  let userStore = useSelector((state)=>state.user)
  // console.log(userStore)
  let orignalUser = userStore.user
  console.log(orignalUser)

  let location = useLocation("");
  console.log(location)
  let userId = location.state;
  console.log(userId)

  const [userDetails, setuserDetails] = useState();

  async function getUserDetails() {
    let res = await axios.get(
      `https://blogapp-anlu.onrender.com/users/getSingleUser/${userId}`
    );
    let data = res.data;
    // console.log(data);
    setuserDetails(data.user);
  }
  useEffect(() => {
    getUserDetails();
  }, [userId]); // to show data of user in every click

  //show total likes of user
  const [countLikes, setcountLikes] = useState("");

  // const getLikes = (ans) => {
  //   // console.log(ans)
  //   setcountLikes(ans);
  // };
  const settings = {
    dots: true,              // Show dots for navigation
    infinite: true,          // Infinite loop of slides
    speed: 500,              // Transition speed
    slidesToShow: 1,         // Show one slide at a time
    slidesToScroll: 1,       // Scroll one slide at a time
    autoplay: true,          // Autoplay the slider
    autoplaySpeed: 3000,     // Autoplay speed (3 seconds)
  };
 

  const handleFollow =async ()=>{
    let res = await axios.get(`https://blogapp-anlu.onrender.com/users/follow/${userId}`,{
        headers:{
            'Authorization':userStore.token
        }
        
    })
    let data = res.data
    // console.log(data)

    if(data.success){
       props.getUserDetails();
       getUserDetails()
    }

    if(data.success){
        toast.success(data.msg,{position:"top-center",theme:"dark"})
      }
      else{
        toast.error(data.msg,{position:"top-center",theme:"dark"})
        console.log(data.msg)
      }
   if(data.success){
    // getUserDetails();
   }
  }
 
  const [getPosts, setUserPost] = useState([]);

  const UserPost = async () => {
    try {
      let res = await axios.get(
        `https://blogapp-anlu.onrender.com/posts/userPost/${userId}`
      );
      let data = res.data.posts;
      setUserPost(data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    UserPost();
  }, [userId]);



  const handleLikes = async(postId)=>{
    // console.log(postId)
    let res = await axios.get(`https://blogapp-anlu.onrender.com/posts/like/${postId}`,{
      headers:{
        'Authorization':userStore.token
      }
    })
    let data = res.data;
    // console.log(data)
    UserPost();
    }

const isFollowing = orignalUser.followings?.some(
  (following) => following._id === userId
);
// console.log(isFollowing)

  return (
    <div className="bg-pink-300 relative">
      {/* profile page */}
      <div className="relative  w-full max-w-screen-lg mx-auto p-4">
        <div
          className=" relative w-full h-60 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${userDetails?.coverPic})` }}
        ></div>

        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg">
          <img
            src={userDetails?.profilePic}
            alt="Profile"
            className="w-full h-full object-fill rounded-full "
          />
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold">{userDetails?.name}</h2>
          <p className="text-xl mt-2">
            {userDetails?.bio ? userDetails.bio : "Enter a bio"}
          </p>
          
         
         {!isFollowing&&<button  onClick={handleFollow} className="h-8 w-2/12 bg-red-400 mt-2 mx-2">Follow</button>}
         {isFollowing &&<button onClick={handleFollow} className="h-8 w-2/12 bg-red-400 mt-2 mx-2">UnFollow</button>}

         <Link to = '/chat' state={{friend:userDetails}}  className="bg-blue-400 text-white px-3 py-1.5 rounded-md hover:bg-green-500">Chat</Link>
        </div>

        

        <div className="mt-6 flex justify-center gap-10 text-center">
          <div className="">
            <h3 className="font-semibold">Likes</h3>
            <p>
              <FcLike className="" size={30} />
              <sup>{countLikes}</sup>
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Followers</h3>
            <p>{userDetails?.followers?.length}</p>
          </div>
          <div>
            <h3 className="font-semibold">Following</h3>
            <p>{userDetails?.followings?.length}</p>
          </div>
        </div>
      </div>

      {/* <UserProfileCard getLikes={getLikes}/> */}
      {isFollowing&&<div>
     {getPosts.length >0? <div className="grid gap-4 mx-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {getPosts.map((ele, index) => {
          const isSingleImage = ele.file.length === 1; 

          return (
            <div
              key={index}
              className="max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              
              {ele.file.length > 1 ? (
                <Slider {...settings}>
                  {ele.file.map((data, i) => (
                    <div key={i} className="w-full">
                      {data.resource_type === "image" ? (
                        <img
                          className="object-contain w-full h-64"
                          src={data.url}
                          alt={`media-${index}-${i}`}
                        />
                      ) : (
                        <video
                          className="object-contain w-full h-64"
                          controls
                          src={data.url}
                          alt={`media-${index}-${i}`}
                        />
                      )}
                    </div>
                  ))}
                </Slider>
              ) : (
               
                <div className="w-full">
                  {ele.file.map((data, i) => (
                    <div key={i}>
                      {data.resource_type === "image" ? (
                        <img
                          className="object-contain w-full h-64"
                          src={data.url}
                          alt={`media-${index}-${i}`}
                        />
                      ) : (
                        <video
                          className="object-contain w-full h-64"
                          controls
                          src={data.url}
                          alt={`media-${index}-${i}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

<hr className='border border-black h-1 bg-black my-1' />
      <div className="icons flex  text-gray-500  gap-5 mx-2 ">
   <div className='flex gap-4 mx-2'>
 <div>
 <span > <sup>{ele.likes.length}</sup><FaHeart onClick={()=>handleLikes(ele._id)} color={ele.likes.includes(userStore.user._id)?'red':''} size={30} className="cursor-pointer"/></span>
 <p>Likes</p>
 </div>
 <div className='mt-6'>
 <span><LiaCommentsSolid  size={30}/></span>
 <p>Comments</p>
 </div>

</div>
 </div>

              
              <div className="p-6">
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400 truncate">
                    {ele.title}
                  </span>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate">
                    {ele.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>: <p className="font-serif bg-black text-2xl h-10 flex justify-center items-center text-green-600">No Post To Show</p>}
    </div>}
    </div>
  );
};

export default FriendProfile;
