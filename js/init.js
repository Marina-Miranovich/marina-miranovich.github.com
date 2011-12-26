var autocomplete = {};
autocomplete.containerId = 'hints';
autocomplete.showClass = 'show';
autocomplete.hintClass = 'hint';
autocomplete.focusOnClass = 'active';

autocomplete.parseResponse = function(response) {
	var JSONObjects = eval(response);
	var hints = [];
	for(i = 0; i < JSONObjects.length; i++) {
		hints.push(JSONObjects[i].shortName);
	}
	autocomplete.configureHints(hints);
}

autocomplete.getHints = function(chars) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else {// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			autocomplete.parseResponse(xmlhttp.responseText);
		}
	}
	var request = 'jstraning/countries.php?q='+chars;
	xmlhttp.open('GET', request, true);
	xmlhttp.send();
}

autocomplete.processKeyPress = function(e) {
	var chars = document.countryForm.q.value;
	var container = document.getElementById(autocomplete.containerId);
	if(chars.length > 2) {
		if(autocomplete.getKeyCode(e)== 40) {
			document.countryForm.submitBtn.focus();
			autocomplete.handleCssClass(container.firstChild, autocomplete.focusOnClass, true);
		} else {
			autocomplete.getHints(chars);
		}
	} else {
		autocomplete.handleCssClass(container, autocomplete.showClass, false);
		autocomplete.deleteHintsEvents(container);
	}
}

autocomplete.getKeyCode = function(e) {
	if(window.event) {// IE
		return  e.keyCode
	} else if(e.which) {// Netscape/Firefox/Opera
		return e.which
	}
}

autocomplete.configureHints = function(hints) {
	var container = document.getElementById(autocomplete.containerId);
	var htmlCode = [];
	for(i = 0; i < hints.length; i++) {
		htmlCode.push('<li classs="', autocomplete.hintClass, '">',hints[i],'</li>');
	}
	container.innerHTML = htmlCode.join('');
	autocomplete.handleCssClass(container, autocomplete.showClass, true);
	autocomplete.addHintsEvents(container);
}

autocomplete.handleCssClass = function(elem, cssClass, isAdd) {
	var classes = elem.className;
	if(classes.indexOf(cssClass) > -1) {
		classes = classes.substring(0, classes.indexOf(cssClass));
	}
	if (isAdd) {
		classes += cssClass;
	}
	elem.className = classes;
}

autocomplete.addHintsEvents = function(hintsContainer) {
	var hintElements = hintsContainer.childNodes;
	var form = document.countryForm;
	if(form.addEventListener) {
		document.countryForm.addEventListener('keydown', autocomplete.processHintKeyDown, false);
	} else { // for IE before 9
		document.countryForm.attachEvent('onkeydown',autocomplete.processHintKeyDown);
	}
	for(i = 0; i < hintElements.length; i++) {
		if (hintElements[i].addEventListener) {
			hintElements[i].addEventListener('click', autocomplete.processHintClick, false);
			hintElements[i].addEventListener('mouseover', autocomplete.hintFocusOn, false);
			hintElements[i].addEventListener('mouseout', autocomplete.hintFocusOff, false);
		} else { // for IE before 9
			hintElements[i].attachEvent('onclick',autocomplete.processHintClick);
			hintElements[i].attachEvent('mouseover',autocomplete.hintFocusOn);
			hintElements[i].attachEvent('mouseout',autocomplete.hintFocusOff);
		}
	}
}

autocomplete.deleteHintsEvents = function(hintsContainer) {
	if (hintsContainer) {
		var hintElements = document.getElementsByClassName(autocomplete.hintClass);
		var form = document.countryForm;
		if(form.removeEventListener) {
			document.countryForm.removeEventListener('keydown', autocomplete.processHintKeyDown, false);
		} else { // for IE before 9
			document.countryForm.detachEvent('onkeydown',autocomplete.processHintKeyDown);
		}
		for(i = 0; i < hintElements.length; i++) {
			if (hintElements[i].removeEventListener) {
				hintElements[i].removeEventListener('click', autocomplete.processHintClick, false);
				hintElements[i].removeEventListener('mouseover', autocomplete.hintFocusOn, false);
				hintElements[i].removeEventListener('mouseout', autocomplete.hintFocusOff, false);
			} else { // for IE before 9
				hintElements[i].detachEvent('onclick',autocomplete.processHintClick);
				hintElements[i].detachEvent('mouseover',autocomplete.hintFocusOn);
				hintElements[i].detachEvent('mouseout',autocomplete.hintFocusOff);
			}
		}
	}
}

autocomplete.processHintClick = function() {
	var container = document.getElementById(autocomplete.containerId);
	autocomplete.handleCssClass(container, autocomplete.showClass, false);
	autocomplete.deleteHintsEvents(container);
}

autocomplete.processHintKeyDown = function(e) {
	var container = document.getElementById(autocomplete.containerId);
	switch(autocomplete.getKeyCode(e)) {
		case 38:
			autocomplete.moveFocus(container, true);
		break;
		case 40:
			autocomplete.moveFocus(container, false);
		break;
		case 13:
			var container = document.getElementById(autocomplete.containerId);
			autocomplete.handleCssClass(container, autocomplete.showClass, false);
			autocomplete.deleteHintsEvents(container);
			e.preventDefault();
		break;
		default:
			//do nothing
	}
}

autocomplete.moveFocus = function(container, isUp) {
	var currentElem = container.getElementsByClassName(autocomplete.focusOnClass)[0];
	var nextElem = autocomplete.findNext(currentElem, isUp);
	autocomplete.handleCssClass(currentElem, autocomplete.focusOnClass, false);
	autocomplete.handleCssClass(nextElem, autocomplete.focusOnClass, true);
	document.countryForm.q.value = nextElem.innerHTML;
}

autocomplete.findNext = function(current, isUp) {
	var parent = current.parentNode;
	var children = parent.getElementsByTagName(current.localName);
	var curentIndex, nextIndex;
	for(i = 0; i < children.length; i++) {
		if(children[i] == current) {
			currentIndex = i;
		}
	}
	if(isUp) {
		nextIndex = currentIndex - 1;
	} else {
		nextIndex = currentIndex + 1;
	}
	if(nextIndex >= 0 && nextIndex < children.length) {
		return children[nextIndex];
	}
	return current;
}

autocomplete.hintFocusOn = function() {
	autocomplete.handleCssClass(this, autocomplete.focusOnClass, true);
	document.countryForm.q.value = this.innerHTML;
}

autocomplete.hintFocusOff = function() {
	autocomplete.handleCssClass(this, autocomplete.focusOnClass, false);
}

autocomplete.init = function() {
	var country = document.countryForm.q;
	if(country.value.length > 2) {
		autocomplete.getHints(country.value);
	}
	if (country.addEventListener) {
		country.addEventListener('keyup', autocomplete.processKeyPress, false);
	} else { // for IE before 9
		country.attachEvent('onkeyup',autocomplete.processKeyPress);
	}
}
autocomplete.init();