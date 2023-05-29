const getInfo = ({type, code, checksum, content}) => {

    var details = ""

    if(type == "00") details = "Reply"
    if(type == "08") details = "Request"
        
    if(details != "")
        details = `(${details})`

    return `Echo Ping ${details}`
}


exports.parse = (payload) => {
    const header = {
        type: payload.subarray(0, 1).toString("hex"),
        code: payload.subarray(1, 2).toString("hex"),
        checksum: payload.subarray(2, 4).toString("hex"),
        content: payload.subarray(4, 8).toString("hex")
    }

    const info = getInfo(header)
    return {info, header}
}