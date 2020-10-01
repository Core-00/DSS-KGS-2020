const express = require('express');
const router = express.Router();
const OpenCoreController = require('../controllers/OpenCoreController');
const ClientTokenMiddleware = require('../middlewares/ClientTokenMiddleware');


router.get(
	'/merge_result',
	ClientTokenMiddleware.ClientToken,
	OpenCoreController.getMegreReport
);

module.exports = router;