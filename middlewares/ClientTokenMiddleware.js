const jwt = require('jsonwebtoken');
const ExportsModel = require('../models/ExportsModel');
const SHA256 = require('crypto-js/sha256');
const { get } = require('../routes/CoreRouter');

exports.ClientToken = async function(req, res, next) {
    const bearerHeader = req.headers.authorization
    const token = bearerHeader ? bearerHeader.split(" ")[1] : undefined
    const clientId = req.headers.client_id
    const client_token = req.headers.client_token

    const encryptData = SHA256(clientId + "SHACOUNTERCHECK" + client_token , "=KNKkwnd34n2k3efkjn33nKNKJDN3r=")

    if (token == encryptData)
    {
        var getData = await ExportsModel.ClientToken.findOne({
            where: {
                client_id : clientId,
                client_token : client_token
			},
        }).then(function (data) {
			return data
        })
        
        if (getData != null) 
        {
            req.payload = getData
            return next();
        }

        return res.status(422).json('Client Id dan public token anda tidak terdaftar, silahkan hubungi team KGS');
    }
    return res.status(401).json('Public token dan data client id tidak sesuai. silahkan hubungi team KGS');
    
};