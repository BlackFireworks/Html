window.onload = function () {
	
	for (var i = 16; i >= 0; i--) {
		var opt = document.createElement('option');
		var sel = document.getElementById('year');
		opt.appendChild(document.createTextNode(2000+i));
		opt.setAttribute('value',"123");
		sel.appendChild(opt);
	}
}
