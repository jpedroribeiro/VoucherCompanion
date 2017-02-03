// callback hell

chrome.runtime.onMessage.addListener(function (msg, sender) {
	
	// It's a merchant, so lets check it with JSON/API
	var JSONreq = new XMLHttpRequest();
	JSONreq.open("GET", chrome.extension.getURL('background/merchants.json'), true);
	JSONreq.onreadystatechange = function() {
		if (JSONreq.readyState == 4 && JSONreq.status == 200) {
			var match = isAMatch(msg.merchant, JSON.parse(JSONreq.responseText));
			console.log(match);
			// Respond with a nice template
			var req = new XMLHttpRequest();
			req.open("GET", chrome.extension.getURL('background/index.html'), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4 && req.status == 200) {
					var html = req.responseText
								.replace('__MERCHANT_NAME', match.name)
								.replace('__OFFER', match.offers[0])
								.replace('__MERCHANT_URL', msg.merchant);
					
					chrome.tabs.sendMessage(sender.tab.id, {
						markup: html
					});
				}
			};
			req.send(null);
			// end template xhr
		}
	};
	JSONreq.send(null);
	// end json xhr
	
	
	
	// TODO this could be the number of offers (OR change the icon)
	// chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 0]});
	// chrome.browserAction.setBadgeText({text:"0"});
	
	
	
});



function isAMatch(merchant, obj) {
	var match = false;
	
	for (var prop in obj) {
		if (obj[prop].url === merchant) {
			match = {
				offers: obj[prop].offers,
				name: prop
			};
		}
	}
		
	return match;
}