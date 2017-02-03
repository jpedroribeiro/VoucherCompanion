// callback hell

chrome.runtime.onMessage.addListener(function (msg, sender) {
	
	// It's a merchant, so lets check it with JSON/API
	var JSONreq = new XMLHttpRequest();
	JSONreq.open("GET", chrome.extension.getURL('background/merchants.json'), true);
	JSONreq.onreadystatechange = function() {
		if (JSONreq.readyState == 4 && JSONreq.status == 200) {
			var match = isAMatch(msg.merchant, JSON.parse(JSONreq.responseText));
			
			
			if (match.offers) {
				// Offer found
				var req = new XMLHttpRequest();
				req.open("GET", chrome.extension.getURL('background/found.html'), true);
				req.onreadystatechange = function() {
					if (req.readyState == 4 && req.status == 200) {
						// Templating
						var offers = '',
							html = req.responseText
										.replace('__MERCHANT_NAME', match.name)
										.replace('__NUMBER', match.offers.length)
										.replace(new RegExp('__PLURAL', 'g'), match.offers.length > 1 ? 's' : '')
										.replace('__MERCHANT_URL', msg.merchant);
						
						for (offer of match.offers) {
							offers += '<p>' + offer + '</p>'
						}
						
						html = html.replace('__OFFER', offers);
						// end templating
						
						chrome.tabs.sendMessage(sender.tab.id, {
							markup: html
						});
					}
				};
				req.send(null);
				
				chrome.browserAction.setBadgeText({
					text:match.offers.length.toString(),
					tabId: sender.tab.id
				});
				
			} else {
				// Nothing found
				var req = new XMLHttpRequest();
				req.open("GET", chrome.extension.getURL('background/notfound.html'), true);
				req.onreadystatechange = function() {
					if (req.readyState == 4 && req.status == 200) {
						var html = req.responseText
							.replace('__MERCHANT_NAME', match.name)
							.replace('__SIMILAR_NAME', match.similar)
							.replace('__SIMILAR_OFFER', match.similarOffers[0])
							.replace('__SIMILAR_URL', match.similarURL);
						
						chrome.tabs.sendMessage(sender.tab.id, {
							markup: html
						});
					}
				};
				req.send(null);
			}
		}
	};
	JSONreq.send(null);
	// end json xhr
});



function isAMatch(merchant, obj) {
	var match = false;
	
	for (var prop in obj) {
		if (obj[prop].url === merchant) {
			match = {
				offers: obj[prop].offers.length > 0 ? obj[prop].offers : false,
				name: prop,
				similarOffers: obj[prop].similar ? obj[obj[prop].similar].offers : false,
				similar: obj[prop].similar ? obj[prop].similar : false,
				similarURL: obj[prop].similar ? obj[obj[prop].similar].url : false
			};
		}
	}
		
	return match;
}