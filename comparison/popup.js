var file = '';
var type = '';
var data = '';
var input;

document.addEventListener('DOMContentLoaded', function () {
    currentTab(function (url, tab) {
        input = document.querySelector('#uploadfile');
        input.addEventListener('change', function (e) {
            
            file = this.files[0];
            type = file.type;

            if (type.indexOf('image') === -1 || type.indexOf('adobe') !== -1) {
                console.log('error type');
            } else {
                imgdata(file);
                chrome.tabs.executeScript({
                    file: "contentscript.js"
                });
            }   
        }, false);
    });
});

function imgdata (file, cb) {
    var img = new Image();
        img.src = window.URL.createObjectURL(file);

    img.onload = function(){
        
        document.body.appendChild(img);
        
        var imgnode = document.querySelector('img');
        var nodewidth = getAttr(imgnode, 'width');
        var nodeheight = getAttr(imgnode, 'height');
        
        document.body.removeChild(imgnode);

        var canvas = document.createElement('canvas');
        canvas.width = nodewidth;
        canvas.height = nodeheight;

        var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        data = dataURL;
    };
    
}

function getAttr(obj, pro){
    return document.defaultView.getComputedStyle(obj)[pro].replace('px','') >> 0;
}


chrome.extension.onConnect.addListener(function(port) {
  
  if (port.name === "compare_ready") {
        port.onMessage.addListener(function(msg) {
            if ( data !== ""){
                port.postMessage({
                    from: "_imgfile_plugin",
                    data: data
                });
                data = "";
            } else {
                port.postMessage({
                    from: "_imgfile_plugin",
                    text: "wait..."
                });
            }
        });
  }
});

// function saveTabData(tab, data) {
//     if (tab.incognito) {
//         chrome.runtime.getBackgroundPage(function (bgPage) {
//             bgPage[tab.url] = data;
//         });
//     } else {
//         localStorage.setItem(tab.url, data);
//     }
// }

// currentTab
function currentTab(cb) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };   
    chrome.tabs.query(queryInfo, function (tabs){
        var tab = tabs[0];
        var url = tab.url;
        typeof cb === "function" && cb(url, tab);
    });
}
