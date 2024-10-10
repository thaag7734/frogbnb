const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js'); // for testing 
//const { User } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
  router.use(restoreUser);

  router.use('/session', sessionRouter);
  
  router.use('/users', usersRouter);

  router.use('/reviews', require('./reviews.js'));

  router.use('/review-images', require('./review-images.js'));

  router.use('/bookings', require('./bookings.js'));
  
  router.use('/spots', require('./spots.js'));

  router.use('/spot-images', require('./spot-images.js'));
  
  router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });
  
  module.exports = router;

/* VARIOUS TESTING ROUTES
//const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);
*/


module.exports = router;
