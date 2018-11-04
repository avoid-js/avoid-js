AvoidJS.ui.DOM = new function() 
{
	var _this = this;

	this.appendCSS = function(el, css) 
	{
		var cssEl = document.createElement("style");
		cssEl.type = "text/css";
		cssEl.innerHTML = css;
		el.appendChild(cssEl);
	};
	
	this.appendJS = function(el, js) 
	{
		var jsEl = document.createElement("script");
		jsEl.type = "text/javascript";
		jsEl.innerHTML = js;
		el.appendChild(jsEl);
	};
	
	this.appendJSsrc = function(el, src) 
	{
		var jsEl = document.createElement("script");
		jsEl.type = "text/javascript";
		jsEl.src = src;
		el.appendChild(jsEl);
	};
	
	this.getAllByAttribute = function(inEl, attr) 
	{
		return inEl.querySelectorAll("["+attr+"]");
	};
	
	this.getById = function(elId) 
	{
		return document.getElementById(elId);
	};
	
	this.getAllElsByClass = function(className) 
	{
		return document.getElementsByClassName(className);
	};
	
	this.getChild = function(el, selector) 
	{
		return el.querySelector(selector);
	};
	
	this.getChildren = function(el, selector) 
	{
		return el.querySelectorAll(selector);
	};
	
	this.elHassAttr = function(el, attribute) 
	{
		return el.getAttribute(attribute) !== null;
	};
	
	this.getElAttr = function(el, attribute, _default) 
	{
		return _this.elHassAttr(el, attribute) ? el.getAttribute(attribute) : _default;
	};
	
	this.setElAttr = function(el, attribute, value) 
	{
		return el.setAttribute(attribute, value);
	};
	
	this.removeElAttr = function(el, attribute) 
	{
		return el.removeAttribute(attribute);
	};
	
	this.elHasData = function(el, dataAttribute) 
	{
		return _this.elHassAttr(el, "data-"+dataAttribute);
	};
	
	this.getElData = function(el, dataAttribute, _default) 
	{
		return _this.getElAttr(el, "data-"+dataAttribute, _default);
	};
	
	this.setElData = function(el, dataAttribute, value) 
	{
		return _this.setElAttr(el, "data-"+dataAttribute, value);
	};
	
	this.isElDisplay = function(el, display) 
	{
		return el.style.display == display;
	};
	
	this.hideEl = function(el) 
	{
		el.style.display = 'none';
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elHidden, el);
		
		return this;
	};
	
	this.hideElsList = function(elClass) 
	{
		_this.getAllElsByClass(elClass).onEach(function(el) {
			_this.hideEl(el);
		});
		
		return this;
	};

	this.showEl = function(el, display) 
	{
		el.style.display = display ? display : 'block';
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elDisplayed, el);
		
		return this;
	};
	
	this.conditionalDisplay = function(el, condtion, display) 
	{
		if(condtion) {
			_this.showEl(el, display);
		} else {
			_this.hideEl(el);
		}
	};
	
	this.showElsList = function(elClass, display) 
	{
		_this.getAllElsByClass(elClass).onEach(function(el) {
			_this.showEl(el, display);
		});
	};
	
	this.toggleElDisplay = function(el, display, showCallback, hideCallback) 
	{
		if(display === undefined) {
			display = 'block';
		}
		
		if(!this.isElDisplay(el, display)) 
		{
			this.showEl(el, display);
			if(showCallback) showCallback();
		}
		else
		{
			this.hideEl(el);
			if(hideCallback) hideCallback();
		}
		
		return el.style.display;
	};
	
	this.toggleElsListDisplay = function(elClass, display) 
	{
		_this.getAllElsByClass(elClass).onEach(function(el) {
			_this.toggleElDisplay(el, display);
		});
		
		return this;
	};
	
	this.enEl = function(el) 
	{
		el.disabled = false;
	};
	
	this.disEl = function(el) 
	{
		el.disabled = true;
	};
	
	this.setFocus = function(el) 
	{
		el.focus();
	};
	
	this.getClass = function(el) 
	{
		return el.className;
	};
	
	this.setClass = function(el, className) 
	{
		el.className = className;
	};
	
	this.getHTML = function(el) 
	{
		return el.innerHTML;
	};
	
	
	this.setHTML = function(el, html) 
	{
		el.innerHTML = html;
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.htmlChanged, el);
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.addHTML = function(el, html, atTop) 
	{
		if(atTop === true) 
		{
			el.innerHTML = html + el.innerHTML;
		}
		else 
		{
			el.innerHTML += html;
		}
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.htmlChanged, el);
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.addNodeFromHTML = function(el, html, atTop, beforeEl) 
	{
		var tmpNode = document.createElement('span');
		_this.setHTML(tmpNode, html); // trimming so that first child will not be text
		el.appendChild(tmpNode);
		
		if(atTop || beforeEl) 
		{
			if(atTop) {
				beforeEl = el.firstChild;
			}
		}
		
		while (tmpNode.childNodes.length > 0) {
			el.insertBefore(tmpNode.childNodes[0], beforeEl);
		}
		
		_this.removeEl(tmpNode);
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.htmlChanged, el);
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
		
		return el;
	};
	
	this.setNodeFromHTML = function(el, html) 
	{
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
		
		_this.addNodeFromHTML(el, html);
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.htmlChanged, el);
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.replaceElWithHTML = function(el, html) 
	{
		var newNode = _this.addNodeFromHTML(el.parentNode, html, false, el);
		_this.removeEl(el);
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.htmlChanged, el);
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
		
		return newNode;
	};
	
	this.addChild = function(el, child) 
	{
		el.appendChild(child);
	};
	
	this.setChild = function(el, child) 
	{
		_this.clearEl(el);
		_this.addChild(el, child);
	};
	
	this.removeEl = function(el) 
	{
		if(el.parentNode) {
			el.parentNode.removeChild(el);
		}
	};
	
	this.elHasParent = function(el, parent) 
	{
		var node = el;
		while (node != null) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};
	
	this.clearEl = function(el) 
	{
		_this.setNodeFromHTML(el, "");
	};
	
	this.json2html = function(el) 
	{
		_this.setHTML(el, JSON.parse(_this.getHTML(el)));
	};
	
	this.setText = function(el, text) 
	{
		el.textContent = text;
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.getValue = function(el) 
	{
		return el.value;
	};
	
	this.getValueTrimmed = function(el) 
	{
		return _this.getValue(el).trim();
	};
	
	this.setValue = function(el, value) 
	{
		el.value = value;
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.appendValue = function(el, value) 
	{
		el.value += value;
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.resetValue = function(el) 
	{
		el.value = "";
		
		AvoidJS.Eventer.fire(AvoidJS.Events.DOM.elementContentChanged, el);
	};
	
	this.select = function(el) 
	{
		el.select();
	};
	
	this.isChecked = function(el) 
	{
		return el.checked;
	};
	
	this.setChecked = function(el, value) 
	{
		if(value === undefined) {
			value = true;
		}
		
		el.checked = AvoidJS.$.getBool(value);
	};
	
	this.setSelectedOption = function(el, key) 
	{
		el.options[_this.getSelectorIndexOfOption(el, key)].selected = true;
	};
	
	this.getSelectedOption = function(el) 
	{
		return _this.getSelectorOptionOfIndex(el, el.options.selectedIndex);
	};
	
	this.getSelectorIndexOfOption = function(selector, key) 
	{
		var index = 0;
		selector.options.onEach(function(option, i) {
			if(_this.getValue(option) == key) 
			{
				index = i;
			}
		});
		
		return index;
	};
	
	this.getSelectorOptionOfIndex = function(selector, index) 
	{
		return _this.getValueTrimmed(selector.options[index]);
	};
	
	this.scrollIntoView = function(el, countfixedNavbar) 
	{
		el.scrollIntoView();
		
		if(countfixedNavbar && AppInfo.isDesctop()) 
		{
			var scrolledY = window.scrollY;
			
			if(scrolledY) 
			{
				window.scroll(0, scrolledY - Register.layout.getHeaderHeight(true));
			}
		}
	};
	
	this.getScrollTop = function(el) 
	{
		return el.scrollTop;
	};
	
	this.setScrollTop = function(el, val) 
	{
		el.scrollTop = val;
	};
	
	this.scrollTop = function(el) 
	{
		_this.setScrollTop(el, 0);
	};
	
	this.scrollDown = function(el) 
	{
		_this.setScrollTop(el, el.scrollHeight);
	};
	
	
	this.getScrollDif = function(el) 
	{
		return el.scrollHeight - el.scrollTop;
	};
	
	this.setScrollDif = function(el, scrollDif) 
	{
		el.scrollTop = el.scrollHeight - scrollDif;
	};
	
	this.addClassToEl = function(el, className)
	{
		if(el.className) 
		{
			this.removeClassFromEl(el, className);
			
			var elClassList = el.className.split(" ");
			elClassList.push(className);
			el.className = elClassList.join(" ");
		} else {
			el.className = className;
		}
	};

	this.removeClassFromEl = function(el, classNames)
	{
		if(el.className) 
		{
			var classesToRemove = classNames.split(" ");
			
			var elClassList = el.className.split(" ");
			var newClassList = new Array();
			elClassList.forEach(function(className) 
			{
				if(classesToRemove.indexOf(className) === -1) 
				{
					newClassList.push(className);
				}
			});
			
			el.className = newClassList.join(" ");
		}
	};
	
	this.switchClassOnEl = function(el, classNames)
	{
		var classesToSwitch = classNames.split(" ");

		classesToSwitch.onEach(function(className) 
		{
			if(_this.hasClass(el, className)) {
				_this.removeClassFromEl(el, className);
			} else {
				_this.addClassToEl(el, className);
			}
		});
	};
	
	this.hasClass = function(el, className) 
	{
		return (el.className && el.className.indexOf(className) > -1);
	};
	
	this.toggleElClass = function(el, className) 
	{
		if(this.hasClass(el, className)) 
		{
			this.removeClassFromEl(el, className);
		}
		else 
		{
			this.addClassToEl(el, className);
		}
	};
	
	this.getStyle = function(el, style, isInt) 
	{
		var res = el.style[style];
		if(isInt) 
		{
			res = parseInt(res);
		}
		
		return res;
	};
	
	this.setStyle = function(el, style, value, units) 
	{
		if(units) 
		{
			value += units;
		}
		
		el.style[style] = value;
	};

	this.applyClassToCollectionOnCondition = function(collection, className, condition)
	{
		for (var i = 0; i < collection.length; i++) {
			if (condition) {
				this.addClassToEl(collection[i], className);
			} else {
				this.removeClassFromEl(collection[i], className);
			}
		}
	};
	
	this.addEvent = function(els, events, handler) 
	{
		events.split(" ").onEach(function(event) {
			if(0 > ["[object Array]", "[object NodeList]", "[object HTMLCollection]"].indexOf(Object.prototype.toString.call(els))) {
				els = [els];
			}
			
			els.onEach(function(el) 
			{
				var h = function(e) 
				{
					if(handler(e, el) === false) {
						el.removeEventListener(event, h);
					}
				};
				el.addEventListener(event, h);
			});
		});
	};
	
	this.addEventNoDefault = function(els, events, handler) 
	{		
		_this.addEvent(els, events, function(e) {
			e.preventDefault();
			handler(e, els);
		});
	};
	
	this.removeChildren = function(el) 
	{
		while (el.firstChild) 
		{
			el.removeChild(el.firstChild);
		}
	};
	
	this.getElComputedStyle = function(el, style, isInt)
	{
		var res = window.getComputedStyle(el).getPropertyValue(style);
		if(isInt) 
		{
			return parseInt(res);
		}
		
		return res;
	};
	
	
	this.preventScrollPropagation = function(el)
	{
		var onScroll = function(ev) {
			
			var el = this,
				 scrollTop = this.scrollTop,
				 scrollHeight = this.scrollHeight,
				 height = _this.getElComputedStyle(el, "height", true),
				 delta = ev.wheelDelta,
				 up = delta > 0;

			var prevent = function() {
				 ev.stopPropagation();
				 ev.preventDefault();
				 ev.returnValue = false;
				 return false;
			}

			if (!up && -delta > scrollHeight - height - scrollTop) {
				 // Scrolling down, but this will take us past the bottom.
				 el.scrollTop = scrollHeight;
				 return prevent();
			} else if (up && delta > scrollTop) {
				 // Scrolling up, but this will take us past the top.
				 el.scrollTop = 0;
				 return prevent();
			}
		};
		
		el.addEventListener('mousewheel', onScroll);
		el.addEventListener('DOMMouseScroll', onScroll);
	};
	
	
	this.adaptElHeight = function(el) 
	{
		if(!isFinite(_this.getStyle(el, "height", true))) 
		{
			_this.setStyle(el, "height", 0, "px");
		}
		
		for(var i = _this.getStyle(el, "height", true); i >= 0 ; --i) 
		{
			_this.setStyle(el, "height", i, "px");
			
			if (el.scrollHeight > el.clientHeight) 
			{
				_this.setStyle(el, "height", el.scrollHeight /*+ 4*/, "px");
				break;
			}
		}
	};
	
	this.adaptiveHeight = function(el) 
	{
		var prevLengthDataAttr = "prev-length";
		
		_this.setElData(el, prevLengthDataAttr, _this.getValue(el).length);
		
		_this.addEvent(el, "input change", function(e) 
		{
			if(_this.getValue(el).length != _this.getElAttr(el, prevLengthDataAttr)) 
			{
				_this.adaptElHeight(el);

				_this.setElData(el, prevLengthDataAttr, _this.getValue(el).length);
			}
		});
		
		_this.adaptElHeight(el);
		
		AvoidJS.Eventer.subscribe(AvoidJS.Events.DOM.elementContentChanged, function(node) 
		{
			if(el === el) 
			{
				AvoidJS.ui.DOM.adaptElHeight(node);
			}
		});
	};
};

AvoidJS.Events.DOM = 
{
	htmlChanged: "htmlChanged",
	elementContentChanged: "elementContentChanged",
	elDisplayed: "elDisplayed",
	elHidden: "elHidden"
};

AvoidJS.Events.registerEvents(AvoidJS.Events.DOM);