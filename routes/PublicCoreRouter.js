const express = require('express');
const path = require('path')
const router = express.Router();
const OpenCoreController = require('../controllers/OpenCoreController');
const ClientTokenMiddleware = require('../middlewares/ClientTokenMiddleware');
var multer  = require('multer')

var storage_csv = multer.diskStorage({
	destination: './files/csv/',
	filename: function (req, file, cb) {
		cb( null, file.originalname+"-"+ Date.now('Y-m-d') +".csv" );
	}
});

var upload_csv = multer({ 
	storage: storage_csv,
	fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if(ext !== '.csv') {
			return callback(null, false)
		}
		callback(null, true)
	},
})

var storage_multiple_csv = multer.diskStorage({
	destination: './files/csv/',
	filename: function (req, file, cb) {
		cb( null, file.originalname+"-"+ Date.now('Y-m-d') +".csv" );
	}
});

var upload_multiple_csv = multer({ 
	storage: storage_multiple_csv
})

router.post(
	'/multiplecsv',
	ClientTokenMiddleware.ClientToken,
	upload_multiple_csv.array('csv[]', 100),
	OpenCoreController.readMultipleCSV
);

router.get(
	'/csv/:uuid',
	ClientTokenMiddleware.ClientToken,
	OpenCoreController.getDataCsv
);

module.exports = router;