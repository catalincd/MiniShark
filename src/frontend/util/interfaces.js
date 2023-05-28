const getIPv4 = (interface) => {
    ///if windows / linux

    //on win:
    return interface[interface.length - 1]
}



const getIcon = (interface) => {
    
    if(interface.indexOf("wi") != -1 || interface.indexOf("Wi") != -1 || interface.indexOf("WI") != -1)
        return "wifi"

    return "lan"
}


const preloadInterfaces = async () => {
    interfaces = await window.API.getInterfaces()
    interfaceNames = Object.keys(interfaces)
}


const loadInterfaces = async () => {
    let deviceList = document.getElementById("deviceList");
    
    var html = ""

    for(var i=0;i<interfaceNames.length;i++)
    {
        html += `<div class="interface" onclick="openInterface(this)" data-id="${i}">
                    <p class="deviceName">
                        <span class="material-symbols-outlined">
                            ${getIcon(interfaceNames[i])}
                        </span>
                        ${interfaceNames[i]}
                    </p>
                    <p class="deviceIp">${getIPv4(interfaces[interfaceNames[i]]).address}</p>
                </div>`
    }

    deviceList.innerHTML = html
}


const openInterface = async (element) => {
    const thisInterface = interfaces[interfaceNames[element.dataset.id]]
    const thisIp = getIPv4(thisInterface)
    const ip = thisIp.address
    const filter = 'tcp'
    const newSubscriberId = await window.API.getNewInstance({ip, filter})

    const thisActiveIdx = activeTabIdx

    tabsData[thisActiveIdx].capturing = true
    tabsData[thisActiveIdx].subscriberId = newSubscriberId

    setTabTitle(thisActiveIdx, interfaceNames[element.dataset.id])

    tabsData[thisActiveIdx].data = []
    tabsData[thisActiveIdx].html = getHtmlFromData(null)
    
    tabsData[thisActiveIdx].animated = false
    selectTab(thisActiveIdx)
    refreshTab(thisActiveIdx)

    console.log(newSubscriberId)
}


const refreshTab = async (tabIdx) => {
    //tabsData[tabIdx]
    const subId = tabsData[tabIdx].subscriberId
    
    if(tabsData[tabIdx].closed){
        return
    }

    
    const newPackets = await window.API.getInstacePackets(subId)

    if(tabsData[tabIdx].data.allPackets == undefined && newPackets.length > 0){
        console.log("NEW ORIGINAL")
        tabsData[tabIdx].data.allPackets = []
        tabsData[tabIdx].originalSeconds = newPackets[0].header.timestampSeconds
        tabsData[tabIdx].lastPacketId = 0
    }

    
    
    var packetsHtml = ""

    for(var i=0;i<newPackets.length;i++){
        packetsHtml += packetToHtml(newPackets[i], tabsData[tabIdx].lastPacketId + i, tabsData[tabIdx].originalSeconds, false)
        tabsData[tabIdx].data.allPackets.push(newPackets[i])
    }

    if(newPackets.length > 0){
        console.log(newPackets)
        tabsData[tabIdx].html = addHtml(tabsData[tabIdx].html, packetsHtml)
        tabsData[tabIdx].lastPacketId += newPackets.length

        if(activeTabIdx == tabIdx){
            const packetsTable = document.getElementById("packetsTable")
            packetsTable.innerHTML += packetsHtml
            ////revamp
            packetsTable.scrollTo(0, packetsTable.scrollHeight);
        }
    }

    
    setTimeout(refreshTab, 100, tabIdx)
}