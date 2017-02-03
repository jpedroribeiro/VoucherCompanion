/**
 * Created by pribeiro on 03/02/2017.
 */

function fetchLocation() {
	return location.host.replace('www.','');
}

fetchLocation();