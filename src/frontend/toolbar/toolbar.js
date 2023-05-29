var CHAR_VIEW = false



const clearSearchBar = (element) => {
    const searchBar = document.getElementById("filter_input")
    searchBar.value = ""

    filterPacketsSearch(element)
}

const filterPacketsSearch = (element) => {
    const allPacketLines = document.getElementsByClassName("packetLine")
    const searchBar = document.getElementById("filter_input")
    const filter = searchBar.value
    

    searchBar.classList.remove("failed")

    if(allPacketLines == null){
        return
    }

    if(filter.length < 1 || filter == "" || filter == "Display filter..."){
        for(var i=0;i<allPacketLines.length;i++)
            allPacketLines[i].classList.remove("filtered")
        
        return
    }

    const filteredPacketIds = filterPacketsArray(tabsData[activeTabIdx].data.allPackets, filter) 

    try{
        for(var i=0;i<allPacketLines.length;i++){
            const thisId = parseInt(allPacketLines[i].dataset.idx)
    
            if(filteredPacketIds.includes(thisId)){
                allPacketLines[i].classList.remove("filtered")
            }else{
                allPacketLines[i].classList.add("filtered")
            }
            
            console.log(`THIS ID: ${thisId}`)
        }
    }
    catch(ex){
        console.log(filter)
        searchBar.classList.add("failed")
    }


}


const saveCurrentTab = async () => {
    console.log(tabsData[activeTabIdx])
    await window.API.savePCAP(tabsData[activeTabIdx].data)
}


const disableStartStop = () => {
    document.getElementById("startCapButton").classList.add("disabled")
    document.getElementById("stopCapButton").classList.add("disabled")
}

const stopCapturing = (button) => {

    if(button.classList.contains("disabled"))
        return

    tabsData[activeTabIdx].capturing = false

    document.getElementById("startCapButton").classList.remove("disabled")
    document.getElementById("stopCapButton").classList.add("disabled")
}

const startCapturing = (button) => {
    if(button.classList.contains("disabled"))
        return

    tabsData[activeTabIdx].capturing = true

    document.getElementById("startCapButton").classList.add("disabled")
    document.getElementById("stopCapButton").classList.remove("disabled")
}


const zoomIn = () => {
    const html = document.getElementsByTagName('html')[0];
    const style = window.getComputedStyle(html, null).getPropertyValue('font-size');
    const fontSize = parseFloat(style); 
    html.style.fontSize = (fontSize + 1) + 'px';
}

const zoomOut = () => {
    const html = document.getElementsByTagName('html')[0];
    const style = window.getComputedStyle(html, null).getPropertyValue('font-size');
    const fontSize = parseFloat(style); 
    html.style.fontSize = (fontSize - 1) + 'px';
}

const toggleCharView = () => {

    console.log("toggleCharView")

    CHAR_VIEW = !CHAR_VIEW

    const chars = document.getElementsByClassName("charSpan")
    const hexes = document.getElementsByClassName("hexSpan")


    if(CHAR_VIEW){
        for(var i=0;i<chars.length;i++)
            chars[i].classList.remove("hidden")

        for(var i=0;i<hexes.length;i++)
            hexes[i].classList.add("hidden")
    }else{
        for(var i=0;i<chars.length;i++)
            chars[i].classList.add("hidden")

        for(var i=0;i<hexes.length;i++)
            hexes[i].classList.remove("hidden")
    }
}


const focusToolbar = (toolbar) => {
    if(toolbar.classList.contains("notchanged"))
    {
        toolbar.classList.remove("notchanged")
        toolbar.value = ""
    }
}


const changeToolbar = (toolbar) => {
    console.log(toolbar)
}