// popup.js => injection.js
chrome.runtime.onMessage.addListener((message, sender, response) => {
    window.postMessage(message);
});

// popup.js <= injection.js
window.addEventListener("message", (event) => {
    if(event.data.boseAR)
        chrome.runtime.sendMessage(event.data);
});

window.addEventListener('keypress', event => {
    if(event.key == 'b') {
        // Script Injections
        const injectionScript = document.createElement('script');
            injectionScript.type = "text/javascript";
            injectionScript.src = chrome.extension.getURL("/injection.js");
        document.body.appendChild(injectionScript);
        
        const boseARInjectionScript = document.createElement('script');
            boseARInjectionScript.type = "text/javascript";
            boseARInjectionScript.src = chrome.extension.getURL("/bose-ar-web-sdk.min.js");
        document.body.appendChild(boseARInjectionScript);
    }
}, {once:true});