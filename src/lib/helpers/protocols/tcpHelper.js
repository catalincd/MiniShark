const getInfo = ({source, destination, flags}, packetLength) => {

    //console.log(flags)
    var checkedFlags = []
    var flagNames = Object.keys(flags)
    for(var i=0;i<flagNames.length;i++){
        if(flagNames[i] != "dataOffset" && flags[flagNames[i]] == "1")
        {
            checkedFlags.push(`${flagNames[i]}`)
        }
    }

    var flagsStr = ""
    if(checkedFlags.length > 0)
        flagsStr = `[${checkedFlags.join(', ')}]`

    return `${source} → ${destination} ${flagsStr} Len: ${packetLength}`
}

const hex2bin = (n) => (parseInt(n, 16).toString(2)).padStart(16, '0')

const getTCPFlags = (xts) => {
    const xString = hex2bin(xts.toString("hex"))

    //console.log(xts.toString("hex"))
    //console.log(xString)

    const flags = {
        dataOffset: parseInt(xString.substring(0, 4), 2),
        CWR: xString[8],
        ECE: xString[9],
        URG: xString[10],
        ACK: xString[11],
        PSH: xString[12],
        RST: xString[13],
        SYN: xString[14],
        FIN: xString[15],
    }
    //console.log(flags)

    return flags
}


exports.parse = (payload) => {
    const header = {
        source: payload["readUInt16BE"](0),
        destination: payload["readUInt16BE"](2),
        windowSize: payload["readUInt16BE"](14),
        checkSum: payload["readUInt16BE"](16),
        urgentPointer: payload["readUInt16BE"](18),
        flags: getTCPFlags(payload.subarray(12, 14)),
    }


    const tcpPayload = payload.slice(header.flags["dataOffset"] * 4)
    const packetLength = tcpPayload.length
    const info = getInfo(header, packetLength)
    

    return {header, info}
}