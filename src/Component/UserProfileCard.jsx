import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import Slider from "react-slick";

// Slider settings
const settings = {
  dots: true,              // Show dots for navigation
  infinite: true,          // Infinite loop of slides (set to false for single image)
  speed: 500,              // Transition speed
  slidesToShow: 1,         // Show one slide at a time
  slidesToScroll: 1,       // Scroll one slide at a time
  autoplay: true,          // Autoplay the slider
  autoplaySpeed: 3000,     // Autoplay speed (3 seconds)
  arrows: true,            // Show next/prev arrows
};

const UserProfileCard = (props) => {
  const userStore = useSelector((state) => state.user);
  const userDetails = userStore.user;

  const [getPosts, setUserPost] = useState([]);
  // console.log(getPosts)


  //show total likes of user
  let likesLength = 0
  getPosts?.forEach((post)=>{
    likesLength =likesLength + post.likes.length
  })
  // console.log(likesLength)
  useEffect(()=>{
    props.getLikes(likesLength)

  })


  const UserPost = async () => {
    try {
      let res = await axios.get(
        `https://blogapp-anlu.onrender.com/posts/userPost/${userDetails._id}`
      );
      let data = res.data.posts;
      setUserPost(data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    UserPost();
  }, []);

  const handleLikes = async(postId)=>{
    // console.log(postId)
    let res = await axios.get(`https://blogapp-anlu.onrender.com/posts/like/${postId}`,{
      headers:{
        'Authorization':userStore.token
      }
    })
    let data = res.data;
    console.log(data)
    UserPost();
    }

  return (
    <div>
      <div className="grid gap-4 mx-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {getPosts.map((ele, index) => {
          const isSingleImage = ele.file.length === 1;  // Check if there's only one image/video

          return (
            <div
              key={index}
              className="max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              {/* Render Slider only if there are multiple images */}
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
                // Directly show the image/video when there's only one
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

              {/* Content Section */}
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
      </div>
    </div>
  );
};

export default UserProfileCard;
