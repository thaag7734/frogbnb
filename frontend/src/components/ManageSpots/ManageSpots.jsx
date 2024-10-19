import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import SpotCard from "../SpotCard/SpotCard";
import { useState, useEffect } from "react";
import { getUserSpotsThunk } from "../../store/spots";
import { useDispatch } from "react-redux";

function ManageSpots() {
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots);
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserSpotsThunk()).then(() => setLoaded(true));
  }, []);

  useEffect(() => { }, [spots]);

  return Object.entries(spots).length && loaded
    ? (
      <main className="manage-spots">
        <div className="header">
          <h1>Manage Your Spots</h1>
          <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
        </div>
        {
          user
            ? Object.entries(spots).length
              ? Object.values(spots).map((spot) => spot.ownerId === user.id && (
                <SpotCard key={spot.id} spot={spot} manage={true} />
              ))
              : loaded
                ? <p>You don't have any spots! Click the button above to create a new one.</p>
                : <h2>Loading spots...</h2>
            : <p>Please log in to view and manage your spots.</p>
        }
      </main>
    ) : !loaded
      ? (
        <h1>Loading your spots...</h1>
      ) : (
        <h1>You don't have any spots!</h1>
      )
}

export default ManageSpots;
