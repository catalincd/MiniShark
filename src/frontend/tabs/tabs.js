var tabsElementArray = []
var tabsData = []
var mainBoardElement;
var tabsElement;
var newTabButton;
var lastTab = 0
var tabsHistory = []
var activeIdx = -1

var newTabHtml = ""
var tabLock = false


const addNewTab = (title = "New Tab") => {

    const newTabElement = document.createElement("div");

    newTabElement.id = `tab${lastTab}`
    newTabElement.className = `tab`
    newTabElement.innerHTML = ` <p class="tabTitle" data-tabid="${lastTab}" onclick="selectTabElement(this)">${title}</p>
                                <div class="tabGradient"></div>
                                <div class="tabClose" data-tabid="${lastTab}" onclick="closeTab(this)">
                                    <span class="material-symbols-outlined" >
                                        close
                                    </span>
                                </div>`

    tabsData.push({ id: lastTab, data: null })
    tabsElementArray.push(newTabElement)
    tabsElement.insertBefore(newTabElement, newTabButton);

    selectTab(lastTab)


    lastTab += 1
}


const selectFile = (element) => {

    if (element.files && element.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
            output = e.target.result
            parseLoadedBytes(output)
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
    tabsData[activeIdx].data = parsed
    tabsData[activeIdx].html = getHtmlFromData(parsed)
    selectTab(activeIdx)
}

const getHtmlFromData = (data) => {
    return JSON.stringify(data)
}

const selectTabElement = (element) => {
    selectTab(element.dataset.tabid)
}

const selectTab = (idx) => {
    if (tabLock)
        return

    if (activeIdx != idx) {
        tabsHistory.push(idx)
        activeIdx = idx
        for (var i = 0; i < tabsElementArray.length; i++) {
            tabsElementArray[i].classList.remove("activeTab")
        }
        tabsElementArray[idx].classList.add("activeTab")
    }

    if (tabsData[activeIdx].data == undefined || tabsData[activeIdx].data == null) {
        mainBoardElement.innerHTML = newTabHtml
    }
    else {
        mainBoardElement.innerHTML = tabsData[activeIdx].html
    }


}


const closeTab = (element) => {
    //REMOVE
    console.log(`Close: ${element.dataset["tabid"]}`)

    const idx = parseInt(element.dataset["tabid"])
    
    //dont do this, will reopen eventually
    //maybe remove innerHTML???
    //tabsElementArray.splice(idx, 1)
    
    
    
    document.getElementById(`tab${idx}`).classList.add("closedTab");
    setTimeout(() => {
        document.getElementById(`tab${idx}`).style.display = "none";
    }, 500)
}





window.addEventListener("load", async () => {

    tabsElement = document.getElementById("tabs")
    newTabButton = document.getElementById("newTab")
    mainBoardElement = document.getElementById("mainboard")
    newTabHtml = await window.API.readStringFile('/frontend/html/newTab.html')


    addNewTab("New Tab")
})


