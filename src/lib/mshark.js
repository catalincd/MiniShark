const Cap = require('cap').Cap;
const parser = require('./parser')
 
var capInstances = []
var lastCap = 0


const getNewInstance = (ip, filter = "") => {
    console.log(ip)
    const device = Cap.findDevice(ip);
    console.log(device)

    const bufSize = 10 * 1024 * 1024;
    var buffer = Buffer.alloc(65535);
    var cap = new Cap();
    const linkType = cap.open(device, filter, bufSize, buffer);
    const thisId = lastCap


    cap.providerId = thisId
    cap.setMinBytes && cap.setMinBytes(0);
    
    cap.on('packet', (bytesNum, isTrunc) => {
        if(capInstances[cap.providerId] == null)
            return

        var thisPacket = buffer.slice(0, bytesNum)
        var hotFixedPacket = parser.hotFixCapPacket(thisPacket, bytesNum, "BE")
        var packetData = parser.bytesToPacket(hotFixedPacket, "BE")

        capInstances[cap.providerId].packets.push(packetData)
        capInstances[cap.providerId].packetsNum++

        
    });

    var packets = []
    var packetsNum = 0
    capInstances[lastCap++] = {cap, packets, packetsNum}
    return thisId
}


const getPackets = (id) => {
    var packets = capInstances[id].packets
    var packetsCopy = [...packets]
    capInstances[id].packets = []
    return packetsCopy
}

const closeInstance = (id) => {

    console.log("HANDLE CLOSE")

    try{
        capInstances[id].cap.close()
        capInstances[id] = null
    }
    catch(ex){
        console.log(`FAILED CLOSING INSTANCE: ${id}`)
    }
}


exports.getNewInstance = getNewInstance
exports.getPackets = getPackets
exports.closeInstance = closeInstance