import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { RxHamburgerMenu } from "react-icons/rx";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem.jsx';
import LoginFormModal from '../LoginFormModal/LoginFormModal.jsx';
import SignupFormModal from '../SignupFormModal/SignupFormModal.jsx';
import { Link, useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const handleProfileButtonClick = (e) => {
    e.stopPropagation();

    setShowMenu(!showMenu);
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button" onClick={handleProfileButtonClick}>
        <span><RxHamburgerMenu /> <IoPersonCircleSharp /></span>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <Link to="/spots/manage">Manage Spots</Link>
            </li>
            <li>
              <Link to="/reviews/manage">Manage Reviews</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
