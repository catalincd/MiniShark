
console.log("HELLO")



const init = async () => {
    const file = await window.API.readPcapFile('/home/wizard/Workspace/testshark/jaxy.pcap')
    console.log(file)
}


//init()

