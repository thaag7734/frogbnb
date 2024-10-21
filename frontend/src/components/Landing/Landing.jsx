import { useSelector, useDispatch } from 'react-redux';
import SpotCard from '../SpotCard/SpotCard.jsx';
import './Landing.css';
import { useEffect } from 'react';
import { getAllSpotsThunk, getUserSpotsThunk } from '../../store/spots.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing({ manage }) {
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots);
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (manage) {
      dispatch(getUserSpotsThunk()).then(() => setLoaded(true));
    } else {
      dispatch(getAllSpotsThunk()).then(() => setLoaded(true));
    }
  }, [dispatch]);

  return (
    <main className="landing">
      {loaded ? (
        manage ? (
          <>
            <div className="header">
              <h1>Manage Your Spots</h1>
              <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            </div>
            <div className="spot-listings">
              {
                user
                  ? Object.entries(spots).length
                    ? Object.values(spots).map((spot) => spot.ownerId === user.id && (
                      <SpotCard key={spot.id} spot={spot} manage={true} />
                    ))
                    : <p>You don&apos;t have any spots! Click the button above to create a new one.</p>
                  : <p>Please log in to view and manage your spots.</p>
              }
            </div>
          </>
        ) : (
          <div className="spot-listings">
            {
              Object.entries(spots).length
                ? Object.values(spots).map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                  />
                ))
                : <h2>No spots found</h2>
            }
          </div>
        )
      ) : (
        <h1>Loading spots...</h1>
      )}
    </main>
  );
}

export default Landing;
