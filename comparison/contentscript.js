console.log('plugin insert script 然并卵');

chrome.extension.sendMessage({
	from: "_imgfile"}, function (res) {
  	if (res.from === '_imgfile_plugin' && res.data !== "") {
  		
  		document.body.style.background = 'url(' + res.data + ') center top no-repeat';
  		
  	}
});
