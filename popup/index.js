/**
 * Created by pribeiro on 03/02/2017.
 */


elMerchantName = document.querySelector('.js-merchant-name');

chrome.tabs.executeScript(null, {file:'fetchMerchantInfo/index.js'}, function (title){
	elMerchantName.innerHTML = title;
});