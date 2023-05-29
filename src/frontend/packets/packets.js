var hexColumnsElement
var hexValuesElement
var headersElement

var activePacketIdx = -1


const selectPacketElement = (element) => {
    selectPacket(element.dataset.packetid, element)
}

const buf2hex = (buffer) => [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0'))


const getNum = (num) => {
    var str = ""
    var added = 3 - num.toString().length
    for (var i = 0; i < added; i++)
        str += "0"
    str += num.toString() + "0"
    return str
}


const selectPacket = (idx, activeElement) => {

    const allPacketElements = document.getElementsByClassName("packetLine")
    for (var i = 0; i < allPacketElements.length; i++)
        allPacketElements[i].classList.remove("active")

    activeElement.classList.add("active")

    hotSelectPacket(idx)
}

const hexToChar = (hex) => {
    return String.fromCharCode(parseInt(hex, 16))
}

const genHexChar = (hex) => {

    const hexHidden = CHAR_VIEW? "hidden":""
    const charHidden = CHAR_VIEW? "":"hidden"

    return `<span class="hexSpan ${hexHidden}">${hex}</span>
            <span class="charSpan ${charHidden}" >${hexToChar(hex)}</span>`
}

const hotSelectPacket = (idx) => { //////TO DO: add html class to selected element
    activePacketIdx = idx
    hexColumnsElement = document.getElementById("hexNumColumn")
    hexValuesElement = document.getElementById("hexValues")

    headersElement = document.getElementById("headerValues")

    const data = getCurrentTabData()
    const thisPacket = data.allPackets[idx]
    // console.log(data)
    setCurrentPacketSelected(idx)

    const packetLineElements = document.getElementsByClassName("packetLine")
    for(var i=0;i<packetLineElements.length;i++)
    {
        if(packetLineElements[i].dataset.packetid == idx)
        {
            packetLineElements[i].classList.add("active")
            break
        }
    }
    

    //hex
    var hexArray = buf2hex(thisPacket.data)
    var cnt = 0
    var hexNumHTML = ""
    var hexValueHTML = ""


    while (hexArray.length > 0) {
        hexNumHTML += `<span>${getNum(cnt)}</span>`

        currentHexArray = hexArray.slice(0, 16)
        hexArray = hexArray.slice(16)

        hexValueHTML += currentHexArray.map(hex => genHexChar(hex)).join('')

        cnt++
    }

    hexColumnsElement.innerHTML = hexNumHTML
    hexColumnsElement.style.display = "grid"

    hexValuesElement.innerHTML = hexValueHTML

    //headers 

    headersElement.innerHTML = parseHeaders(thisPacket)
}


const parseIPv4 = (ipvx) => {
    var ipv4HTML = ""

    ipv4HTML += "<br><p>IPv4</p>"
    ipv4HTML += `<ul class="headersList">
                        <li>Header Checksum: 0x${ipvx.headerChecksum.toUpperCase()}</li>
                        <li>Identification: 0x${ipvx.identification.toUpperCase()}</li>
                        <li>Time to live: ${ipvx.ttl}</li>
                        <li>Destination: ${ipvx.destination}</li>
                        <li>Source: ${ipvx.source}</li>
                    </ul>`

    return ipv4HTML
}


const parseUDP = (protocolData) => {
    var udpHTML = ""
    
    udpHTML += "<p>User Datagram Protocol</p>"
    udpHTML += `<ul class="headersList">
                    <li>Source Port: ${protocolData.source}</li>
                    <li>Destination Port: ${protocolData.destination}</li>
                    <li>Length: ${protocolData.length}</li>
                    <li>Checksum: 0x${protocolData.checksum}</li>
                </ul>`

    return udpHTML
}

const parseTCP = (protocolData) => {
    var tcpHTML = ""
    
    tcpHTML += "<p>Transmission Control Protocol</p>"
    tcpHTML += `<ul class="headersList">
                    <li>Source Port: ${protocolData.source}</li>
                    <li>Destination Port: ${protocolData.destination}</li>
                    <li>Checksum: 0x${protocolData.checkSum.toUpperCase()}</li>
                    <li>Sequence Number: 0x${protocolData.sequenceNumber}</li>
                    <li>Acknolegdement Number: 0x${protocolData.ackNumber}</li>
                    <li>Urgent Pointer: 0x${protocolData.urgentPointer}</li>
                    <li>Window: 0x${protocolData.windowSize}</li>
                    <li>Flags: ${""}</li>
                </ul>`

    return tcpHTML
}

const parseICMP = (protocolData) => {
    var icmpHTML = ""
    
    icmpHTML += "<p>Internet Control Message Protocol</p>"
    icmpHTML += `<ul class="headersList">
                    <li>Type: 0x${protocolData.type.toUpperCase()}</li>
                    <li>Code: 0x${protocolData.code.toUpperCase()}</li>
                    <li>Checksum: 0x${protocolData.checkSum}</li>
                </ul>`

    return icmpHTML
}


const parseHeaders = (thisPacket) => {
    var headersHTML = ""
    
    headersHTML += "<p>Ethernet II</p>"
    headersHTML += `<ul class="headersList">
                        <li>Destination: ${thisPacket.ether.destination}</li>
                        <li>Source: ${thisPacket.ether.source}</li>
                        <li>Type: ${matchType(thisPacket.ether.type)}</li>
                    </ul>`

    if(thisPacket.ipvx.type == 4){
        headersHTML += parseIPv4(thisPacket.ipvx)
    }

    if(thisPacket.protocolName == "UDP"){
        headersHTML += parseUDP(thisPacket.protocolData.header)
    }

    if(thisPacket.protocolName == "TCP"){
        headersHTML += parseTCP(thisPacket.protocolData.header)
    }

    if(thisPacket.protocolName == "ICMP"){
        headersHTML += parseICMP(thisPacket.protocolData.header)
    }

    return headersHTML
}

const matchType = (type) => {
    if (type == "0800")
        return "IPv4 (0x0800)"

    return "UKNWN"
}



window.addEventListener("load", async () => {
    //print cox
})
