import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { formatDistanceToNow } from'date-fns';
import EmojiPicker from 'emoji-picker-react';
import { io } from "socket.io-client";
// import { theme } from 'antd';
import { toast } from "react-toastify";



const Chat = () => {
  let url = import.meta.env.VITE_DevelopementMode === 'test' ? "http://localhost:8080" : 'https://blogapp-anlu.onrender.com';
  const Endpoint = url;
const socketRef = useRef(null);
  // const Endpoint = "https://blogapp-anlu.onrender.com"
  // let socket = io(Endpoint, { transports: ['websocket'] });
  // Accessing user data from Redux store
  const userStore = useSelector((state) => state.user);
  const token = userStore.token;
  const user = userStore.user;
  // console.log(user)

  // Accessing friend's data from location state
  const location = useLocation();
  const friend = location.state.friend;
  // console.log(friend)

  // State to manage chat messages and current message input
  const [allChat, setAllChat] = useState([]);
  // console.log(allChat)
  const [currentMessage, setCurrentMessage] = useState('');

  // const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker visibility


  // Ref for the chat container to enable auto-scroll
  const messagesEndRef = useRef(null);

  // Fetch chat messages
  async function getChat() {
    try {
      const res = await axios.get(`${url}/message/getMessage/${friend._id}`, {
        headers: {
          Authorization: token,
        },
      });
      let data = res.data;
      if (data.success) {
        setAllChat(data.chat);
      }
   // Update chat messages
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  }

  // Scroll to the bottom of the chat when new messages are loaded
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allChat]);

  // Fetch chat messages when the component mounts
  useEffect(() => {
    getChat();
  }, []);

  // Handle input change
  const handleInputChanger = (e) => {
    let value = e.target.value
    // console.log(value)
    setCurrentMessage(value);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    socketRef.current.emit('sendMessage', {
      text: currentMessage,
      sender: user._id,
      reciever: friend._id
    });

    try {
      const res = await axios.post(
        `${url}/message/send/${friend._id}`,
        { text: currentMessage },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = res.data;
      if (data.success) {
        getChat(); // Refresh messages after sending
        setCurrentMessage(''); // Clear input
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    if (user?._id && !socketRef.current?.connected) {
      socketRef.current = io(Endpoint, { transports: ['websocket'] });
      socketRef.current.emit('addUser', user._id);
    }
  }, [user?._id]);




  const [arrivalMessage, setArrivalMessage] = useState(null);
  // console.log(arrivalMessage)
  
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('getMessage', ({ sender, text }) => {
        // console.log({ sender, text })
        setArrivalMessage({ sender: sender, reciever: user._id, text: text, createdAt: Date.now() });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setAllChat((prevChat) => [...prevChat, arrivalMessage]);
    }
  }, [arrivalMessage]);




  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker visibility
  const handleEmojiClick = (emojiData) => {
    setCurrentMessage((prevMessage) => prevMessage + emojiData.emoji); // Append the selected emoji to the existing text
  };

const handleMessageDelete = async()=>{
let res = await axios.delete(`https://blogapp-anlu.onrender.com/message/delete/${friend._id}`,{
  headers:{
    'Authorization':token
  }

})
console.log(res.data)
let data = res.data;
if(data.success){
  toast.success(res.data.msg,{position:"top-center",theme:"dark"})
  setAllChat([])

}
else{
  toast.error(res.data.msg,{position:"top-center",theme:"dark"})
}
}
const [showDelete, setShowDelete] = useState(false); // State to track visibility

  // Show the delete button when clicking on the text
  const handleTextClick = (e) => {
    e.stopPropagation(); // Prevent click event from propagating
    setShowDelete(true); // Show delete button
  };

  // Hide the delete button when clicking anywhere else
  const handleHideButton = () => {
    setShowDelete(false);
  };

  const handleDelete =async(ele)=>{
console.log(ele)
let res = await axios.delete(`https://blogapp-anlu.onrender.com/msgDelete/${ele._id}/${ele.receiver}`,{
  headers:{
    'Authorization':token
  }

})
let data = res.data;
// console.log(res)
if(data.success){
  getChat()
}
setShowDelete(false)
  }


  
  return (
   <div className=''>
     <div className="flex flex-col h-[91vh] bg-gray-100 md:flex-row ">
      {/* Left Sidebar */}
      <div className="hidden md:block w-1/4 bg-cyan-300 shadow-md overflow-y-auto">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-200">Recent Chats</h2>
        <ul>
          <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://via.placeholder.com/40"
              alt="User Profile"
            />
            <span className="font-medium text-gray-700">User 1</span>
          </li>
          <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://via.placeholder.com/40"
              alt="User Profile"
            />
            <span className="font-medium text-gray-700">User 2</span>
          </li>
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-[91vh]">
        {/* Chat Header */}
        <div className="bg-pink-200 shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <img
              className="w-10 h-10 rounded-full"
              src={friend?.profilePic}
              alt="Friend's Profile"
            />
            <h2 className="text-lg font-semibold">{friend?.name}</h2>
          </div>
          <button onClick={handleMessageDelete} className="text-blue-500 text-sm hover:underline">Clear Chat</button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-700">
          {allChat.map((ele, i) =>
            ele.sender === user._id ? (
              <div key={i} className="flex items-start justify-end">
                <div onClick={handleHideButton} className="bg-blue-500 text-white rounded-lg p-3 max-w-xs relative">
                  <p className="font-medium">You</p>
                  <p onClick={handleTextClick} className="text-sm cursor-pointer">{ele.text}</p>
                  {showDelete && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            handleDelete(ele); // Call delete handler
          }}
        >
          Delete
        </button>
      )}
                  <span className="text-xs text-green-300">{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-xs">
                  <img className='w-10 h-10 rounded-full' src={friend.profilePic} alt="" />
                  <p className="text-sm">{ele.text}</p>
                  <span className="text-xs text-green-500">{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="sm:flex-row flex-col flex items-center gap-3">
          <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle emoji picker visibility
            >
              <span className="text-2xl">😊</span>
            </button>

            {/* Emoji Picker Component */}
            {showEmojiPicker && (
              <div className="absolute bottom-32 left-4 z-10 bg-white shadow-lg rounded-md ">
                <EmojiPicker onEmojiClick={handleEmojiClick} /> {/* Add emoji to input field */}
              </div>
            )}
            <input
              type="text"
              value={currentMessage}
              onChange={handleInputChanger}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
};

export default Chat;