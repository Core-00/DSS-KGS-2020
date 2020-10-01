const express = require('express');
const router = express.Router();
const JsonOpenCoreController = require('../controllers/JsonCoreController');
const ClientTokenMiddleware = require('../middlewares/ClientTokenMiddleware');

router.post(
	'/json/multiple',
	ClientTokenMiddleware.ClientToken,
	JsonOpenCoreController.readJsonMultiple
);

router.get(
	'/json/:uuid',
	ClientTokenMiddleware.ClientToken,
	JsonOpenCoreController.getDataJson
);

module.exports = router;
