/**
 * Created by pribeiro on 03/02/2017.
 */


chrome.tabs.executeScript(null, {file:'fetchMerchantInfo/index.js'}, function (url){
	// It's a merchant, so lets check it with JSON/API
	var JSONreq = new XMLHttpRequest();
	JSONreq.open("GET", chrome.extension.getURL('background/merchants.json'), true);
	JSONreq.onreadystatechange = function() {
		if (JSONreq.readyState == 4 && JSONreq.status == 200) {
			var match = isAMatch(url[0], JSON.parse(JSONreq.responseText));
			
			if (match.offers) {
				// Offer found
				var html = 'We have ' + match.offers.length + ' offer' + (match.offers.length > 1 ? 's' : '') + ' that you can use now!';
				document.getElementById('content').innerHTML = html;
			} else {
				// Nothing found
				var html = 'We don\'t have any ' + match.name + ' offers at the moment, why not try ' + match.similar + ' instead?';
				document.getElementById('content').innerHTML = html;
			}
		}
	};
	JSONreq.send(null);
	// end json xhr
});













// This is a copy paste
function isAMatch(merchant, obj) {
	var match = false;
	for (var prop in obj) {		console.log(obj[prop].url, merchant)
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