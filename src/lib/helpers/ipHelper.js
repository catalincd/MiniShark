const UDP = require('./protocols/udpHelper')
const TCP = require('./protocols/tcpHelper')

const parseProto = (proto) => {
    var name = ""
    switch(proto) {
        case "01":
            name = "ICMP"
            break;
        case "06":
            name = "TCP"
            break;
        case "11":
            name = "UDP"
            break;
        default:
            name = "UNKNWN"
    }
    return name 
}


const parseIP = (protocol, payload) => {
    const protocolName = parseProto(protocol)
    var protocolData = null

    if(protocolName == "UDP") {
        protocolData = UDP.parse(payload)
    }

    if(protocolName == "TCP") {
        protocolData = TCP.parse(payload)
    }

    return {protocol, protocolName, protocolData}
}



exports.parseIP = parseIP