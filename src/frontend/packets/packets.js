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
    return `<span class="hexSpan">${hex}</span>
            <span class="charSpan hidden" >${hexToChar(hex)}</span>`
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

    var headersHTML = ""

    headersHTML += "<p>Ethernet II</p>"
    headersHTML += `<ul class="headersList">
                        <li>Destination: ${thisPacket.ether.destination}</li>
                        <li>Source: ${thisPacket.ether.source}</li>
                        <li>Type: ${matchType(thisPacket.ether.type)}</li>
                    </ul>`

    headersHTML += "<br><p>IPv4</p>"
    headersHTML += `<ul class="headersList">
                        <li>Destination: ${thisPacket.ipvx.destination}</li>
                        <li>Source: ${thisPacket.ipvx.source}</li>
                    </ul>`

    headersElement.innerHTML = headersHTML
}


const matchType = (type) => {
    if (type == "0800")
        return "IPv4 (0x0800)"

    return "UKNWN"
}



window.addEventListener("load", async () => {
    //print cox
})
