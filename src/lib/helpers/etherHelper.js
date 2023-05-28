const ipHelper = require('./ipHelper')

const parseEtherType = (ether) => {
    var name = ""
    switch(ether) {
        case "0800":
            name = "IPv4"
        case "86DD":
            name = "IPv6"
            break;
        default:
            name = "UNKNWN"
    }
    return name 
}


const parseEther = (type, payload) => {

    var OFFSET = 0;
    var PROTO = null;

    if(type == "0800"){
        OFFSET = 20 
        PROTO = payload.subarray(9, 10).toString('hex')

        ipvx = {
            source: bytesToIp(payload.subarray(12, 16)),
            destination: bytesToIp(payload.subarray(16, 20)),
            protocol: PROTO,
            type: 4
        }
    }
    else if(type == "86DD"){
        ipvx = {
            source: bytesToIpV6(payload.subarray(8, 12)),
            destination: bytesToIpV6(payload.subarray(12, 16)),
            type: 6
        }
        OFFSET = 40
    }
    else ipvx = {
        destination: "unknown",
        source: "unknown",
        type: "unknown"
    }


    //const protocol = {proto: "proto"}
    const protocol = ipHelper.parseIP(PROTO, payload.slice(OFFSET));
    
    return {ipvx, ...protocol}

}

const bytesToIpV6 = (xts) => {
    return xts.toString('hex')
}

const bytesToIp = (xts) => {
    var ip = ""

    for(var i = 0; i < 4; i++)
    {
        const current = xts.readUInt8(i)
        ip += current

        if(i < 3)
            ip += "."
    }
    return ip
}

exports.parseEther = parseEther
exports.parseEtherType = parseEtherType