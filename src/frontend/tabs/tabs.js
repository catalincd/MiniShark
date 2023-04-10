var tabsElementArray = []
var tabsData = []
var mainBoardElement;
var tabsElement;
var newTabButton;
var lastTab = 0
var tabsHistory = []
var interfaces = null
var interfaceNames = null
var activeTabIdx = -1

var newTabHtml = ""
var tabLock = false


const addNewTab = (title = "New Tab") => {

    const newTabElement = document.createElement("div");

    newTabElement.id = `tab${lastTab}`
    newTabElement.className = `tab`
    newTabElement.innerHTML = ` <p class="tabTitle" data-tabid="${lastTab}" onclick="selectTabElement(this)">${title}</p>
                                <div class="tabGradient" data-tabid="${lastTab}" onclick="selectTabElement(this)"></div>
                                <div class="tabClose" data-tabid="${lastTab}" onclick="closeTab(this)">
                                    <span class="material-symbols-outlined" >
                                        close
                                    </span>
                                </div>`

    tabsData.push({ id: lastTab, data: null, animated: true, closed: false})
    tabsElementArray.push(newTabElement)
    tabsElement.insertBefore(newTabElement, newTabButton);

    selectTab(lastTab)


    lastTab += 1
}


const getCurrentTabData = () => {
    return tabsData[activeTabIdx].data
}


const selectFile = (element) => {

    if (element.files && element.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
            output = e.target.result
            parseLoadedBytes(output)
            setTabTitle(activeTabIdx, element.files[0].name.toString())
            tabLock = false
        }
        tabLock = true
        reader.readAsArrayBuffer(element.files[0])
    } else {
        console.log("COX FILE")
    }
}

const parseLoadedBytes = async (xts) => {
    const parsed = await window.API.readPcapBytes(xts)

    tabsData[activeTabIdx].data = parsed
    console.log(tabsData[activeTabIdx].data)
    tabsData[activeTabIdx].html = getHtmlFromData(parsed)
    

    selectTab(activeTabIdx)
    tabsData[activeTabIdx].animated = false
}



const selectTabElement = (element) => {
    selectTab(element.dataset.tabid)
}

const selectTab = (idx) => {
    if (tabLock)
        return

    if (activeTabIdx != idx) {
        tabsHistory.push(idx)
        activeTabIdx = idx
        for (var i = 0; i < tabsElementArray.length; i++) {
            tabsElementArray[i].classList.remove("activeTab")
        }
        tabsElementArray[idx].classList.add("activeTab")
    }

    if (tabsData[activeTabIdx].data == undefined || tabsData[activeTabIdx].data == null) {
        mainBoardElement.innerHTML = newTabHtml
        loadInterfaces()
    }
    else {
        mainBoardElement.innerHTML = reparseHtml(tabsData[activeTabIdx].html, tabsData[activeTabIdx])
        if(tabsData[activeTabIdx].currentPacket != undefined)
        {
            hotSelectPacket(tabsData[activeTabIdx].currentPacket)
        }
    }

}

const setCurrentPacketSelected = (idx) => {
    tabsData[activeTabIdx].currentPacket = idx
}


const closeTab = async (element) => {
    //REMOVE
    console.log(`Close: ${element.dataset["tabid"]}`)

    const idx = parseInt(element.dataset["tabid"])

    tabsHistory = tabsHistory.filter(
        tabIdx => tabIdx != idx
    )

    if(idx == activeTabIdx)
    {
        selectTab(tabsHistory[tabsHistory.length - 1])
    }

    
    //dont do this, will reopen eventually
    //maybe remove innerHTML???
    //tabsElementArray.splice(idx, 1)
    
    
    tabsData[idx].closed = true
    document.getElementById(`tab${idx}`).classList.add("closedTab");
    setTimeout(() => {
        document.getElementById(`tab${idx}`).style.display = "none";
    }, 500)

    await window.API.closeInstance(tabsData[idx].subscriberId)
}


const setTabTitle = (idx, title) => {
    //maybe set in data as well?
    document.getElementById(`tab${idx}`).querySelector(".tabTitle").innerHTML = title
}





window.addEventListener("load", async () => {

    preloadInterfaces()

    tabsElement = document.getElementById("tabs")
    newTabButton = document.getElementById("newTab")
    mainBoardElement = document.getElementById("mainboard")
    newTabHtml = await window.API.readStringFile('/frontend/html/newTab.html')

    addNewTab("New Tab")
})


