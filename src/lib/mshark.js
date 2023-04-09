const Cap = require('cap').Cap;
const parser = require('./parser')

 
var capInstances = []
var lastCap = 0


const getNewInstance = (ip = "192.168.1.254", filter = "tcp") => {
    const device = Cap.findDevice(ip);
    const bufSize = 10 * 1024 * 1024;
    var buffer = Buffer.alloc(65535);
    var cap = new Cap();
    const linkType = cap.open(device, filter, bufSize, buffer);
    const thisId = lastCap
    
    cap.setMinBytes && cap.setMinBytes(0);
    
    cap.on('packet', function(bytesNum, isTrunc) {
        var thisPacket = parser.readFromBytes(buffer.slice(0, bytesNum))
        capInstances[thisId].packets.push(thisPacket)
        console.log(thisPacket)
    });

    var packets = []
    var packetsNum = 0
    capInstances[lastCap++] = {cap, packets, packetsNum}
    return thisId
}


exports.getNewInstance = getNewInstance