var argsNum = {}
const operatorsArray = ["&&", "&", "AND", "||", "|", "OR"]

const isAnd = (operator) => (operator == "AND" || operator == "&&" || operator == "&")
const isOr = (operator) => (operator == "OR" || operator == "||" || operator == "|")


const filterPacketsArray = (packets, filter) => {   

    const {filters, operators} = splitFilter(filter)
    const newPackets = []
    const packetIds = []

    for(var i=0;i<packets.length;i++){

        var filtered = []
        for(var t=0;t<filters.length;t++){
            filtered.push(filterPacket(packets[i], filters[t].filter, filters[t].args))
        }

        var currentValue = filtered[0]
        for(var t=1;t<filtered.length;t++){
            if(isAnd(operators[t - 1])) currentValue = (currentValue && filtered[t])
            if(isOr(operators[t - 1])) currentValue = (currentValue || filtered[t])
        }

        if(currentValue){
            newPackets.push(packets[i])
            packetIds.push(i)
        }
    }

    return packetIds
}



const splitFilter = (filter) => {
    const words = filter.toUpperCase().split(' ')

    var filters = []
    var operators = []

    for(var i=0;i<words.length;i++){
        if(argsNum[words[i]] != undefined) {
            filters.push({
                filter: words[i],
                args: words.slice(i + 1, i + 1 + argsNum[words[i]])
            })

            i += argsNum[words[i]]
            continue
        }

        if(operatorsArray.includes(words[i])) {
            operators.push(words[i])
        }
    }

    return {filters, operators}
}


const filterPacket = (packet, filter, args = []) =>  {
    if(filter == "TCP") return packet.protocolName == "TCP"
    if(filter == "UDP") return packet.protocolName == "UDP"
    if(filter == "ICMP") return packet.protocolName == "ICMP"
        
    if(filter == "ETH.SRC" || filter == "ETH.SOURCE") return (args[0] == "=="? (packet.ether.source.toUpperCase() == args[1]):(packet.ether.source.toUpperCase() != args[1]))
    if(filter == "ETH.DEST" || filter == "ETH.DST") return (args[0] == "=="? (packet.ether.destination.toUpperCase() == args[1]):(packet.ether.destination.toUpperCase() != args[1]))

    if(filter == "IP.SRC" || filter == "IP.SOURCE" || filter == "IP.ADDR") return (args[0] == "=="? (packet.ipvx.source.toUpperCase() == args[1]):(packet.ipvx.source.toUpperCase() != args[1]))
    if(filter == "IP.DEST" || filter == "IP.DST") return (args[0] == "=="? (packet.ipvx.destination.toUpperCase() == args[1]):(packet.ipvx.destination.toUpperCase() != args[1]))

    if(filter == "TCP.PORT" || filter == "TCP.SRC") return (packet.protocolName == "TCP" && packet.protocolData.header.source.toString() == args[1])
    if(filter == "TCP.DSTPORT" || filter == "TCP.DST" || filter == "TCP.DEST") return (packet.protocolName == "TCP" && packet.protocolData.header.destination.toString() == args[1])

    return false
}


argsNum["TCP"] = 0
argsNum["UDP"] = 0
argsNum["ICMP"] = 0

argsNum["ETH.SRC"] = 2
argsNum["ETH.SOURCE"] = 2
argsNum["ETH.DEST"] = 2
argsNum["ETH.DST"] = 2

argsNum["IP.ADDR"] = 2
argsNum["IP.SRC"] = 2
argsNum["IP.SOURCE"] = 2
argsNum["IP.DEST"] = 2
argsNum["IP.DST"] = 2 

argsNum["TCP.PORT"] = 2
argsNum["TCP.SRC"] = 2
argsNum["TCP.DSTPORT"] = 2
argsNum["TCP.DST"] = 2 
argsNum["TCP.DEST"] = 2 




splitFilter("IP.ADDR == 192.168.0.102")
splitFilter("IP.ADDR == 192.168.0.102 && TCP")
