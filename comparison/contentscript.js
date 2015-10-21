console.log('@Frances plugin insert script 然并卵');

var port = chrome.extension.connect({name: "compare_ready"});

port.postMessage({
	from: "_imgfile",
	text: "waiting"
});

port.onMessage.addListener(function(res) {
  	if (res.from === '_imgfile_plugin' && res.data !== "") {
  		document.querySelector('html').style.background = 'url(' + res.data + ') center top no-repeat';
  		document.body.style.opacity = '0.3';
  	} else {
  		port.postMessage({
			from: "_imgfile",
			text: "waiting"
		});
  	}
});
