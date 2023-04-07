const getHeadersFromData = (packet, encoding = "LE") => {
    const ETHER_SIZE = 14

    const ether = {
        destination: bytesToMac(packet.subarray(0, 6)),
        source: bytesToMac(packet.subarray(6, 12)),
        type: packet.subarray(12, 14).toString('hex')
    }

    //check for other stuff like ipv6 here...
    
    const ipv4 = {
        destination: bytesToIp(packet.subarray(12 + ETHER_SIZE, 16 + ETHER_SIZE)),
        source: bytesToIp(packet.subarray(16 + ETHER_SIZE, 20 + ETHER_SIZE))
    }

    var data = {}
    data["ether"] = ether
    data["ipv4"] = ipv4

    return data
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

const bytesToMac = (xts) => {

    var str = xts.toString('hex')
    var mac = ""

    for(var i = 0; i < 10; i += 2)
    {
        mac += str.substr(0, 2)
        mac += ":"
        str = str.substr(2)
    }

    mac += str

    return mac
}

exports.getHeadersFromData = getHeadersFromData
exports.bytesToIp = bytesToIp
exports.bytesToMac = bytesToMac