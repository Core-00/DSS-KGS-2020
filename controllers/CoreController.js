const excelToJson = require('convert-excel-to-json');
const axios = require('axios');
const ExportsModel = require('../models/ExportsModel');
const fs = require('fs');
const neatCsv = require('neat-csv');


module.exports = {
	read: async (req, res) => {
		let result = ''
		let code = 200
		if(req.file != undefined){
			result = excelToJson({
				sourceFile: process.cwd()+'/files/excel/'+ req.file.filename
			});
			
			code = 200
		}else{
			code = 403
		}
		
		return res.status(code).json(result)
	},
	
	readMultipleCSV: async (req, res) => {
		
		try {
			
			let code = 200
			code = 200
			let files = req.files
			if(files.length == 0){
				return res.status(400).json('File tidak di temukan!')
			}
			let parameter = []
			for (let a = 0; a < files.length; a++) {
				let path = files[a].path
				// let originalname = files[a].originalname
				let filename = files[a].filename
				
				let filepath = process.cwd()+ '/' + path
	
				fs.readFile(filepath, async (err, data) => {
	
					var csv_to_json = await neatCsv(data)
					// send internal KGS core engine API
					var splitHost = req.headers.host.split(':')

					const url = 'http://' + splitHost[0] + ':3002/internal/csv/multiple'
					const header = {
						"Content-Type": "application/json",
						"Authorization" : "Bearer " + req.jwt_token
					}
					const dataApi = {
						"parsed_csv" : {
							"filename" : filename,
							"csv_to_json" : csv_to_json
						}
					}
	
					const apiResult = await axios.post(url , dataApi ,{headers : header})
					parameter.push(apiResult.data.parameter)
	
				})
			}
			
			return res.json({
				parameter: parameter
			})

		} catch (error) {
			return res.status(500).json({
				parameter: error
			})
		}

	},
	
	getDataCsv: async (req, res) => {

		var splitHost = req.headers.host.split(':')
		const url = 'http://' + splitHost[0] + ':3002/internal/csv/'+req.params.uuid
		const header = {
			"Content-Type": "application/json",
			"Authorization" : "Bearer " + req.jwt_token
		}

		const apiResult = await axios.get(url , {headers : header})

		return res.json(apiResult.data)

	},

	update: async (req, res) => {
		
		let key_biner = req.body.key_biners
		let sum_biner = req.body.sum_biner

		var splitHost = req.headers.host.split(':')

		const url = 'http://' + splitHost[0] + ':3002/internal/csv/update'
		const header = {
			"Content-Type": "application/json",
			"Authorization" : "Bearer " + req.jwt_token
		}
		const dataApi = {
			"key_biners" : key_biner,
			"sum_biners" : sum_biner
		}

		const apiResult = await axios.put(url , dataApi ,{headers : header})

		return res.json(apiResult.data)
	},

	delete: async (req, res) => {
		let parameter = req.params.uuid

		var splitHost = req.headers.host.split(':')

		const url = 'http://' + splitHost[0] + ':3002/internal/csv/delete/' + parameter
		const header = {
			"Content-Type": "application/json",
			"Authorization" : "Bearer " + req.jwt_token
		}

		const apiResult = await axios.delete(url , {headers : header})

		return res.json({
			parameter : apiResult.data.parameter
		})
	}
}