


const setPage = (pageName) => {
    const pages = document.getElementsByClassName("mainPage")

    for(var i=0;i<pages.length;i++)
    {
        pages[i].style.display = "none";
    }

    const currentPage = document.getElementById(pageName);

    if(currentPage)
        currentPage.style.display = "grid";
}


const select = (element, className="device") => {
    const elements = document.getElementsByClassName(className)

    for(var i=0;i<elements.length;i++)
    {
        elements[i].classList.remove("selected");
    }

    element.classList.remove("selected")
    element.classList.add("selected")
}


const loadDevices = async () => {
    const intefaces = await window.electronAPI.getInterfaces()
    const names = Object.keys(intefaces)
    console.log(intefaces)

    let deviceList = document.getElementById("deviceList");
    
    var html = ""

    for(var i=0;i<names.length;i++)
    {
        html += `<div class="device" onclick="select(this)" data-id="${i}">
                    <p class="deviceName">${names[i]}</p>
                    <p class="deviceIp">${intefaces[names[i]][0].address}</p>
                </div>`
    }
    console.log(html)
    deviceList.innerHTML = html
}


window.addEventListener("load", () => {
    loadDevices();
    setPage("devicePicker");
})