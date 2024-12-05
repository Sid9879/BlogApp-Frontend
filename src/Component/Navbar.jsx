import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/UserSlice';
import axios from 'axios';
const Navbar = () => {
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.user);
  const login = userStore.login;

  const [searchUser, setSearchUser] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setSearchUser([]);
      return;
    }

    try {
      const res = await axios.get(`https://blogapp-anlu.onrender.com/users/search?q=${value}`);
      setSearchUser(res.data.users || []);
    } catch (error) {
      // console.error("Error fetching search results:", error);
    }
  };

  // Clear search input and results
  const clearSearch = () => {
    setSearchValue("");
    setSearchUser([]);
  };

  return (
    <nav className="bg-white border-b dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-semibold dark:text-white">
          BlogPage
        </Link>

        {/* <li>
                      <Link
                        to="/signup"
                        className=" text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Up
                      </Link>
                    </li> */}

        {/* Search Bar (Visible on larger screens) */}
        {login && (
          <div className="hidden lg:block relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search a friend"
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:outline-none w-40 lg:w-60"
            />
            {searchUser.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-md rounded-md max-h-48 overflow-y-auto z-50">
                {searchUser.map((user, i) => (
                  <Link
                    key={i}
                    to="/FriendProfile"
                    state={user._id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                    onClick={clearSearch} // Clear search on user selection
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.profilePic || "https://via.placeholder.com/150"}
                      alt={user.name}
                    />
                    <p className="text-sm">{user.name}</p>
                  </Link>
                ))}
              </div>
            )}
            
          </div>
        )}

        {/* User Profile with Dropdown */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            type="button"
            className="flex items-center bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <img
              className="w-8 h-8 rounded-full"
              src={
                login
                  ? userStore.user?.profilePic
                  : "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
              }
              alt="Profile"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute -right-5 top-12 bg-white dark:bg-gray-800 shadow-lg rounded-md w-64 z-50">
              {login && (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-gray-200">
                      {userStore.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userStore.user?.email}</p>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                </>
              )}

              {/* Links */}
              <ul className="py-2">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Home
                  </Link>
                </li>
                {login && (
                  <>
                   {/* <li>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Up
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                )}
                {!login && (
                  <>
                    <li>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {/* Search Bar (Visible on smaller screens) */}
              {login && (
                <div className="block lg:hidden px-4 py-2">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search a friend"
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  {searchUser.length > 0 && (
                    <div className="bg-white shadow-md rounded-md mt-2 max-h-48 overflow-y-auto">
                      {searchUser.map((user, i) => (
                        <Link
                          key={i}
                          to="/FriendProfile"
                          state={user._id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                          onClick={clearSearch} // Clear search on user selection
                        >
                          <img
                            className="w-8 h-8 rounded-full"
                            src={user.profilePic || "https://via.placeholder.com/150"}
                            alt={user.name}
                          />
                          <p className="text-sm">{user.name}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
