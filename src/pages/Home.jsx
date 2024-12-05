import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import CreatePost from './CreatePost'
import axios from 'axios'
import { formatDistanceToNow } from'date-fns';
import Slider from 'react-slick';
import { FaHeart } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import { Button, Modal } from 'antd';


const Home = () => {
  let userStore = useSelector((state)=>state.user)
console.log(userStore)

const [selectedPost,setselectedPost ] = useState(false);
console.log(selectedPost)
const commentClicked = (obj)=>{
  // console.log(obj)
  setselectedPost(obj)
  // showModal(true)
  setIsModalOpen(true)
}

const [AllPost, setAllPost] = useState([]);

const getAllUserPost = async()=>{
let res = await axios.get('https://blogapp-anlu.onrender.com/posts/getAllpost')
let data = res.data
setAllPost(data.post)
// console.log(data.post)

}
useEffect(()=>{
  getAllUserPost()
},[])

const settings = {
  dots: true,              // Show dots for navigation
  infinite: true,          // Infinite loop of slides
  speed: 500,              // Transition speed
  slidesToShow: 1,         // Show one slide at a time
  slidesToScroll: 1,       // Scroll one slide at a time
  autoplay: true,          // Autoplay the slider
  autoplaySpeed: 3000,     // Autoplay speed (3 seconds)
};

const handleLikes = async(postId)=>{
// console.log(postId)
let res = await axios.get(`https://blogapp-anlu.onrender.com/posts/like/${postId}`,{
  headers:{
    'Authorization':userStore.token
  }
})
let data = res.data;
console.log(data)
getAllUserPost()
}


const [commentValue, setcommentValue] = useState('');

const handleChangeComment=(e)=>{
let value = e.target.value;
console.log(value)
setcommentValue(value)
}

const handleAddComment = async() => {

  

  let res = await axios.post(`https://blogapp-anlu.onrender.com/posts/comment/${selectedPost._id}`,{text:commentValue},{
    headers:{ 
      'Authorization':userStore.token
    }
   
  })

 
  let data = res.data;
  console.log(data)
  setcommentValue('');
  getAllUserPost()
  if (!commentValue.trim()){
    alert('Please enter a comment');
  } return;
};


const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    // getAllUserPost()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

// Scroll-to-Top Functionality
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (


    <div className='bg-red-300 '> 
<div className=''><CreatePost getAllUserPost = {getAllUserPost}  /></div>

<div className='grid grid-cols-1 gap-4 mx-2  sm:grid-cols-2 lg:grid-cols-3 mt-28'> 

 {AllPost.map((ele,i)=>{
  return <div key={i} className="max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
    
    
      {ele.file.length > 1 ? (
        <Slider {...settings}>
          {ele.file.map((data, index) => (
            <div key={index}>
              {data.resource_type === 'image' ? (
                <img
                  className="object-contain w-full h-64  "
                  src={data.url}
                  alt={`media-${index}`}
                />
              ) : (
                <video  
                  className="object-contain w-full h-64  "
                  controls
                  src={data.url}
  //                 onContextMenu={(e) => e.preventDefault()}
  // style={{ pointerEvents: "none" }}
                  alt={`media-${index}`}
                />
              )}
            </div>
          ))}
        </Slider>
      ) : (
        ele.file.map((data, index) => (
          <div key={index}>
            {data.resource_type === 'image' ? (
              <img
                className="object-contain w-full h-64 bg-cover "
                src={data.url}
                alt={`media-${index}`}
              />
            ) : (
              <video
                className="object-contain w-full h-64 bg-cover "
                controls
                src={data.url}
  //               onContextMenu={(e) => e.preventDefault()} //its help to stop the right click option to help disabled download option in page.
  // style={{ pointerEvents: "none" }}
                alt={`media-${index}`}
              />
            )}
          </div>
        ))
      )}
      <hr className='border border-black h-1 bg-black my-1' />
      <div className="icons flex  text-gray-500  gap-5 mx-2 ">
   <div className='flex gap-4 mx-2'>
 <div>
 <span> <sup>{ele.likes.length}</sup><FaHeart onClick={()=>handleLikes(ele._id)} color={ele.likes.includes(userStore.user._id)?'red':''} size={30} className='cursor-pointer' /></span>
 {/* <p>Likes</p> */}
 </div>
 <div className='mt-6'>
 <Button type="primary" >
 <span><LiaCommentsSolid onClick={()=>commentClicked(ele)} className='cursor-pointer'  size={30}/></span>
 {/* <p>Comments</p> */}
      </Button>
 

 </div>

</div>
 </div>
  <div className="p-6">
    <div>
      <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400 truncate">{ele.title}</span>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate">{ele.description}</p>
    </div>
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center ">
          <img className=" bg-center h-10 w-10 rounded-full" src={ele.userId.profilePic} alt="Avatar" />
          <a href="#" className="mx-2 font-semibold text-gray-700 dark:text-gray-200 " tabIndex={0} role="link">{ele.userId.name}</a>
        </div> 
         <span className="mx-1  text-xs text-gray-600 dark:text-green-300 truncate 
">{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</span>
      </div> 
    </div>
  </div>
</div>
 })}

 </div>

 {/* comments section */}
 
 
    
      <Modal title="Comments" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} getContainer={false}>
     <div className="h-64 flex flex-col items-center bg-gray-100 py-8 px-4 overflow-y-scroll ">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 ">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Leave a Comment</h1>
       <div className='flex items-center gap-2'>
       <img className='w-10 h-10 rounded-full' src={userStore.user?.profilePic} alt="" />
        <textarea
          rows="2"
          placeholder="Write your comment here..."
          className="w-full border border-gray-500 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChangeComment}
          value={commentValue}
        />
       </div>
        <button
          onClick={handleAddComment}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Post Comment
        </button>
      </div>
      <div className="w-full max-w-2xl mt-6">
        {selectedPost?.comments?.length > 0 ? (
          selectedPost.comments.sort((a,b) =>new Date(b.createdAt) - new Date(a.createdAt)).map((obj) =>(
            <div
              key={obj._id}
              className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className=''>
                <div className='flex gap-3  items-center'>
                <img className='w-10 h-10 rounded-full' src={obj.user.profilePic} alt="" />
                
                <p className="font-semibold text-gray-800">{obj.user.name}</p>
                </div>
                <p className="text-gray-600">{obj.text}</p>
                <span className="mx-1  text-xs text-gray-600 dark:text-green-300 truncate 
           ">{formatDistanceToNow(obj.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No comments yet. Be the first to comment!
          </p>
          
        )}
        
      </div>
    </div>
      </Modal>


      

      {/* Scroll-to-Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          ↑
        </button>
      )}
    </div>
    
  )
}
export default Home
