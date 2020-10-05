const ExportsModel = require('../models/ExportsModel');
const Op = require('sequelize').Op;
const axios = require('axios');

module.exports = {

	getAllReport: async (req, res) => {
		let batch = req.query.batch
		
		try {
			
			var splitHost = req.headers.host.split(':')

			const url = 'http://'+splitHost[0]+':3002/internal/reports/all'
			const header = {
				"Content-Type": "application/json",
				"Authorization" : "Bearer " + req.jwt_token
			}

			const params = {
				"batch": batch
			}
	
			const apiResult = await axios.get(url , {headers : header , params : params})
	
			return res.json(apiResult.data)

		} catch (error) {
			return res.status(500).json(error)
		}

	},


	getMegreReport: async (req, res) => {
		
		try {
			
			var splitHost = req.headers.host.split(':')

			const url = 'http://'+splitHost[0]+':3002/internal/reports/merge_result'
			const header = {
				"Content-Type": "application/json",
				"Authorization" : "Bearer " + req.jwt_token
			}
	
			const apiResult = await axios.get(url , {headers : header})
	
			return res.json(apiResult.data)

		} catch (error) {
			return res.status(500).json(error)
		}

	}
}