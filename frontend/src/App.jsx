import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Landing from './components/Landing/Landing.jsx';
import SpotDetails from './components/SpotDetails/SpotDetails.jsx';
import * as sessionActions from './store/session';
import NewSpotForm from './components/NewSpotForm/NewSpotForm.jsx';
import ManageReviews from './components/ManageReviews/ManageReviews.jsx';

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
            path: 'manage',
            element: <Landing manage={true} />
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                element: <SpotDetails />,
              },
              {
                path: 'update',
                element: <NewSpotForm />,
              },
            ],
          },
        ],
      },
      {
        path: '/reviews',
        children: [
          {
            path: 'manage',
            element: <ManageReviews />
          }
        ]
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
