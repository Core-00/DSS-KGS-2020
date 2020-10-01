const excelToJson = require('convert-excel-to-json');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const CoreEngineFunction = require('../helpers/CoreEngineFunction');
const ExportsModel = require('../models/ExportsModel');

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
	
	readCSV: async (req, res) => {
		let result = []
		let userid = req.payload.userid
		
		let code = 200
		if(req.file == undefined){
			let code = 403
			return res.status(code).json({
				message: "Extensi tidak diperbolehkan."
			})
		}else{
			code = 200
			let filepath = process.cwd()+ '/files/csv/'+ req.file.filename
			let parameter_temp = uuidv4()

			var latesData = await ExportsModel.File.findAll({
				limit: 1,
				where: {
					userid : userid
				},
				order: [ [ 'createdAt', 'DESC' ]]
			  }).then(function(entries){
				return entries
			  })

			  var latestBatch = (latesData.length != 0) ? latesData[0].dataValues.batch : 0
			
			var param = await CoreEngineFunction.computeCoreEngine(filepath , parameter_temp , userid , req.file.filename , latestBatch) // service compute engine

			return res.status(code).json({
				parameter: parameter_temp
			})
		}
	},
	
	readMultipleCSV: async (req, res) => {
		let result = []
		let userid = req.payload.userid
		
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
			let parameter_temp = uuidv4()

			var latesData = await ExportsModel.File.findAll({
				limit: 1,
				where: {
					userid : userid
				},
				order: [ [ 'createdAt', 'DESC' ]]
			  }).then(function(entries){
				return entries
			  })

			  var latestBatch = (latesData.length != 0) ? latesData[0].dataValues.batch : 0
			
			var param = await CoreEngineFunction.computeCoreEngine(filepath , parameter_temp , userid , filename , latestBatch) // service compute engine

			parameter.push(parameter_temp)
		}
		
		return res.json({
			parameter: parameter
		})
	},
	
	getDataCsv: async (req, res) => {
		let parameter = req.params.uuid.split(",")
		let userid = req.payload.userid
		
		ExportsModel.File.findAll({
			where: {
				userid: userid,
				parameter: parameter
			},
			include: [{
				attributes: {},
				model: ExportsModel.SumBiner,
				required: true
			},
			{
				attributes: {},
				model: ExportsModel.KeyBiner,
				required: true
			}]
		}).then(function (data) {
			if(data.length > 0){
				var result = []
				data.forEach(element => {
					// convert sum
					var newSum = element.sum_biner.sum.split(",")

					newSum.forEach(function (part , index) {
						this[index] = parseFloat(this[index])
					} , newSum)
					var getMaxSum = Math.max.apply(null , newSum)

					element.sum_biner.sum = newSum

					var resutlSumPersen = []

					newSum.forEach(element => {
						var calculate = element * 100
						var round = Math.round(calculate)
						resutlSumPersen.push(round.toString() + "%")
					});

					var merge_total = 0
					for (let i = 0; i < newSum.length; i++) {
						merge_total += newSum[i];
					}
					var merge_avg = merge_total / newSum.length

					var result_merge_sum = []
					newSum.forEach(element => {
						if (element >= merge_avg)
						{
							result_merge_sum.push(1)
						}
						else
						{
							result_merge_sum.push(0)
						}
					});

					var getConclution = newSum[0] + newSum[1]

					element.sum_biner.max_sum = getMaxSum
					element.sum_biner.sum_persen = resutlSumPersen
					element.sum_biner.sum_avg = result_merge_sum
					element.sum_biner.sum_conclution = (getConclution * 100) + "%"
					
					// convert biner
					element.key_biners.forEach(newelm =>{
						var newBiner = newelm.biner.split(",")
						newBiner.forEach(function(part , index){
							if(this[index] > 0 && this[index] < 1)
							{
								this[index] = "1"
							}
						} , newBiner)
						newelm.biner = newBiner
						return newelm
					})

					result = element
				});
				return res.status(200).json(result);
			}else{
				return res.status(200).json(data);
			}
		}).error(function (err) {
			console.log("Error:" + err);
		});
	},

	update: async (req, res) => {
		
		let key_biner = req.body.key_biners
		let sum_biner = req.body.sum_biner

		var param = await CoreEngineFunction.reComputeCoreEngine(key_biner , sum_biner)

		return res.json(param)
	},

	delete: async (req, res) => {
		let parameter = req.params.uuid
		let userid = req.payload.userid

		await ExportsModel.File.destroy({
			where: {
				parameter: parameter
			  }
		})

		await ExportsModel.SumBiner.destroy({
			where: {
				parameter: parameter
			  }
		})

		await ExportsModel.KeyBiner.destroy({
			where: {
				parameter: parameter
			  }
		})

		return res.json({
			parameter : parameter
		})
	}
}