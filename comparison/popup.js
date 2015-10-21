var file = '';
var type = '';
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
                
                chrome.tabs.executeScript({
                    file: "contentscript.js"
                });
            }   
        }, false);
    });
});

function imgdata (file, cb) {
    var data = null;
    var img = new Image();
        
        img.src = window.URL.createObjectURL(file);

    //img.onload = function(){
        var canvas = document.createElement('canvas');
        canvas.width = 828;
        canvas.height = 299;

        var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');
        console.log(dataURL);

        typeof cb === "function" && cb(dataURL);
    //};
    
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.from === '_imgfile'){
        console.log('legal'); 
        imgdata(file, function (data) {
            sendResponse({
                from: '_imgfile_plugin',
                data: data
            });
        });
    } else {
        console.log('illegal');
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
