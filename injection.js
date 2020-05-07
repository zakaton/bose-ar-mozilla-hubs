function sendMessage(message) {
    message.boseAR = true;
    message.from = "injection.js";

    window.postMessage(message);
}

// content.js => injection.js
window.addEventListener("message", event => {
    if(event.data.boseAR && event.data.from !== "injection.js") {
        switch(event.data.case) {
            case "connect":
                window.boseARDeviceElement.addEventListener("connect", event => {
                    window.postMessage({
                        boseAR : true,
                        from : "injection.js",
                        case : "connected",
                    });
                });
                window.boseARDeviceElement.connect();                
                break;
            case "isConnected":
                window.postMessage({
                    boseAR : true,
                    from : "injection.js",
                    case : "isConnected",
                    isConnected : window.boseARDeviceElement.boseARDevice.isConnected,
                });
                break;
            default:
                break;
        }
    }
});

const avatar = document.querySelector("#avatar-pov-node")

if(avatar && window.boseARDeviceElement == undefined) {
    const order = 'YXZ';
    const euler = new THREE.Euler(undefined, undefined, undefined, order);
    const eulerOffset = new THREE.Euler(undefined, undefined, undefined, order);
    let recallibrate = true;
    const callibrate = () => {
        eulerOffset.copy(euler);
        recallibrate = false;
    };
    const scalar = {
        x : 1,
        y : 1,
        z : 1,
    };
    
    const boseARDeviceElement = window.boseARDeviceElement = document.createElement("bose-ar-device");
    boseARDeviceElement.setAttribute('rotation', 20);
    boseARDeviceElement.setAttribute('double-tap', '');

    boseARDeviceElement.addEventListener("doubleTap", event => {
        recallibrate = true;
    });
    
    boseARDeviceElement.addEventListener("rotation", event => {
        euler.x = Number(event.target.getAttribute("rotationpitch")) + (Math.PI/2);
        euler.y = -Number(event.target.getAttribute("rotationyaw"));
        euler.z = Number(event.target.getAttribute("rotationroll"));

        if(recallibrate)
            callibrate();
    
        euler.x = (euler.x - eulerOffset.x) * scalar.x;
        euler.y = (euler.y - eulerOffset.y) * scalar.y;
        euler.z = (euler.z - eulerOffset.z) * scalar.z;
        
        avatar.object3D.rotation.copy(euler);
    });
    
    boseARDeviceElement.style.display = "none";
    document.body.appendChild(boseARDeviceElement);
    
    /*
    window.addEventListener('click', event => {
        console.log(boseARDeviceElement);
        boseARDeviceElement.connect();
    }, {once:true});
    */
}