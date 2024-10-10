const router = require('express').Router();
const { Review, Spot, User, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Sequelize } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const validateReviewEdit = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

/**** GET reviews for current user ****/
router.get('/current',
  restoreUser, requireAuth,
  async (req, res, next) => {
    const { user } = req;

    const reviews = await Review.findAll({
      where: { userId: user.id },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        {
          model: Spot,
          include: [
            {
              model: SpotImage,
              attributes: [],
              required: false,
              where: {
                preview: true,
              },
            },
          ],
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price',
            [Sequelize.literal('"Spot->SpotImages"."url"'), 'previewImage'],
          ]
        },
        { model: ReviewImage, attributes: ['id', 'url'] },
      ]
    });

    return res.status(200).json({ Reviews: reviews });
  }
);

/**** Edit a review by its ID ****/
router.put('/:reviewId',
  restoreUser, requireAuth, validateReviewEdit,
  async (req, res, next) => {
    const { user } = req;

    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review couldn\'t be found' });
    }

    if (user.id !== review.userId) {
      return res.status(403).json({
        message: 'You cannot edit a review that you didn\'t make'
      });
    }

    review.review = req.body.review;
    review.stars = req.body.stars;

    try {
      await review.save();
    } catch (e) {
      return next(e);
    }

    return res.status(200).json(review);
  }
);

/**** DELETE a review by its ID ****/
router.delete('/:reviewId',
  restoreUser, requireAuth,
  async (req, res, next) => {
    const { user } = req;

    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review couldn\'t be found' });
    }

    if (user.id !== review.userId) {
      return res.status(403).json({
        message: 'You cannot delete a review that you didn\'t make'
      });
    }

    try {
      await review.destroy();

      return res.status(200).json({ message: 'Successfully deleted' });
    } catch (e) {
      return next(e);
    }
  }
);

/**** POST an image to a review based on the review's ID ****/
router.post('/:reviewId/images',
  restoreUser, requireAuth,
  async (req, res, next) => {
    const { user } = req;

    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review couldn\'t be found' });
    }

    if (user.id !== review.userId) {
      return res.status(403).json({
        message: 'You cannot add images to a review that you didn\'t make.'
      });
    }

    const images = await ReviewImage.findAll({ where: { reviewId: req.params.reviewId } });

    if (images.length >= 10) {
      return res.status(403).json({
        message: 'Maximum number of images for this resource was reached'
      });
    }

    try {
      const image = await review.createReviewImage({
        url: req.body.url,
      });

      return res.status(201).json(image);
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
