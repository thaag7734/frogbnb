import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import SpotCard from "../SpotCard/SpotCard";
import { useState, useEffect } from "react";
import { getAllSpotsThunk } from "../../store/spots";
import { useDispatch } from "react-redux";

function ManageSpots() {
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots);
  const user = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.entries(spots).length) {
      // TODO this needs to be changed to a "get user spots" action that hits
      // the /api/spots/current endpoint
      dispatch(getAllSpotsThunk()).then(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  });

  return (
    <main>
      <div className="header">
        <h1>Manage Your Spots</h1>
        <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
      </div>
      {
        user
          ? Object.entries(spots).length
            ? Object.values(spots).map((spot) => spot.ownerId === user.id && (
              <Link key={spot.id} to={`/spots/${spot.id}/update`}>
                <SpotCard spot={spot} manage={true} />
              </Link>
            ))
            : loaded
              ? <p>You don't have any spots! Click the button above to create a new one.</p>
              : <h2>Loading spots...</h2>
          : <p>Please log in to view and manage your spots.</p>
      }
    </main>
  )
}

export default ManageSpots;
