import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { Link } from 'react-router-dom';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="nav">
      <li>
        <NavLink to="/"><img src="/logo_square.svg" alt="Home" title="Home" /></NavLink>
      </li>
      {isLoaded && (
        <li>
          {!!sessionUser && (
            <Link to="/spots/new">Create a New Spot</Link>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
