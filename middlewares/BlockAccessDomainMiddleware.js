const getmac = require('getmac');
const ip = require('ip');

exports.BlockAccessDomain = async function(req, res, next) {
    
    var allowedMacAddress = [
        "40:9f:38:e3:36:63", "d4:85:64:6c:e6:e2",
        "d4:85:64:6c:e6:e4" , "d4:85:64:6c:e6:e6",
        "d4:85:64:6c:e6:e8" , "00:50:56:b0:75:2a"
    ]
    var allowedIpServer = [
        "192.168.43.220", "10.10.10.200",
        "202.53.254.36" , "192.168.18.21",
        "202.46.7.26"
    ]
    
    if (
        allowedMacAddress.includes(getmac.default()) && 
        allowedIpServer.includes(ip.address())
    )
    {
        return next()
    }

    return res.status(500).json('Server Spec Not Equal with our data set, please contact admin');
    
};