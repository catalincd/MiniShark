
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