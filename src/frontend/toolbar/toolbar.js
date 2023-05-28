var CHAR_VIEW = false

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
            chars[i].classList.add("hidden")

        for(var i=0;i<hexes.length;i++)
            hexes[i].classList.remove("hidden")
    }else{
        
        for(var i=0;i<chars.length;i++)
            chars[i].classList.remove("hidden")

        for(var i=0;i<hexes.length;i++)
            hexes[i].classList.add("hidden")
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