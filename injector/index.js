// TODO decides first if it is a merchant page or not, then sends message
chrome.runtime.sendMessage({
	merchant: fetchLocation()
});

// Listening for success and markup
chrome.runtime.onMessage.addListener(function(msg, sender, response){
	document.querySelector('body').insertAdjacentHTML('beforeend', msg.markup);
	
	setTimeout(function(){
		document.querySelector('.voucher-companion-container').style.opacity = 1;
		document.querySelector('.voucher-companion-container').style.transform = 'initial';
	}, 1000);
	
	
	
	
	
});