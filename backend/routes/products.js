const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Re-route into other resource routers
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Product, 'reviews'), getProducts)
  .post(protect, authorize('publisher', 'admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('publisher', 'admin'), updateProduct)
  .delete(protect, authorize('publisher', 'admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), productPhotoUpload);

module.exports = router;
