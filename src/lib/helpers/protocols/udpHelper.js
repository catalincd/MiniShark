const getInfo = ({source, destination, length}) => {
    return `${source} → ${destination} Len: ${length}`
}


exports.parse = (payload) => {
    const header = {
        source: payload["readUInt16BE"](0, true),
        destination: payload["readUInt16BE"](2, true),
        length: payload["readUInt16BE"](4, true),
        checksum: payload["readUInt16BE"](6, true)
    }

    const info = getInfo(header)
    const udpPayload = payload.slice(8)

    return {info, header}
}