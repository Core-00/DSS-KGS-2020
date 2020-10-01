const fs = require('fs');
const neatCsv = require('neat-csv');
const ExportsModel = require('../models/ExportsModel');

module.exports = {
    computeCoreEngine : async (filepath , parameter , userid , filename , batchId) => {
        fs.readFile(filepath, async (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resultCsvConvertion = await neatCsv(data)
            // Debuging
            // var propsName = Object.getOwnPropertyNames(resultCsvConvertion[5])
            // return res.status(200).json(resultCsvConvertion[5][propsName])
    
            let dataResultCsv = []
            for (let i = 1; i < resultCsvConvertion.length; i++) {
                var propsName = Object.getOwnPropertyNames(resultCsvConvertion[i])

                if(propsName.length > 1){
                    var tmpString = "";
                    for (let j = 0; j < propsName.length; j++) {
                        var tmpPropsname = propsName[j]
                        tmpString += resultCsvConvertion[i][tmpPropsname]
                    }
                    let string = tmpString
                    dataResultCsv.push(string)
                }else{
                    let string = resultCsvConvertion[i][propsName]
                    if (string.split(";").every(element => element === null || element === ""))
                    {
                        continue
                    }
                    dataResultCsv.push(string)
                }
                dataResultCsv = dataResultCsv.filter(function(el) { return el; }); // remove null value array
            }
            
            let restructuredAll = []
            for (let i = 0; i < dataResultCsv.length; i++) {
                let row = dataResultCsv[i].split(";")
                restructuredAll.push(row)
            }

            // Converting comma to dot for forcing decimal calculate

            for (let i = 1; i < restructuredAll.length; i++) {
                for (let x = 2; x < restructuredAll[i].length; x++) {
                    if (restructuredAll[i][x].length > 1){
                        var split = restructuredAll[i][x].split("")
                        if (split[0] == "0")
                        {
                            split.splice(1, 0 , '.')
                            restructuredAll[i][x] = split.join("")
                        }
                    }
                }
            }

            // Converting number to binary

            var convertDataResultAvg = []
            for (let i = 1; i < restructuredAll.length; i++) {
                // next loop for one rows
                var convertDataResultSum = 0
                for (let x = 2; x < restructuredAll[i].length; x++) {
                    // check if data is not biner
                    convertDataResultSum += parseFloat(restructuredAll[i][x])
                }
                convertDataResultAvg.push(convertDataResultSum / (restructuredAll[i].length - 2))
            }

            // converting number to biner
            for (let i = 1; i < restructuredAll.length; i++) {
                for (let x = 2; x < restructuredAll[i].length; x++) {
                    if (parseFloat(restructuredAll[i][x]) >= convertDataResultAvg[i - 1])
                    {
                        restructuredAll[i][x] = 1
                    }else
                    {
                        restructuredAll[i][x] = 0
                    }
                }
            }

            for(let x = 1; x < restructuredAll.length; x++)
            {
                var count = 0
                for(let y = 2; y < restructuredAll[x].length; y++)
                {
                    if (restructuredAll[x][y] == "1")
                    {
                        count++
                    }
                }
                for(let y = 2; y < restructuredAll[x].length; y++)
                {
                    if (restructuredAll[x][y] == "1")
                    {
                        restructuredAll[x][y] =  (1 / (count)).toString()
                    }
                }
            }

            let restructuredBiner = []
            for (let i = 1; i < restructuredAll.length; i++) { 
                restructuredBiner.push(restructuredAll[i].slice(2)) // change i = 1 (fix same like a core php resultCsvConvertion)
            }

            
            let dataInsert = []
            for (let i = 0; i < restructuredAll.length; i++) {
                let row_biner = restructuredAll[i].slice(2)
                
                let singleData = {
                    parameter: parameter,
                    userid: userid,
                    name: restructuredAll[i][1],
                    biner: row_biner.toString(),
                }
                
                dataInsert.push(singleData)
            }

            let restructuredBinerSum = []
            for (let x = 0; x < restructuredAll[0].length - 2; x++) {
                var sumOne = 0
                for (let y = 0; y < restructuredBiner.length; y++) {
                    sumOne += parseFloat(restructuredBiner[y][x])
                }
                var conclution = (sumOne / restructuredBiner.length)
                restructuredBinerSum.push(Math.round(conclution * 10000000) / 10000000)
            }

            
            await ExportsModel.KeyBiner.bulkCreate(dataInsert)
            await ExportsModel.SumBiner.create({
                parameter: parameter,
                userid: userid,
                sum: restructuredBinerSum.toString()
            })

            await ExportsModel.File.create({
                parameter: parameter,
                batch : batchId + 1,
                userid: userid,
                name: filename
            })
            
            return parameter
        })
    },

    //will be refactoring
    openComputeCoreEngine : async (filepath , parameter , clientId , filename , batchId) => {
        fs.readFile(filepath, async (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resultCsvConvertion = await neatCsv(data)
            // Debuging
            // var propsName = Object.getOwnPropertyNames(resultCsvConvertion[5])
            // return res.status(200).json(resultCsvConvertion[5][propsName])
    
            let dataResultCsv = []
            for (let i = 1; i < resultCsvConvertion.length; i++) {
                var propsName = Object.getOwnPropertyNames(resultCsvConvertion[i])

                if(propsName.length > 1){
                    var tmpString = "";
                    for (let j = 0; j < propsName.length; j++) {
                        var tmpPropsname = propsName[j]
                        tmpString += resultCsvConvertion[i][tmpPropsname]
                    }
                    let string = tmpString
                    dataResultCsv.push(string)
                }else{
                    let string = resultCsvConvertion[i][propsName]
                    if (string.split(";").every(element => element === null || element === ""))
                    {
                        continue
                    }
                    dataResultCsv.push(string)
                }
                dataResultCsv = dataResultCsv.filter(function(el) { return el; }); // remove null value array
            }
            
            let restructuredAll = []
            for (let i = 0; i < dataResultCsv.length; i++) {
                let row = dataResultCsv[i].split(";")
                restructuredAll.push(row)
            }

            // Converting number to binary

            var convertDataResultAvg = []
            for (let i = 1; i < restructuredAll.length; i++) {
                // next loop for one rows
                var convertDataResultSum = 0
                for (let x = 2; x < restructuredAll[i].length; x++) {
                    // check if data is not biner
                    convertDataResultSum += parseFloat(restructuredAll[i][x])
                }
                convertDataResultAvg.push(convertDataResultSum / (restructuredAll[i].length - 2))
            }

            // converting number to biner
            for (let i = 1; i < restructuredAll.length; i++) {
                for (let x = 2; x < restructuredAll[i].length; x++) {
                    if (parseFloat(restructuredAll[i][x]) >= convertDataResultAvg[i - 1])
                    {
                        restructuredAll[i][x] = 1
                    }else
                    {
                        restructuredAll[i][x] = 0
                    }
                }
            }

            for(let x = 1; x < restructuredAll.length; x++)
            {
                var count = 0
                for(let y = 2; y < restructuredAll[x].length; y++)
                {
                    if (restructuredAll[x][y] == "1")
                    {
                        count++
                    }
                }
                for(let y = 2; y < restructuredAll[x].length; y++)
                {
                    if (restructuredAll[x][y] == "1")
                    {
                        restructuredAll[x][y] =  (1 / (count)).toString()
                    }
                }
            }

            let restructuredBiner = []
            for (let i = 1; i < restructuredAll.length; i++) { 
                restructuredBiner.push(restructuredAll[i].slice(2)) // change i = 1 (fix same like a core php resultCsvConvertion)
            }

            
            let dataInsert = []
            for (let i = 0; i < restructuredAll.length; i++) {
                let row_biner = restructuredAll[i].slice(2)
                
                let singleData = {
                    parameter: parameter,
                    userid: 0,
                    name: restructuredAll[i][1],
                    biner: row_biner.toString(),
                }
                
                dataInsert.push(singleData)
            }

            let restructuredBinerSum = []
            for (let x = 0; x < restructuredAll[0].length - 2; x++) {
                var sumOne = 0
                for (let y = 0; y < restructuredBiner.length; y++) {
                    sumOne += parseFloat(restructuredBiner[y][x])
                }
                var conclution = (sumOne / restructuredBiner.length)
                restructuredBinerSum.push(Math.round(conclution * 10000000) / 10000000)
            }

            
            await ExportsModel.KeyBiner.bulkCreate(dataInsert)
            await ExportsModel.SumBiner.create({
                parameter: parameter,
                userid: 0,
                sum: restructuredBinerSum.toString()
            })

            await ExportsModel.File.create({
                parameter: parameter,
                userid: 0,
                batch : batchId + 1,
                client_id: clientId,
                name: filename
            })
            
            return parameter
        })
    },

    reComputeCoreEngine : async (key_biners , sum_biner) => {
        
        let resultBiner = []

        // selecting object key binaries
		for (let i = 0; i < key_biners.length; i++) {
            let object = {
                name: key_biners[i].name,
                binary_id : key_biners[i].id,
                binaries : key_biners[i].biner
            }
            resultBiner.push(object)
        }

        // calculate new binaries to probability result
        for(let x = 1; x < resultBiner.length; x++)
        {
            var count = 0
            for(let y = 0; y < resultBiner[x].binaries.length; y++)
            {
                if (resultBiner[x].binaries[y] == "1")
                {
                    count++
                }
            }
            for(let y = 0; y < resultBiner[x].binaries.length; y++)
            {
                if (resultBiner[x].binaries[y] == "1")
                {
                    resultBiner[x].binaries[y] = (1 / (count)).toString()
                }
            }
        }


        // selecting probability result
        let dataInsert = []
        for (let i = 0; i < resultBiner.length; i++) {
            let row_biner = resultBiner[i].binaries
            
            let singleData = {
                id : resultBiner[i].binary_id,
                name : resultBiner[i].name,
                biner: row_biner.toString(),
            }
            
            dataInsert.push(singleData)
        }

        // insert new probability value
		for (let i = 0; i < dataInsert.length; i++) {
			ExportsModel.KeyBiner.update({
				name: dataInsert[i].name,
				biner: dataInsert[i].binaries
			},{
				where: {
					id: dataInsert[i].id
				}
			})
        }

        // calculate new probability summeries
        let restructuredBinerSum = []
        for (let x = 0; x < resultBiner[0].binaries.length; x++) {
            var sumOne = 0
            for (let y = 1; y < resultBiner.length; y++) {
                sumOne += parseFloat(resultBiner[y].binaries[x])
            }
            var conclution = (sumOne / (resultBiner.length - 1))
            restructuredBinerSum.push(Math.round(conclution * 10000000) / 10000000)
        }

        // update probability summeries value
		for (let i = 0; i < restructuredBinerSum.length; i++) {
			ExportsModel.SumBiner.update({
				sum: restructuredBinerSum.toString()
			},{
				where: {
					id: sum_biner.id
				}
			})
        }
        
        return {
            key_biners : resultBiner,
            sum_biner : {
                id : sum_biner.id,
                sum : restructuredBinerSum
            }
        };
    }
}