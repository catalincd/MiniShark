const getHtmlFromData = (data) => {
    console.log(data)

    var packetsHtml = ""

    if (data.allPackets.length <= 0) {
        console.log("COX FILE NO PACKETS")
        return
    }

    const originalSeconds = data.allPackets[0].header.timestampSeconds

    for (var i = 0; i < data.allPackets.length; i++) {
        packetsHtml += packetToHtml(data.allPackets[i], i, originalSeconds)
    }


    const tableHead = `<div id="packetTableHead">
                            <div class="packetCell tableHead">
                                <p class="packetNum">Nr</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetTime">Time</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetSrc">Source</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetDest">Destination</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetProtocol">Protocol</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetLength">Length</p>
                            </div>
                        </div>`

    return `<div id="mainGrid">
                <div id="packetsWrapper">
                    <div id="packetsTableWrapper" class="wrapper">
                        ${tableHead}
                        <div id="packetsTable">
                            <div id="tableTopGradient"></div>
                            ${packetsHtml}
                            <div id="tableBottomGradient"></div>
                        </div>
                    </div>
                    <div id="packetsScrollBarWrapper">
                        <div id="packetsScrollBar"></div>
                    </div>
                </div>
                <div id="detailsWrapper">
                    <div id="headersWrapper">
                        <div id="headerValues"></div>
                    </div>
                    <div id="hexWrapper">
                        <div id="hexNumColumn"></div>
                        <div id="hexValues"></div>
                    </div>
                </div>
            </div>`
}


const packetToHtml = (packet, num, originalSeconds) => {
    return `<div class="packetLine" data-packetid="${num}" onclick="selectPacketElement(this)" style="animation-delay: ${Math.min(num * 35, 1000)}ms" data-idx="${num}">
                <div class="packetCell">
                    <p class="packetNum">${num + 1}</p>
                </div>
                <div class="packetCell">
                    <p class="packetTime">${microToSeconds(packet.header.timestampMicroseconds, packet.header.timestampSeconds, originalSeconds)}</p>
                </div>
                <div class="packetCell">
                    <p class="packetSrc">${packet.ipvx.source}</p>
                </div>
                <div class="packetCell">
                    <p class="packetDest">${packet.ipvx.destination}</p>
                </div>
                <div class="packetCell">
                    <p class="packetProtocol">${"TCP"}</p>
                </div>
                <div class="packetCell">
                    <p class="packetLength">${packet.header.capturedLength}</p>
                </div>
                <div class="packetControls">
                    <span class="material-symbols-outlined copyButton">
                        content_copy
                    </span>
                    <span class="material-symbols-outlined deleteButton">
                        delete
                    </span>
                </div>
            </div>`
}

const reparseHtml = (html, { animated }) => {

    var parsedHtml = html

    if (!animated) {
        parsedHtml = html.replace(/packetLine/g, "packetLine static")
    }

    return parsedHtml
}


const microToSeconds = (micro, seconds, original) => {

    return ((seconds - original) + (micro / 1000000)).toFixed(3)
}