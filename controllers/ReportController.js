const ExportsModel = require('../models/ExportsModel');
const Op = require('sequelize').Op;

module.exports = {
	get: async (req, res) => {
		let userid = req.payload.userid

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

		ExportsModel.File.findAll({
			where: {
				userid: userid,
				batch : latestBatch
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
				return res.status(200).json(data);
			}else{
				return res.status(200).json(data);
			}
		}).error(function (err) {
			return res.status(422).json('Data tidak ditemukan');
		});
	},

	getAllReport: async (req, res) => {
		let userid = req.payload.userid
		let batch = req.query.batch

		ExportsModel.File.findAll({
			where: {
				userid: userid
			},
			order :[
				["batch" , "DESC"]
			],
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
				
				let result = data
				if (batch != undefined)
				{
					result = data.filter(s => s.batch == batch)
				}

				return res.status(200).json(result);
			}else{
				return res.status(200).json(data);
			}
		}).error(function (err) {
			return res.status(422).json('Data tidak ditemukan');
		});
	},


	getMegreReport: async (req, res) => {
		let userid = req.payload.userid

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

		ExportsModel.File.findAll({
			where: {
				userid: userid,
				batch : latestBatch
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
				var objectResult;
				var result = []
				var mergerResult;
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
						resutlSumPersen.push(calculate.toFixed(2) + "%")
					});


					var merge_total = 0
					for (let i = 0; i < newSum.length; i++) {
						merge_total += newSum[i];
					}
					var merge_avg = merge_total / newSum.length
					var merge_avg_round = Math.round(merge_avg * 10000000) / 10000000

					var result_merge_sum = []
					for (let i = 0; i < newSum.length; i++) {
						if (newSum[i] >= merge_avg_round)
						{
							result_merge_sum.push(1)
						}
						else
						{
							result_merge_sum.push(0)
						}
					}
					
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

					result.push(element)
				});

				// find probabilitas
				for(let x = 0; x < result.length; x++)
                {
                    var count = 0
                    for(let y = 0; y < result[x].sum_biner.sum_avg.length; y++)
                    {
                        if (result[x].sum_biner.sum_avg[y] == "1")
                        {
                            count++
                        }
					}
                    for(let y = 0; y < result[x].sum_biner.sum_avg.length; y++)
                    {
                        if (result[x].sum_biner.sum_avg[y] == "1")
                        {
                            result[x].sum_biner.sum_avg[y] =  (1 / (count))
						}
                    }
				}
				
				// sum probabilitas
				var result_sum_merge = []
				for (let x = 0; x < result[0].sum_biner.sum_avg.length; x++) {
                    var sumOne = 0
                    for (let y = 0; y < result.length; y++) {
                        sumOne += parseFloat(result[y].sum_biner.sum_avg[x])
					}
                    var conclution = (sumOne / result.length)
                    result_sum_merge.push(conclution)
				}
				
				var result_sum_persen = []

				result_sum_merge.forEach(element => {
					var calculate = element * 100
					result_sum_persen.push(calculate.toFixed(2) + "%")
				});

				objectResult = {
					merge_result : {
						sum_biner : (result.length == 1) ? result[0].sum_biner.sum : result_sum_merge,
						sum_persen : (result.length == 1) ? result[0].sum_biner.sum_persen : result_sum_persen
					},
					per_table : result,
				}
				return res.status(200).json(objectResult);
			}else{
				return res.status(200).json(data);
			}
		}).error(function (err) {
			return res.status(422).json('Data tidak ditemukan');
		});
	},
	
	getByRangeDate: async (req, res) => {
		let userid = req.payload.userid
		let start = req.query.start
		let end = req.query.end
		ExportsModel.File.findAll({
			where: {
				userid: userid,
				createdAt: {
					[Op.between]: [start, end]
				}
			},
			include: [{
				attributes: {},
				model: ExportsModel.KeyBiner,
				required: true
			}]
		}).then(function (data) {
			if(data.length > 0){
				return res.status(200).json(data);
			}else{
				return res.status(404).json(data);
			}
		}).error(function (err) {
			return res.status(404).json('Data tidak ditemukan');
		});
	}
}