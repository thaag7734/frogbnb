import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Landing from './components/Landing/Landing.jsx';
import SpotDetails from './components/SpotDetails/SpotDetails.jsx';
import * as sessionActions from './store/session';
import NewSpotForm from './components/NewSpotForm/NewSpotForm.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/spots',
        children: [
          {
            path: 'new',
            element: <NewSpotForm />,
          },
          {
            path: ':id',
            element: <SpotDetails />,
          },
        ],
      }
    ],
  },
]);

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
