var toolbarHtml = ""

window.addEventListener("load", async () => {
    toolbarHtml = await window.API.readStringFile('/frontend/html/toolbar.html')
})


const getHtmlFromData = (data) => {
    console.log(data)

    var packetsHtml = ""
    

    //maybe dont do that
    /*
    if (data.allPackets.length <= 0) {
        console.log("COX FILE NO PACKETS")
        return
    }
    */

    var originalSeconds = 0
    
    if(data != null){
        originalSeconds = data.allPackets[0].header.timestampSeconds
        originalMicroSeconds = data.allPackets[0].header.timestampMicroseconds

        for (var i = 0; i < data.allPackets.length; i++) {
            packetsHtml += packetToHtml(data.allPackets[i], i, originalSeconds, originalMicroSeconds)
        }
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
                                <p class="packetLength">Len</p>
                            </div>
                            <div class="packetCell tableHead">
                                <p class="packetInfo">Info</p>
                            </div>
                        </div>`

    return `<div id="tabWrapper">
                ${toolbarHtml}
                <div id="mainGrid">
                    <div id="packetsWrapper">
                        <div id="packetsTableWrapper" class="wrapper">
                            ${tableHead}
                            <div id="packetsTable">
                                <div id="tableTopGradient"></div>
                                ${packetsHtml}
                                <div id="replacer"></div>
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
                </div>   
            </div>`
}


const packetToHtml = (packet, num, originalSeconds, originalMicroSeconds, animate = true) => {
    return `<div class="packetLine ${animate? "":"static"}" data-packetid="${num}" onclick="selectPacketElement(this)" style="animation-delay: ${Math.min(num * 35, 1000)}ms" data-idx="${num}">
                <div class="packetCell">
                    <p class="packetNum">${num + 1}</p>
                </div>
                <div class="packetCell">
                    <p class="packetTime">${microToSeconds(packet.header.timestampMicroseconds, packet.header.timestampSeconds, originalSeconds, originalMicroSeconds)}</p>
                </div>
                <div class="packetCell">
                    <p class="packetSrc">${packet.ipvx.source}</p>
                </div>
                <div class="packetCell">
                    <p class="packetDest">${packet.ipvx.destination}</p>
                </div>
                <div class="packetCell">
                    <p class="packetProtocol">${packet.protocolName}</p>
                </div>
                <div class="packetCell">
                    <p class="packetLength">${packet.header.capturedLength}</p>
                </div>
                <div class="packetCell">
                    <p class="packetInfo">${parseInfo(packet)}</p>
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


const replacer = `<div id="replacer"></div>`

const addHtml = (html, newHtml) => {
    console.log("ORIGINAL/REPLACED")
    
    const replaced = html.replace(replacer, newHtml + replacer)
    console.log(html)
    console.log(replaced)
    return replaced
}

const reparseHtml = (html, { animated }) => {

    var parsedHtml = html

    if (!animated) {
        parsedHtml = html.replace(/packetLine/g, "packetLine static")
    }

    return parsedHtml
}

const microToSeconds = (micro, seconds, original, originalMicro) => {

    return ((seconds - original) + ((micro - originalMicro) / 1000000)).toFixed(3)
}


const parseInfo = (packet) => {
    if(packet.protocolData && packet.protocolData.info){
        return packet.protocolData.info
    }

    return "Application Data"
}