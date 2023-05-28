const fs = require('fs');
const etherHelper = require('./helpers/etherHelper')

var GLOBAL_HEADER_LENGTH = 24; 
var PACKET_HEADER_LENGTH = 16; 

const getHeadersFromData = (packet, encoding = "BE") => {
    const ETHER_SIZE = 14

    const ether = {
        destination: bytesToMac(packet.subarray(0, 6)),
        source: bytesToMac(packet.subarray(6, 12)),
        type: packet.subarray(12, 14).toString('hex')
    }

    //check for other stuff like ipv6 here...
    
    const etherPayload = etherHelper.parseEther(ether.type, packet.slice(ETHER_SIZE));
    

    return {ether, ...etherPayload}
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

const readFromFile = (path) => {
    var file = fs.readFileSync(path)
    return readFromBytes(file)
}


const readFromBytes = (file) => {  
    const magicNumber = file.toString('hex', 0, 4)
    var encoding = "BE"

    if (magicNumber == "a1b2c3d4")
        encoding = "BE"
    else if (magicNumber == "d4c3b2a1")
        encoding = "LE"
    else return null

    var header = {
        magicNumber: file['readUInt32' + encoding](0, true),
        majorVersion: file['readUInt16' + encoding](4, true),
        minorVersion: file['readUInt16' + encoding](6, true),
        gmtOffset: file['readInt32' + encoding](8, true),
        timestampAccuracy: file['readUInt32' + encoding](12, true),
        snapshotLength: file['readUInt32' + encoding](16, true),
        linkLayerType: file['readUInt32' + encoding](20, true)
    };

    file = file.slice(GLOBAL_HEADER_LENGTH)
    var allPackets = []

    while (file.length > 0) {
        const nextPacket = bytesToPacket(file, encoding)
        allPackets.push(nextPacket)

        file = file.slice(PACKET_HEADER_LENGTH + nextPacket.header.capturedLength)
    }

    return {header, encoding, allPackets}
}


const hotFixCapPacket = (bytes, length, encoding = "BE") => {
    const buffer = Buffer.allocUnsafe(PACKET_HEADER_LENGTH);
    
    var ts = Date.now()

    const timestampSeconds = Math.floor(ts/1000)
    const timestampMicroseconds = (ts - (timestampSeconds * 1000)) * 1000

    buffer['writeUInt32' + encoding](timestampSeconds, 0)
    buffer['writeUInt32' + encoding](timestampMicroseconds, 4)
    buffer['writeUInt32' + encoding](length, 8)
    buffer['writeUInt32' + encoding](length, 12)

    return Buffer.concat([buffer, bytes])
}

const bytesToPacket = (bytes, encoding = "BE") => {

    // console.log(bytes)

    //should be sure that it is a good packet...
    const header = {
        timestampSeconds: bytes['readUInt32' + encoding](0, true),
        timestampMicroseconds: bytes['readUInt32' + encoding](4, true),
        capturedLength: bytes['readUInt32' + encoding](8, true),
        originalLength: bytes['readUInt32' + encoding](12, true)
    };

    const data = bytes.slice(PACKET_HEADER_LENGTH, header.capturedLength + PACKET_HEADER_LENGTH)
    const headers = getHeadersFromData(data, encoding)

    return {header, data, bytes, ...headers}
}

const pcapToBytes = (header, packets, encoding = "BE") => {
    const buffer = Buffer.allocUnsafe(24);

    buffer['writeUInt32' + encoding](header["magicNumber"], 0)
    buffer['writeUInt16' + encoding](header["majorVersion"], 4)
    buffer['writeUInt16' + encoding](header["minorVersion"], 6)
    buffer['writeInt32' + encoding](header["gmtOffset"], 8)
    buffer['writeUInt32' + encoding](header["timestampAccuracy"], 12)
    buffer['writeUInt32' + encoding](header["snapshotLength"], 16)
    buffer['writeUInt32' + encoding](header["linkLayerType"], 20)

    var packetBuffers = packets.map(packet => packetToBytes(packet))

    return Buffer.concat([buffer, ...packetBuffers])

}

const packetToBytes = (packet, encoding = "BE") => {
    const header = packet["header"]
    const buffer = Buffer.allocUnsafe(16);
    
    buffer['writeUInt32' + encoding](header["timestampSeconds"], 0)
    buffer['writeUInt32' + encoding](header["timestampMicroseconds"], 4)
    buffer['writeUInt32' + encoding](header["capturedLength"], 8)
    buffer['writeUInt32' + encoding](header["originalLength"], 12)

    return Buffer.concat([buffer, packet["data"]])
}


exports.pcapToBytes = pcapToBytes
exports.packetToBytes = packetToBytes
exports.readFromBytes = readFromBytes
exports.readFromFile = readFromFile
exports.getHeadersFromData = getHeadersFromData
exports.bytesToMac = bytesToMac
exports.bytesToPacket = bytesToPacket
exports.hotFixCapPacket = hotFixCapPacket

