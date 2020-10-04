const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const JWTMiddleware = require('../middlewares/JWTMiddleware');


router.get(
	'/merge_result',
	JWTMiddleware.JWTverify,
	ReportController.getMegreReport
);

router.get(
	'/all',
	JWTMiddleware.JWTverify,
	ReportController.getAllReport
);

module.exports = router;