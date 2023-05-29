
const fs = require('fs')
const dialog = require('node-file-dialog')
const config = {type:'save-file'}

const GLOBAL_HEADER_LENGTH = 24; 
const PACKET_HEADER_LENGTH = 16; 
const encoding = "LE"


const dataToPacketBytes = (data, packetHeader) => {
    var finalBuffer = null;
    try{
        var header = Buffer.alloc(PACKET_HEADER_LENGTH)

        header['writeUInt32' + encoding](packetHeader.timestampSeconds, 0)
        header['writeUInt32' + encoding](packetHeader.timestampMicroseconds, 4)
        header['writeUInt32' + encoding](packetHeader.capturedLength, 8)
        header['writeUInt32' + encoding](packetHeader.originalLength, 12)
        
        finalBuffer = Buffer.concat([header, Buffer.from(data)])
    }
    catch(ex){
        console.log("FAILED PARSING PACKET")
    }

    return finalBuffer
}

const dataToBytes = (data) => {

    console.log("COXLINE")
    console.log(data)
    
    var header = Buffer.alloc(GLOBAL_HEADER_LENGTH)

    //3569595041 BE
    //2712847316 LE

    header['writeUInt32' + encoding](2712847316, 0)
    header['writeUInt16' + encoding](2, 4)
    header['writeUInt16' + encoding](4, 6)
    header['writeUInt32' + encoding](0, 8)
    header['writeUInt32' + encoding](0, 12)
    header['writeUInt32' + encoding](262144, 16)
    header['writeUInt32' + encoding](1, 20)


    var packets = data.allPackets.map(x => dataToPacketBytes(x.data, x.header))

    return Buffer.concat([header, ...packets])
}



const saveFile = async (data) => {
    dialog(config)
    .then(path => exportData(data, path[0]))
    .catch(err => console.log(err))
}


const exportData = async (data, path) => {
    fs.writeFile(path, dataToBytes(data), (err) => {});
}



exports.saveFile = saveFile