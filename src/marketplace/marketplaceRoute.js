const router = require('express').Router();
const controller = require('./marketplaceController');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { sellValidator } = require('./marketplaceValidator');

router.post('/sell', auth, validate(sellValidator), controller.sellExcuse);
router.post('/buy/:id', auth, controller.buyExcuse);
router.get('/', controller.getMarketplaceListings);
router.get('/my-sales', auth, controller.getMySales);
router.get('/my-purchases', auth, controller.getMyPurchases);

module.exports = router;