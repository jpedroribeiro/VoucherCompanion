chrome.runtime.sendMessage({
	merchant: fetchLocation()
});

// Listening for success and markup
chrome.runtime.onMessage.addListener(function(msg, sender, response){
	document.querySelector('body').insertAdjacentHTML('beforeend', msg.markup);
	
	setTimeout(function(){ // Just to get the animation going
		document.querySelector('.voucher-companion-container').style.opacity = 1;
		document.querySelector('.voucher-companion-container').style.transform = 'initial';
	}, 1000);
	
});