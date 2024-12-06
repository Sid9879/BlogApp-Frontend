import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { Button, Modal } from 'antd';

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
    // console.log(data)
    UserPost();
    }

    const handleDeletePost =async(obj)=>{
      // console.log(obj)
      let res = await axios.delete(`https://blogapp-anlu.onrender.com/posts/delete/${obj._id}`)
      if(res.data.success){
        UserPost()
        toast.success(res.data.msg, { position: "top-center", theme: "dark" });
      }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setcurrentPost] = useState(null);
    // console.log(currentPost)
    const [updatedDetails, setupdatedDetails] = useState({title:"",description:""});
  const showModal = (post) => {
    setcurrentPost(post);
    setupdatedDetails({title:post.title,description:post.description})
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    try {
      const res2 = await axios.put(`https://blogapp-anlu.onrender.com/posts/update/${currentPost._id}`,updatedDetails,{
        headers:{
          Authorization:userStore.token
        }
      })
      if (res2.data.success) {
        toast.success("Post updated successfully!", { position: "top-center", theme: "dark" });
        UserPost(); // Refresh posts after update
        setIsModalOpen(false); // Close the modal
      } else {
        toast.error("Failed to update post", { position: "top-center", theme: "dark" });
      }
    } catch (error) {
      // console.error("Error updating post:", error);
      toast.error("An error occurred while updating the post", { position: "top-center", theme: "dark" });
    
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setcurrentPost(null)
  };

    
    
const handleinputChanger = (e)=>{
 const {name,value} = e.target;
 setupdatedDetails((prev)=>({...prev,[name]:value}));

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
              <div className="p-6 ">
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400 truncate">
                    {ele.title}
                  </span>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate">
                    {ele.description}
                  </p>
                </div>
                <div className="flex justify-center gap-2 mt-2 ">
                <button onClick={()=>handleDeletePost(ele)} className="w-28 rounded-md   h-8 bg-red-500">Delete</button>
                <Button 
  type="primary" 
  className="bg-green-400 w-28 h-8" 
  onClick={() => 
    showModal(ele)}
>
  Update
</Button>
      <Modal  title="Update Your Post" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} getContainer={false}>
      <div className="flex flex-col gap-2">
      <input name="title"  onChange={handleinputChanger} className="bg-red-300 w-full h-8 px-2" type="text" value={updatedDetails.title} />
      <input name="description" onChange={handleinputChanger} className="bg-red-300 w-full h-8 px-2" type="text" value={updatedDetails.description} />
      </div>
      </Modal>
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
