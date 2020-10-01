const ExportsModel = require('../models/ExportsModel');

module.exports = {

    //will be refactoring
    openComputeCoreEngine : async (parameter , clientId , batchId , bodyRequest) => {

        let restructuredAll = []

        for (let x = 0; x < bodyRequest.data.length; x++) {
            restructuredAll.push(bodyRequest.data[x])
        }


        for(let x = 1; x < restructuredAll.length; x++)
        {
            var count = 0
            for(let y = 1; y < restructuredAll[x].length; y++)
            {
                if (restructuredAll[x][y] == "1")
                {
                    count++
                }
            }
            for(let y = 1; y < restructuredAll[x].length; y++)
            {
                if (restructuredAll[x][y] == "1")
                {
                    restructuredAll[x][y] =  (1 / (count)).toString()
                }
            }
        }


        let restructuredBiner = []
        for (let i = 1; i < restructuredAll.length; i++) { 
            restructuredBiner.push(restructuredAll[i].slice(1)) // change i = 1 (fix same like a core php resultCsvConvertion)
        }


        
        let dataInsert = []
        for (let i = 0; i < restructuredAll.length; i++) {
            let row_biner = restructuredAll[i].slice(1)
            
            let singleData = {
                parameter: parameter,
                userid: 0,
                name: restructuredAll[i][0],
                biner: row_biner.toString(),
            }
            
            dataInsert.push(singleData)
        }


        let otherDataInsert = []
        for (let i = 0; i < bodyRequest.other_data.length; i++) {
            let row_biner = bodyRequest.other_data[i].slice(1)
            
            let singleData = {
                parameter: parameter,
                name: bodyRequest.other_data[i][0],
                value: row_biner.toString(),
            }
            
            otherDataInsert.push(singleData)
        }

        let restructuredBinerSum = []
        for (let x = 0; x < restructuredAll[0].length - 1; x++) {
            var sumOne = 0
            for (let y = 0; y < restructuredBiner.length; y++) {
                sumOne += parseFloat(restructuredBiner[y][x])
            }
            var conclution = (sumOne / restructuredBiner.length)
            restructuredBinerSum.push(Math.round(conclution * 10000000) / 10000000)
        }
        
        await ExportsModel.KeyBiner.bulkCreate(dataInsert)
        await ExportsModel.OtherData.bulkCreate(otherDataInsert)
        
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
            name: bodyRequest.category
        })
        
        return parameter
    }
}