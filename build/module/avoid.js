Array.prototype.onEach = function(func, withResult) 
{
	var result;
	var left = this.length;

	for(var i = 0; i < this.length; i++, left--) 
	{
		var eachRes = func(this[i], i, left-1);

		if(false === eachRes) {
			break;
		}

		if(withResult) {
			result = withResult(eachRes, result);
		}
	}

	return result;
};

Array.prototype.remove = function(el) 
{
	var index = this.indexOf(el);
	if (index > -1) 
	{
		this.splice(index, 1);
	}
};

Array.prototype.removeConditional = function(func) 
{
	for(var i = 0; i < this.length; i++) 
	{
		if(func(this[i], i)) {
			this.splice(i, 1);
		}
	}
};

Array.prototype.condition = function(func) 
{
	for(var i = 0; i < this.length; i++) 
	{
		if(func(this[i], i)) {
			return true;
		}
	}
	
	return false;
};


Array.prototype.shuffle = function() 
{
	var i = this.length, j, temp;
	if (i == 0)
		return this;
	
	while (--i) 
	{
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	
	return this;
};

Array.prototype.trimEach = function() 
{
	return this.map(function(item) 
	{
		return item.trim();
	});
};
if(!document.contains) 
{
	document.contains = function(el) 
	{
		while(el.parentNode)
			el = el.parentNode;
		
		return el === document;
	}
}
Object.prototype.toArray = function() 
{
	var arr = [];
	
	this.onEach(function(val, key) 
	{
		arr.push({
			key: key,
			value: val
		});
	});
	
	return arr;
};

Object.prototype.onEach = function(func, withResult) 
{
	var result;
	var i = 0;

	for (var key in this) 
	{
		if (this.hasOwnProperty(key)) 
		{
			var eachRes = func(this[key], key, i);

			if(false === eachRes) {
				break;
			}

			if(withResult) {
				result = withResult(eachRes, result);
			}

			i++;
		}
	}

	return result;
}; 

Object.prototype.clone = function() 
{
	return JSON.parse(JSON.stringify(this));
};

Object.prototype.copy = function(source) 
{
	source.onEach(function(val, key) {
		this[key] = val;
	});
};

Object.prototype.merge = function(obj2) 
{
	var obj3 = {};
	for (var attrname in this) {
		obj3[attrname] = this[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
};
String.prototype.replaceAll = function(search, replacement) 
{
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.splitTrim = function(by) 
{
	return this.split(by).trim();
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.escapeRegExp = function () 
{
	// Escape special characters for use in a regular expression
	return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.escapeHTML = function () 
{
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return this.replace(/[&<>"']/g, function (m) {
		return map[m];
	});
};

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

String.prototype.trimChar = function (charToTrim) 
{
	charToTrim = AvoidJS.$.OR(charToTrim, " ");
	
	var escapedStr = this.escapeRegExp();
	var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
	return escapedStr.replace(regEx, "");
};

String.prototype.isNumeric = function () 
{
	return parseFloat(this) == this;
};

/**
 * 
 * https://stackoverflow.com/questions/202605/repeat-string-javascript
 * 
 * @param {type} num
 * @returns {String}
 */
if(!String.prototype.repeat) 
{
	String.prototype.repeat = function(num)
	{
		return new Array(num + 1).join(this);
	};
}
var AvoidJS = 
{
	$: {},
	conf: {},
	core: 
	{
		Logger: {},
		Threader: {},
		Timeout: {}
	},
	
	Storage: {},
	Remember: {},
	
	Eventer: {},
	
	Events: {},
	
	Templater: 
	{
		
	},
	
	ui: 
	{
		Effects: {},
		Manager: {},
		Format: {}
	},
	
	cmd: 
	{
		
	}
};
AvoidJS.conf = 
{
	version: "0.0",
	
	attrs: 
	{
		templater: {
			load: "avj-load-templates",
			template: "avj-template",
			action: "avj-action",
			digested: "avj-digested",

			preserveContent: "avj-preserve-content",
			contentPreserved: "avj-content-preserved"
		},
		macros: {
			def: "avj-macros", // "data-js"
			apply: function(macros) 
			{
				return "avj-apply-"+macros;
			},
			applied: function(key) {
				return "avj-"+key+"-applied";
			}
		},
		actions: {
			prop: function(actionName, propName) {
				return "avj-" + actionName.toLowerCase() + "-"+propName;
			},
			data: function(actionName) {
				return "avj-" + actionName.toLowerCase() + "-data-";
			},
			formValidation: "avj-form-validation" // data-js
		}
	}
};
AvoidJS.$.OR = function OR(a, b) 
{
	return (a !== null && a !== undefined) ? a : b;
};

AvoidJS.$.getBool = function(val)
{
	if(val === undefined || val === null) 
		return false;
	
	if(val === true || val === false)
		return val;
	
	switch (val.toString().toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
		case "on":
			return true;

		case "false":
		case "no":
		case "0":
		case null:
			return false;

		default:
			return Boolean(val);
	}
};
AvoidJS.Eventer = 
{
	listeners: {},
	
	history: {},
	
	subscribe: function(event, func, options)
	{
		options = {
			id: null,
			subtype: null,
			once: false,
			noQ: false
		}.merge(options);
		
		AvoidJS.Events.ifEventSupported(event, function() 
		{
			if(!AvoidJS.Eventer.listeners[event]) {
				AvoidJS.Eventer.listeners[event] = {};
			}
			
			if(!options.id) {
				options.id = AvoidJS.Eventer.generateId(event);
			}
			
			AvoidJS.Logger.info(options.id);
			
			AvoidJS.Eventer.listeners[event][options.id] = 
			{
				func: function(data, event, subtype) 
				{
					if(!options.subtype || options.subtype == subtype) 
					{
						var res = func(data, event, subtype);
						
						if(options.once || res === false) {
							AvoidJS.Eventer.unsubscribe(event, options.id);
						}
					}
				},
				options: options
			};
		});
	},
	
	subscribeMulti: function(events, func, options) 
	{
		events.onEach(function(event) {
			AvoidJS.Eventer.subscribe(event, func, options);
		});
	},
	
	generateId: function(event) {
		var id = 0;
		if(!this.listeners[event]) {
			this.listeners[event] = {};
		}
		while(this.listeners[event][event+id] !== undefined) {
			id++;
		}
		
		return event+id;
	},
	
	subscribeOnce: function(event, func, options) 
	{
		options = {
			once: true
		}.merge(options);
		
		this.subscribe(event, func, options);
	},
	
	unsubscribe: function(event, id) 
	{
		AvoidJS.Logger.info("Unsubscribe: " + id);
		
		if(this.listeners[event] && this.listeners[event][id]) 
		{
			delete(this.listeners[event][id]);
		}
	},
	
	unsubscribeAll: function(event) 
	{
		if(this.listeners[event]) {
			delete(this.listeners[event]);
			this.listeners[event] = {};
		}
	},
	
	unsubscribeEvery: function(eventsList) 
	{
		eventsList.onEach(function(event) {
			AvoidJS.Eventer.unsubscribeAll(event);
		});
	},
	
	getListeners: function(event) 
	{
		return AvoidJS.$.OR(AvoidJS.Eventer.listeners[event], {});
//		var listeners = [];
//		
//		if(AvoidJS.Eventer.listeners[event]) {
//			AvoidJS.Eventer.listeners[event].onEach(function(handler) {
//				listeners.push(handler);
//			});
//		}
//		
//		return listeners;
	},
	
	fire: function(event, data, options) 
	{
		options = {
			noQ: false, // no queue
			subtype: ""
		}.merge(options);
		
		AvoidJS.Events.ifEventSupported(event, function() 
		{
			AvoidJS.Eventer.history[event] = AvoidJS.$.OR(AvoidJS.Eventer.history[event], {});
			AvoidJS.Eventer.history[event][options.subtype] = {
				data: data,
				options: options
			};
			
			AvoidJS.Eventer.getListeners(event).onEach(function(handler) 
			{
				if(options.noQ || handler.options.noQ) {
					handler.func(data, event, options.subtype);
				} else {
					AvoidJS.core.Threader.putInQueue(function() {
						handler.func(data, event, options.subtype);
					});
				}
			});
		});
	},
	
	refire: function(event, subtype) 
	{
		if(!subtype) subtype = "";
		
		if(AvoidJS.Eventer.history[event] && AvoidJS.Eventer.history[event][subtype]) 
		{
			AvoidJS.Eventer.fire(event, AvoidJS.Eventer.history[event][subtype].data, AvoidJS.Eventer.history[event][subtype].options);
		}
	},
	wasFired: function(event, subtype) 
	{
		if(!subtype) subtype = "";
		
		return (AvoidJS.Eventer.history[event] && AvoidJS.Eventer.history[event][subtype]); 
	}
};
AvoidJS.Events = 
{
	registeredEvents: {},
	registerEvents: function(eventsList) 
	{
		var namespace = null;
		AvoidJS.Events.onEach(function(val, key) {
			if(val === eventsList) {
				namespace = key;
			}
		});
		
		if(!namespace) {
			throw "Cannot register events - no namespace found.";
		}
		
		eventsList.onEach(function(val, key) 
		{
			eventsList[key] = [namespace, key].join(".");
			AvoidJS.Events.registeredEvents[eventsList[key]] = [eventsList[key]];
		});
	},
	isEventSupported: function(event) 
	{
		return AvoidJS.Events.registeredEvents[event] !== undefined;
	},
	
	ifEventSupported: function(event, func) 
	{
		if(AvoidJS.Events.isEventSupported(event)) {
			func();
		} else {
			AvoidJS.Logger.error("EventsManager: event with name '"+event+"' not supported.");
		}
	},
};
AvoidJS.Logger = 
{
	options: {
		info: false,
		error: true
	},
	info: function(str) 
	{
		if(this.options.info) {
			console.log(str);
		}
	},
	error: function(str) 
	{
		if(this.options.error) {
			console.log(str);
		}
	}
};
AvoidJS.core.Threader = 
{
	putInQueue: function(func, callback) 
	{
		AvoidJS.core.Timeout.set(function() 
		{
			var res = func();

			if(callback) {
				callback(res);
			}
			
		}, 1);
	},
	
	run: function(func, options) 
	{
		if(!options) {
			options = {
				callback: null,
				inQ: false
			};
		}
		
		if(options.inQ) 
		{
			AvoidJS.core.Timeout.set(function() 
			{
				var res = func();

				if(options.callback) {
					options.callback(res);
				}

			}, 1);
		}
		else 
		{
			var res = func();

			if(options.callback) {
				options.callback(res);
			}
		}
	}
};
AvoidJS.core.Timeout = new function() 
{
	this.reset = function(timeout) 
	{
		if(timeout != null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};
	
	this.set = function(func, time) 
	{
		var timeout = setTimeout(function() {
			func();
			timeout = null;
		}, time);
		
		return timeout;
	};
};
AvoidJS.Ajax = 
{
	expectedStatuses: [],
	
	objectToHttpParam: function(dataObject, _key)
	{
		var retStr = "";

		for (var key in dataObject)
		{
			var value = dataObject[key];

			if (_key)
			{
				key = _key + "[" + key + "]";
			}

			if (Object.prototype.toString.call(value) === '[object Array]')
			{
				for (var i = 0; i < value.length; i++)
				{
					var tmpValue = value[i];
					if (typeof tmpValue === 'string')
					{
						retStr += encodeURIComponent(key) + "[]=" + encodeURIComponent(tmpValue) + "&";
					}
					else
					{
						retStr += this.objectToHttpParam(tmpValue, key + "[" + i + "]");
					}

				}
			}
			else if (Object.prototype.toString.call(value) === '[object Object]')
			{
				retStr += this.objectToHttpParam(value, key);
			}
			else
			{
				retStr += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
			}
		}

		return retStr;
	},
	
	isSuccessStatus: function(xhr) 
	{
		return (xhr.status >= 200 && xhr.status < 300) || (AvoidJS.Ajax.expectedStatuses.indexOf(xhr.status) !== -1);
	},


	Invoke: function(params, callback, errorCallback)
	{
		var xmlhttp;
		var dataToSend = null;
		
		// create crossbrowser xmlHttpRequest
		if (window.XMLHttpRequest)
		{
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new window.XMLHttpRequest();
		}
		else
		{
			// code for IE6, IE5
			xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4)
			{
				if(AvoidJS.Ajax.isSuccessStatus(xmlhttp)) {
					AvoidJS.Ajax.onLoad(xmlhttp, params, callback, errorCallback);
				}
				else 
				{
					if(xmlhttp.status == 429) 
					{
						var retryAfter = xmlhttp.getResponseHeader('Retry-After');
						if(!retryAfter) retryAfter = 2000;
						
						Timeout.set(function() 
						{
							AvoidJS.Ajax.Invoke(params, callback, errorCallback);
						}, retryAfter);
					}
					
					try 
					{
						AvoidJS.Eventer.fire(AvoidJS.Events.XMLHTTP.requestFailed, {
							xmlhttp: xmlhttp
						}, {
							noQ: true
						});
						
						throw "Invalid response.";
						
					} catch (e) 
					{
						if(errorCallback) {
							errorCallback(e, xmlhttp);
						}
					}
				}
			}
		};
		
		xmlhttp.onabort = function() 
		{
			xmlhttp.aborted = true;
			
			AvoidJS.Logger.info("Request was aborted: " + xmlhttp.userData.url
					  + "\nData: " + JSON.stringify(xmlhttp.userData.data));
		};
		
		xmlhttp.onloadend = function()
		{
			AvoidJS.Logger.info("Request was loaded: " + xmlhttp.userData.url
					  + "\nData: " + JSON.stringify(xmlhttp.userData.data));
		};

		xmlhttp.userData = params;
		
		if(params.headers) 
		{
			performOnElsList(params.headers, function(header) {
				xmlhttp.setRequestHeader(header.key, header.value);	
			});
		}

		if (params.type && params.type.toString().toUpperCase() == 'POST')
		{
			xmlhttp.open(params.type, params.url, true);
			
			if(params.data) {
				dataToSend = this.objectToHttpParam(params.data);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}

			if(params.formData) {
				dataToSend = params.formData;
				// don't set content type as it will miss 'boundary' value
				// xmlhttp.setRequestHeader("Content-type", "multipart/form-data");
			}
		}
		else
		{
			xmlhttp.open(params.type, params.url + this.objectToHttpParam(params.data), true);
		}
		
		AvoidJS.Eventer.fire(AvoidJS.Events.XMLHTTP.beforeSend, {
			xmlhttp: xmlhttp
		}, {
			noQ: true
		});
		
		xmlhttp.send(dataToSend);
		
		return xmlhttp;
	},
	
	/**
	 * 
	 * @param {type} xmlhttp
	 * @param {AvoidJS.Ajax.Request} request
	 * @param {type} callback
	 * @param {type} errorCallback
	 * @returns {undefined}
	 */
	onLoad: function(xmlhttp, request, callback, errorCallback) 
	{
		if(!xmlhttp.aborted) 
		{
			AvoidJS.Eventer.fire(AvoidJS.Events.XMLHTTP.onLoad, {
				xmlhttp: xmlhttp
			}, {
				noQ: true
			});
			
			var response = xmlhttp.responseText;

			try 
			{
				if(request.processor) {
					response = request.processor(xmlhttp.responseText);
				}
				
				if(callback) {
					callback(response, xmlhttp.status);
				}
			}
			catch(e) 
			{
				AvoidJS.Logger.error(e);
				AvoidJS.Logger.error(xmlhttp);

				AvoidJS.Eventer.fire(AvoidJS.Events.XMLHTTP.invalidResponse, {
					xmlhttp: xmlhttp,
					response: response
				}, {
					noQ: true
				});

				if(errorCallback) {
					errorCallback(e, xmlhttp);
				}
			}
		}
	},
	
	abourtRequest: function(request) 
	{
		request.aborted = true;
		request.abort();
		request = null;
		
		return request;
	}
};

AvoidJS.Ajax.Request = function(url, type, data, formData, processor)
{
	this.url = url;
	this.type = AvoidJS.$.OR(type, "GET");
	this.data = data;
	this.formData = formData;
	this.processor = processor;
};

AvoidJS.Events.XMLHTTP = 
{
	onLoad: "onLoad",
	beforeSend: "beforeSend",
	requestFailed: "requestFailed",
	invalidResponse: "invalidResponse",
};

AvoidJS.Events.registerEvents(AvoidJS.Events.XMLHTTP);
AvoidJS.Remember = 
{
	my: {
		
	},
	
	defaults: {
		
	},
	
	typesSupport: {
		json: {
			to: function(val) {
				return JSON.stringify(val);
			},
			from: function(val, _default) {
				if(val) {
					try {
						return JSON.parse(val);
					} catch(e) {
						
					}
				}
				
				return _default;
			}
		}
	},
	
	types: {
		userChatsFilter: "json"
	},
	
	please: function(key, val) 
	{
		if(this.types[key]) {
			val = this.typesSupport[this.types[key]].to(val);
		}
		AvoidJS.Storage.save(key, val);
	},
	
	that: function(key, _default) 
	{
		var result = AvoidJS.Storage.get(key);
		if(result === "undefined" || result === undefined || result === null) {
			result = AvoidJS.$.OR(_default, AvoidJS.Remember.defaults[key]);
			
			AvoidJS.Remember.please(key, result);
		}
		else 
		{
			if(this.types[key]) {
				result = this.typesSupport[this.types[key]].from(result, _default);
			}
		}
		
		return result;
	},
	
	forget: function(key) 
	{
		AvoidJS.Storage.remove(key);
	}
};
AvoidJS.Storage = 
{
	types: {},
	storage: null,
	
	init: function(storage) 
	{
		this.storage = storage;
	},
	save: function(key, value) 
	{
		this.storage.save(key, value); 
	},
	get: function(key) 
	{
		return this.storage.get(key); 
	},
	remove: function(key) 
	{
		this.storage.remove(key); 
	}
};
AvoidJS.Storage.types.CookieStorage = 
{
	get: function (key) 
	{
		if (!key) {
			return null;
		}
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	save: function(key, value) 
	{
		return this._save(key, value, Infinity, "/")
	},
	_save: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					break;
				case String:
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + "; domain=" + (sDomain ? sDomain : "."+document.domain) + (sPath ? "; path=" + sPath : "/") + (bSecure ? "; secure" : "");
		return true;
	},
	remove: function (key, sPath, sDomain) 
	{
		if (!this.has(key)) {
			return false;
		}
		
		var date = new Date();
		date.setTime(-1);
		
		document.cookie = encodeURIComponent(key) + "=; expires=" + date.toGMTString() + ";";
		return true;
	},
	has: function (sKey) {
		if (!sKey) {
			return false;
		}
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
		}
		return aKeys;
	}
};
AvoidJS.Storage.types.LocalStorage = 
{
	save: function(key, value) 
	{
		window.localStorage.setItem(key, value); 
	},
	get: function(key) 
	{
		return window.localStorage.getItem(key); 
	},
	remove: function(key) 
	{
		window.localStorage.removeItem(key); 
	}
};
AvoidJS.Templater = 
{
	preservedContent: [],
	
	init: function() 
	{
		AvoidJS.Templater.GarbageCollector.init();
	},
	digest: function(el, data) 
	{
		AvoidJS.Templater.Manager.retrieveTemplates(el);
		AvoidJS.Templater.MacrosManager.retrive(el);
		
		AvoidJS.ui.DOM.getAllByAttribute(el, AvoidJS.conf.attrs.templater.preserveContent).onEach(function(el) 
		{
			if(!AvoidJS.ui.DOM.elHassAttr(el, AvoidJS.conf.attrs.templater.contentPreserved)) 
			{
				AvoidJS.Templater.preservedContent.push({
					el: el,
					content: AvoidJS.ui.DOM.getHTML(el)
				});
				AvoidJS.ui.DOM.clearEl(el);
				
				AvoidJS.ui.DOM.setElAttr(el, AvoidJS.conf.attrs.templater.contentPreserved, true);
			}
		});
		
		AvoidJS.Templater.MacrosManager.available.onEach(function(val, key) 
		{
			AvoidJS.ui.DOM.getAllByAttribute(el, val.attr).onEach(function(el) 
			{
				if(false == AvoidJS.ui.DOM.elHassAttr(el, AvoidJS.conf.attrs.macros.applied(key))) 
				{
					/**
					 * 
					 * @type {AvoidJS.Templater.Macros}
					 */
					var macros = AvoidJS.Templater.MacrosManager.available[key];

					macros.actions.onEach(function(actionInfo) 
					{
						/**
						 * 
						 * @type {AvoidJS.Templater.Action}
						 */
						var action = new AvoidJS.Templater.Action(actionInfo.name, el, data, actionInfo.alias, macros.el, {
							macros: {
								value: AvoidJS.ui.DOM.getElAttr(el, val.attr)
							}
						});
						
						AvoidJS.Templater.runAction(action);
					});
					
					AvoidJS.ui.DOM.setElAttr(el, AvoidJS.conf.attrs.macros.applied(key), true);
				}
			});
		});

		AvoidJS.ui.DOM.getAllByAttribute(el, AvoidJS.conf.attrs.templater.action).onEach(function(el) 
		{
			if(!AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.digested) ) 
			{
				AvoidJS.ui.DOM.setElAttr(el, AvoidJS.conf.attrs.templater.digested, true);
				
				AvoidJS.Templater.processActions(AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.action), el, data);
			}
		});
		
		AvoidJS.Eventer.fire(AvoidJS.Events.Templater.elementDigested, {
			el: el
		});
		
		AvoidJS.Eventer.fire(AvoidJS.Events.Templater.garbageCollectorDeactivateZombies);
	},
	processActions: function(actionsStr, el, data, parent) 
	{
		var actionsList = AvoidJS.Templater.ActionsParser.retriveActions(actionsStr, el, data, parent);
		
		actionsList.onEach(function(action) 
		{
			AvoidJS.Templater.runAction(action);
		});
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @returns {undefined}
	 */
	runAction: function(action) 
	{
		if(!AvoidJS.Templater.actions[action.action]) {
			AvoidJS.Logger.error("Action [" +action.action+ "] is not supported. ");
		}
		
		AvoidJS.Templater.GarbageCollector.addAction(action);

		AvoidJS.Templater.performPreAction(action);

		if(action.wait) 
		{
			AvoidJS.Templater.wait._process(action);
		}
		else 
		{
			AvoidJS.Templater.perform(action);
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @returns {undefined}
	 */
	performPreAction: function(action) 
	{
		if(AvoidJS.Templater.actions[action.action]._pre) {
			AvoidJS.Templater.actions[action.action]._pre(action);
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @param {type} el
	 * @param {type} data
	 * @returns {undefined}
	 */
	perform: function(action) 
	{
		if(AvoidJS.$.getBool(action.getProp("debug")) == true) {
			debugger;
		}
		// HINT: checking if elemnt is still in the DOM
		// and if it's not then there's no reason we should perform the action.
		if(document.contains(action.el)) 
		{
			action.prepare();
		
			if(!action.if || AvoidJS.$.getBool(new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateCondition(action.if)))
			{
				AvoidJS.Eventer.fire(AvoidJS.Events.Templater.performingAction, {
					action: action
				});

				if (action.before) {
					AvoidJS.Templater.processActions(action.before, action.el, action.getData(), action.parentEl);
				}

				var result = AvoidJS.Templater.actions[action.action].perform(action);

				if(AvoidJS.Templater.actions[action.action]._post) {
					AvoidJS.Templater.actions[action.action]._post(action, result);
				}

				AvoidJS.Eventer.fire(AvoidJS.Events.Templater.actionPerformed, {
					action: action
				});

				if (action.after) {
					AvoidJS.Templater.processActions(action.after, action.el, action.getData(), action.parentEl);
				}
			}
			else if(action.else) 
			{
				AvoidJS.Templater.processActions(action.else, action.el, action.getData(), action.parentEl);
			}
			
			if(!action.awaits) {	
				action.active = false;
			}
		}
		else 
		{
			action.valid = false;
		}
		
		AvoidJS.Eventer.fire(AvoidJS.Events.Templater.garbageCollectorCleanUp);
	},
	wait: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {undefined}
		 */
		_process: function(action) 
		{
			AvoidJS.Templater.ActionsParser.retriveNameWithAlliases(action.wait).onEach(function(wait) 
			{
				if(AvoidJS.Templater.wait[wait.name]) 
				{
					AvoidJS.Templater.wait[wait.name](action, wait.alias);
				}
				else 
				{
					AvoidJS.Logger.error("When type [" +wait.name+ "] is not supported. ");
				}
			});
		},
		/**
		* 
		* @param {AvoidJS.Templater.Action} action
		* @returns {undefined}
		*/
		now: function(action, allias) 
		{
			AvoidJS.Templater.perform(action);
		},
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @param {type} alias
		 * @returns {AvoidJS.Templater.wait.event}
		 */
		event: function (action, alias)
		{
			var _this = this;
			
			var eventsList = action.getProp(alias+"-when").split(",").trimEach();
			
			/**
			 * 
			 * @param {type} event
			 * @param {AvoidJS.Templater.Action} action
			 * @param {type} alias
			 * @returns {undefined}
			 */
			this.subscribe = function(event, action, alias) 
			{
				var args = {
					repeat: action.getProp(alias+"-repeat", 'repeat'),
					subtype: action.getProp(alias+"-subtype")
				};
				
				AvoidJS.Eventer.subscribe(event, function (data, event, subtype)
				{
					action.setData("event", data);
					action.setData("_event", {
						name: event,
						subtype: subtype
					});
					
					action.awaits = (args.repeat === 'repeat');

					AvoidJS.Templater.perform(action);

					if(action.valid && action.awaits) {
						_this.subscribe(event, action, alias);
					}

				}, {
					subtype: args.subtype,
					once: true
				});
			};
			
			eventsList.onEach(function(event) {
				_this.subscribe(event, action, alias);
			});
		},
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @param {type} alias
		 * @returns {undefined}
		 */
		trigger: function(action, alias) 
		{
			var args = {
				repeat: action.getProp(alias+"-repeat", 'repeat'),
			};	
			
			AvoidJS.Eventer.subscribe(AvoidJS.Events.Templater.triggerAction, function (data, event, subtype)
			{
				action.setData("event", data.data);
				action.setData("trigger", data.action);
				action.setData("_event", {
					name: event,
					subtype: subtype
				});
				
				action.awaits = (args.repeat === 'repeat');
				
				AvoidJS.Templater.perform(action);
				
				if(action.valid && action.awaits) {
					AvoidJS.Templater.wait.trigger(action, alias);
				}
			}, 
			{
				subtype: action.id,
				once: true
			});
		},
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @param {type} alias
		 * @returns {undefined}
		 */
		user: function(action, alias) 
		{
			var args = {
				when: action.getProp(alias+"-when"),
				noDef: action.getProp(alias+"-noDef"),
				confirm: action.getProp(alias+"-confirm")
			};
			
			AvoidJS.ui.DOM.addEvent(action.el, args.when, function (e)
			{
				if(args.noDef) {
					e.preventDefault();
				}
				
				action.setData("_event", e);
				
				if(args.confirm) 
				{
					PageAlerts.confirm(args.confirm, function() {
						AvoidJS.Templater.perform(action);
					});
				}
				else 
				{
					AvoidJS.Templater.perform(action);
				}
			});
		},
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @param {type} alias
		 * @returns {undefined}
		 */
		window: function(action, alias) 
		{
			var args = {
				when: action.getProp(alias+"-when"),
				noDef: action.getProp(alias+"-noDef")
			};
			
			AvoidJS.ui.DOM.addEvent(window, args.when, function (e)
			{
				if(args.noDef) {
					e.preventDefault();
				}
				
				action.setData("_event", e);
				AvoidJS.Templater.perform(action);
			});
		},
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @param {type} el
		 * @returns {undefined}
		 */
		timeout: function (action, alias)
		{
			AvoidJS.core.Timeout.set(function ()
			{
				AvoidJS.Templater.perform(action);

			}, action.getProp(alias));
		}
	}
};

/**
 * 
 * @param {type} action
 * @param {type} el
 * @param {type} data
 * @param {type} alias
 * @param {AvoidJS.Templater.Action} parentEl
 * @returns {AvoidJS.Templater.Action}
 */
AvoidJS.Templater.Action = function(action, el, data, alias, parentEl, contexts)
{
	var _this = this;
	
	// HINT: becomes invalid when element is no longer in DOM
	this.valid = true;
	this.active = true;
	this.awaits = false;
	
	this.el = el;
	this.action = action;
	this.alias = AvoidJS.$.OR(alias, action);
	this.parentEl = parentEl;
	
	this.prepare = function() 
	{
		if(this.parentEl) {
			this._retrieveDataAttrbs(this.parentEl);
		}
		
		this._retrieveDataAttrbs(this.el);
		
		this.setData("_global", AvoidJS.Templater.Glob.data);
		this.setData("_elContent", AvoidJS.ui.DOM.getHTML(el).trim());
	};
	
	this._retrieveDataAttrbs = function(el) 
	{
		var dataAttr = AvoidJS.conf.attrs.actions.data(this.alias);
		
		el.attributes.onEach(function(attr) {
			if(attr.name.indexOf(dataAttr) === 0) 
			{
				var prop = attr.name.replace(dataAttr, "").split("-")[0];
				_this.data[prop] = _this.getProp("data-"+prop);
			}
		});
	};
	
	this.getProp = function(prop, _default) 
	{
		prop = prop.toLowerCase();
		
		var result = this._retrievePropFromEl(this.el, prop);

		if(result === null && this.parentEl) 
		{
			result = this._retrievePropFromEl(this.parentEl, prop);
		}
		
		return AvoidJS.$.OR(result, _default);
	};
	
	this._retrievePropFromEl = function(el, prop) 
	{
		var result = null;
		
		var attr = AvoidJS.conf.attrs.actions.prop(this.alias, prop);
		
		var expr = AvoidJS.ui.DOM.getElAttr(el, attr+"-expr");
		
		if(expr) 
		{
			result = new AvoidJS.Templater.Temparser(null, this.getData()).evaluate(expr);
		}
		else if(AvoidJS.ui.DOM.elHassAttr(el, attr)) 
		{
			result = AvoidJS.ui.DOM.getElAttr(el, attr);
		}
		
		return result;
	};
	
	this.getData = function(context) 
	{
		return new AvoidJS.Templater.Temparser(null, this.data).parseValue(AvoidJS.$.OR(context, this.context));
	};
	
	this.setData = function(context, data) 
	{
		this.data[context] = data;
	}
	
	this.data = {
		data: AvoidJS.$.OR(data, {}),
		action: _this,
	};
	
	if(contexts) {
		contexts.onEach(function(val, key) {
			_this.data[key] = val;
		});
	}
	
	this.context = this.getProp('context', "data");
	
	this.id = this.getProp("id", this.action);
	this.wait = this.getProp("wait");
	
	this.if = this.getProp("if");
	this.else = this.getProp("else");
	
	this.before = this.getProp("before");
	this.after = this.getProp("after");
};

AvoidJS.Templater.ActionsParser = 
{
	retriveActions: function(actionsStr, el, data, parent) 
	{
		var actions = [];
		
		this.retriveNameWithAlliases(actionsStr).onEach(function(action) 
		{
			actions.push(new AvoidJS.Templater.Action(action.name, el, data, action.alias, parent));
		});
		
		return actions;
	},
	
	retriveNameWithAlliases: function(actionsStr) 
	{
		var result = [];
		
		var actionsStrList = actionsStr.split(",").trimEach();
		
		actionsStrList.onEach(function(item) 
		{
			var name = item;
			var alias = name;
			
			var valSplit = item.split("=");
			if(valSplit.length > 1) {
				alias = valSplit[0];
				name = valSplit[1];
			}
			
			result.push({
				name: name,
				alias: alias
			});;
		});
		
		return result;
	}
};

AvoidJS.Templater.Glob = 
{
	data: {
		
	},
	get: function(action, key, _default) 
	{
		var result = _default;
		if(this.data[action]) 
		{
			result = this.data[action];
			if(key) {
				result = this.data[action][key];
			}
		} else {
			// if wasn't found - setting default
			if(key) {
				this.set(action, key, result);
			} else {
				this.data[action] = result;
			}
		}
		
		return result;
	},
	set: function(action, key, val) 
	{
		if(!this.data[action]) {
			this.data[action] = {};
		}
		this.data[action][key] = val;
	}
};

AvoidJS.Templater.GarbageCollector = 
{
	activeActions: [],
	
	init: function() 
	{
		AvoidJS.Eventer.subscribe(AvoidJS.Events.Templater.garbageCollectorDeactivateZombies, function() 
		{
			AvoidJS.Templater.GarbageCollector.deactivateZombies();
		});
		
		AvoidJS.Eventer.subscribe(AvoidJS.Events.Templater.garbageCollectorCleanUp, function() 
		{
			AvoidJS.Templater.GarbageCollector.collectGarbage();
		});
	},
	
	addAction: function(action) 
	{
		this.activeActions.push(action);
	},
	
	deactivateZombies: function() 
	{
		this.activeActions.onEach(function(action, i) 
		{
			if(document.contains(action.el) == false) {
				action.valid = false;
				action.active = false;
			}
		});
	},
	
	collectGarbage: function() 
	{
		var i = this.activeActions.length;
		
		while (i-- && i !== -1) 
		{
			if(this.activeActions[i].active === false) {
				this.activeActions.splice(i, 1);
			}
		}
	}
};


AvoidJS.Events.Templater = 
{
	triggerAction: "triggerAction",
	elementDigested: "elementDigested",
	performingAction: "performingAction",
	actionPerformed: "actionPerformed",
	
	garbageCollectorDeactivateZombies: "garbageCollectorDeactivateZombies",
	garbageCollectorCleanUp: "garbageCollectorCleanUp"
};

AvoidJS.Events.registerEvents(AvoidJS.Events.Templater);
AvoidJS.Templater.actions = 
{
	void: 
	{
		perform: function() 
		{
			return;
		}
	},
	trigger: 
	{
		perform: function(action) 
		{
			action.getProp("action", "").split(",").trimEach().onEach(function(action_id) 
			{
				AvoidJS.Eventer.fire(AvoidJS.Events.Templater.triggerAction, 
				{
					data: action.getData(),
					action: action
				}, 
				{
					noQ: true,
					subtype: action_id
				});
			});
		}
	},
	retrigger: 
	{
		perform: function(action) 
		{
			action.getProp("action", "").split(",").trimEach().onEach(function(action_id) 
			{
				AvoidJS.Eventer.refire(AvoidJS.Events.Templater.triggerAction, action_id);
			});
		}
	},
	execute: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {unresolved}
		 */
		perform: function(action) 
		{
			var code = action.getProp("func", "");
			
			code.split(";").trimEach().onEach(function(piece) 
			{
				new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateExpression(piece);
			});
		}
	},
	fire: 
	{
		perform: function(action) 
		{
			return AvoidJS.Eventer.fire(action.getProp("event"), null, {
				noQ: true,
				subtype: action.getProp("subtype")
			}); 
		}
	},
	condition: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {undefined}
		 */
		perform: function(action) 
		{
			var cond = action.getProp("expr", "");
			var when_true = action.getProp("true");
			var when_false = action.getProp("false");

			if(AvoidJS.$.getBool(new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateCondition(cond))) 
			{
				if(when_true) {
					AvoidJS.Templater.processActions(when_true, action.el, action.getData(), action.parentEl);
				}
			}
			else 
			{
				if(when_false) {
					AvoidJS.Templater.processActions(when_false, action.el, action.getData(), action.parentEl);
				}
			}
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @param {type} el
	 * @returns {undefined}
	 */
	include: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setHTML(action.el, AvoidJS.Templater.Manager.getHTML(action.getProp("template")));
			
			AvoidJS.Templater.digest(action.el, action.getData());
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @param {type} el
	 * @returns {undefined}
	 */
	draw: 
	{
		_pre: function(action) 
		{
			action.html = AvoidJS.ui.DOM.getHTML(action.el);
			
			var placeholder = action.getProp('placeholder');

			if(placeholder) {
				AvoidJS.ui.DOM.setHTML(action.el, placeholder);
			}
		},
		perform: function(action) 
		{
			return new AvoidJS.Templater.Temparser(this.__getContent(action), action.getData(), null).format();
		},
		_post: function(action, result) 
		{
			if(AvoidJS.$.getBool(action.getProp("clear", true))) {
				AvoidJS.ui.DOM.clearEl(action.el);
			}
			
			var isAbove = action.getProp("above", false);

			AvoidJS.ui.DOM.addNodeFromHTML(action.el, result, isAbove);			
			AvoidJS.Templater.digest(action.el, action.getData());
		},
		__getContent: function(action) 
		{
			if(action.getProp("template")) {
				return AvoidJS.Templater.Manager.getHTML(action.getProp("template"));
			}
			
			if(action.getProp("page")) {
				return AppPage.getPageHTML(action.getProp("page"));
			}
			
			if(action.getProp("content")) {
				return action.getProp("content");
			}
			
			var content = action.html;
			AvoidJS.Templater.preservedContent.onEach(function(item) {
				if(item.el === action.el) {
					content = item.content;
					return false;
				}
			});

			return content;
		}
	},
	drawEvery:
	{
		_pre: function(action) 
		{
			return AvoidJS.Templater.actions.draw._pre(action);
		},
		perform: function(action) 
		{
			var args = 
			{
				clear: AvoidJS.$.getBool(action.getProp("clear", true)),
				alias: action.getProp("alias", "val"),
				sep: action.getProp("sep", ""),
				sepEvery: parseInt(action.getProp("sepEvery", 1)),
				isAbove: action.getProp("above", false),
				
				every: action.getProp('every'),
				everyIf: action.getProp("everyIf", false),
				everyAfter: action.getProp("everyAfter", false),
				
				ifNone: action.getProp('ifNone')
			};
			
			var every = new AvoidJS.Templater.Temparser(null, action.getData()).evaluateExpression(args.every);	

			if(every.length > 0) 
			{
				if(args.clear) {
					AvoidJS.ui.DOM.clearEl(action.el);
				}
				
				return every.onEach( 
				function(val, i, l) 
				{
					var itemData = {
						parent: action.getData(),
						val: val,
						index: i
					};
					
					itemData[args.alias] = val;
					
					action.setData("_item", itemData);
					
					if(!args.everyIf || AvoidJS.$.getBool(new AvoidJS.Templater.Temparser(null, itemData, null).evaluateCondition(args.everyIf))) 
					{
						// if not first element and the amount of elements that needs to be separated is reached
						var sep = (l > 0 && ((i+1) % args.sepEvery == 0)) 
									? args.sep 
									: "";

						var html = new AvoidJS.Templater.Temparser(AvoidJS.Templater.actions.draw.__getContent(action), itemData, null).format();

						AvoidJS.core.Threader.run(function() 
						{
							AvoidJS.ui.DOM.addNodeFromHTML(action.el, html+sep, args.isAbove);

							AvoidJS.Templater.digest(action.el, itemData);

							if (args.everyAfter) {
								AvoidJS.Templater.processActions(args.everyAfter, action.el, itemData, action.parentEl);
							}
						}, 
						{
							inQ: false,
							callback: null
						});
					}
				},
				function(eachRes, result) 
				{
					return AvoidJS.$.OR(result, "") + eachRes;
				});
			}
			else 
			{
				if(args.ifNone) {
					AvoidJS.ui.DOM.setHTML(action.el, args.ifNone);
				}
			}
		}
	},
	setHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setHTML(action.el, action.getProp("value"));
		}
	},
	addHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.addNodeFromHTML(action.el, action.getProp("value"), action.getProp("above"));
		}
	},
	clearHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.clearEl(action.el, action.getProp("value"));
		}
	},
	show: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.showEl(action.el, action.getProp("display"));
		}
	},
	hide: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.hideEl(action.el);
		}
	},
	enable: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.enEl(action.el);
		}
	},
	disable: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.disEl(action.el);
		}
	},
	focus: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setFocus(action.el);
		}
	},
	placeholder: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "placeholder", action.getProp("text"));
		}
	},
	checked: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setChecked(action.el, AvoidJS.$.getBool(action.getProp("value")));
		}
	},	
	selected: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setSelectedOption(action.el, action.getProp("value"));
		}
	},
	addClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.addClassToEl(action.el, action.getProp("class"));
		}
	},
	removeClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.removeClassFromEl(action.el, action.getProp("class"));
		}
	},
	switchClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.switchClassOnEl(action.el, action.getProp("class"));
		}
	},
	setValue: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setValue(action.el, action.getProp("value", ""));
		}
	},
	resetValue: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.resetValue(action.el);
		}
	},
	select: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.select(action.el);
		}
	},
	restorableValue: 
	{
		perform: function(action) 
		{
			var storageKey = action.getProp("storageKey");
			
			AvoidJS.ui.DOM.setValue(action.el, AvoidJS.Remember.that(storageKey, AvoidJS.ui.DOM.getValue(action.el)))
			
			AvoidJS.Eventer.subscribeOnce(AvoidJS.Events.PageDirector.pageUnloaded, function() {
				AvoidJS.Remember.please(storageKey, AvoidJS.ui.DOM.getValueTrimmed(action.el));;
			});
		}
	},
	rememberGlob: 
	{
		perform: function(action) 
		{
			AvoidJS.Remember.please(action.getProp("remember"), AvoidJS.Templater.Glob.get(action.getProp("glob")));
		}
	},
	setSrc: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "src", action.getProp("value"));
		}
	},
	setHref: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "href", action.getProp("href"));
		}
	},
	toggleDisplay: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.toggleElDisplay(action.el, action.getProp("display"));
		}
	},
	adaptHeight: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.adaptElHeight(action.el);
		}
	},
	autoHeight: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.adaptiveHeight(action.el);
		}
	},
	scrollTop: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollTop(action.el);
		}
	},
	scrollIntoView: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollIntoView(action.el);
		}
	},
	scrollDown: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollDown(action.el);
		}
	},
	preserveScroll: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "tmp-preserveScroll-value", action.el.scrollHeight - action.el.scrollTop);
		}
	},
	restoreScroll: 
	{
		perform: function(action) 
		{
			var preservedScroll = AvoidJS.ui.DOM.getElAttr(action.el, "tmp-preserveScroll-value");
			
			if(preservedScroll !== undefined) 
			{
				AvoidJS.ui.DOM.setScrollTop(action.el, action.el.scrollHeight - preservedScroll);
				AvoidJS.ui.DOM.removeElAttr(action.el, "tmp-preserveScroll-value")
			}
		}
	},
	noScrollingPropagation: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.preventScrollPropagation(action.el);
		}
	},
	processForm: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {undefined}
		 */
		perform: function(action) 
		{
			var formData = {};
			var form = new FormData(action.el);
			
			action.el.querySelectorAll("[name]").onEach(function(el) 
			{
				var name = AvoidJS.ui.DOM.getElAttr(el, "name");
				var value = AvoidJS.ui.DOM.getValue(el);
				
				if(!formData[name+"_array"]) {
					formData[name+"_array"] = [];
				}
		
				if(AvoidJS.ui.DOM.getElAttr(el, "type") === "checkbox") {
					if(el.checked) {
						formData[name] = "on";
						formData[name+"_array"].push(value); // 
					}
					else 
					{
						formData[name] = "off";
					}
				}
				else 
				{
					formData[name] = value;
					formData[name+"_array"].push(value); // 
				}
			});
			
			action.setData("formData", formData);
			action.setData("form", form);
			
			var isValid = true;
			
			AvoidJS.ui.DOM.getAllByAttribute(action.el, AvoidJS.conf.attrs.actions.formValidation).onEach(function(el) 
			{
				var func = AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.actions.formValidation);
				
				var result = new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateExpression(func)(AvoidJS.ui.DOM.getValueTrimmed(el));
				
				if(!result.valid) 
				{
					isValid = false;
					PageDirector.showOperationError(result.message);
					return false;
				}
			});
			
			var whenValid = action.getProp("ifValid");
			
			if(isValid && whenValid) {
				AvoidJS.Templater.processActions(whenValid, action.el, action.getData(), action.parentEl);
			}
		}
	},
	
	fadeOut: 
	{
		perform: function(action) 
		{
			UIEffects.fadeOut(action.el);
		}
	},
	
	setStyle: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setStyle(action.el, action.getProp("style"), action.getProp("value"));
		}
	},
	
	json2html: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.json2html(action.el);
		}
	}
};
AvoidJS.Templater.MacrosManager = 
{
	available: {},
	
	retrive: function(el) 
	{
		AvoidJS.ui.DOM.getAllByAttribute(el, AvoidJS.conf.attrs.macros.def).onEach(function(el) 
		{
			if(!AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.digested) ) 
			{
				var macrosName = AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.macros.def);
				
				AvoidJS.Templater.MacrosManager.available[macrosName] = new AvoidJS.Templater.Macros(macrosName, el);

				AvoidJS.ui.DOM.setElAttr(el, AvoidJS.conf.attrs.templater.digested, true);
			}
		});
	},
};

AvoidJS.Templater.Macros = function(name, el) 
{
	this.name = name;
	this.attr = AvoidJS.conf.attrs.macros.apply(name);
	this.el = el;
	this.actions = AvoidJS.Templater.ActionsParser.retriveNameWithAlliases(AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.action));;
};
AvoidJS.Templater.Temparser = function(content, data, name) 
{
	var _this = this;
	this.content = content;
	this.name = name;
	this.data = data;
	
	this.format = function() 
	{
		return this.content.replace(new RegExp("{{(.[^{{]+)}}", "g"), function(match, matchInner) 
		{
			var value = _this.evaluate(matchInner, match);

			return AvoidJS.$.OR(value, "");
		}).trim();
	};
	
	this.evaluate = function(expression, _default) 
	{
		var value = null;
		
		var conditionParts = expression.split("?").trimEach();
		
		// if condition
		if(conditionParts.length > 1) 
		{
			var condition = conditionParts[0];
			
			var whenTrue = conditionParts[1];
			var whenFalse = null;
			
			// if "else" is presented
			var outcomes = conditionParts[1].split(":").trimEach();
			
			if(outcomes.length > 1) 
			{
				whenTrue = outcomes[0];
				whenFalse = outcomes[1];
			}
			
			if(_this.evaluateCondition(condition)) 
			{	
				if(whenTrue) {
					value = _this.evaluate(whenTrue);
				}	
			}
			else 
			{
				if(whenFalse) {
					value = _this.evaluate(whenFalse);
				}	
			}
			
		}
		else 
		{
			// no condition, jsut an expression
			value = _this.evaluateCondition(conditionParts[0], _default);
		}
		
		return value;
	};
	
	this.evaluateCondition = function(expression) 
	{
		var result = false;
		
		var ands = expression.split(/\sand\s/).trimEach();
		var ors = expression.split(/\sor\s/).trimEach();
		
		if(ands.length > 1) 
		{
			for(var i = 0; i < ands.length; i++) 
			{
				if(_this.evaluateCondition(ands[i])) 
				{
					result = true;
				} else {
					result = false;
					break;
				}
			}
		} 
		else if(ors.length > 1) 
		{	
			var ors = expression.split(" or ").trimEach();
			
			for(var i = 0; i < ors.length; i++) 
			{
				if(_this.evaluateCondition(ors[i])) 
				{
					result = true;
					break;
				}
			}
		}
		else 
		{
			if(expression.match(/^[\"'].*[\"']$/g) === null) 
			{
				// checking if it's entry like 'a == b'
				// not the best approach
				var availableCompars = []; 
				AvoidJS.Templater.Temparser.comparisons._map.onEach(function(val, key) {
					availableCompars.push(val);
				});
				
				var matches = expression.match("(.+)("+availableCompars.join("|")+")(.+)");
					
				if(matches) 
				{
					matches = matches.trimEach();
					var val1 = _this.evaluateExpression(matches[1]);
					var val2 = _this.evaluateExpression(matches[3]);

					var compareFunc = AvoidJS.Templater.Temparser.comparisons._find(matches[2]);

					if(compareFunc) 
					{
						result = AvoidJS.Templater.Temparser.comparisons[compareFunc](val1, val2);
					}
					else 
					{
						AvoidJS.Logger.error("Tempater.comparison: ["+matches[1]+"] not found.");
					}
				}
				else 
				{
					result = _this.evaluateExpression(expression, false);
				}
				
			} else {
				result = expression.replace(/^[\"']|[\"']$/g, '');
			}
		}
		
		return result;
		
	};
	
	this.evaluateExpression = function(expression, _default) 
	{
		var value = _default;
		
		var executive = expression.match(/(.[^(]+)\(?/);
		var arguments = expression.match(/[(](.*)[)]/);

		if(executive && executive.length > 0) 
		{
			if(arguments && arguments.length > 0) 
			{
				var func = _this.parseDataExpression(executive[1], undefined);
				var funcArguments = _this.parseExpressionArguments(arguments[1]);

				if(func.value !== undefined) 
				{
					value = func.value.apply(func.obj, funcArguments);
				}
			}
			else 
			{
				value = _this.parseValue(executive[1], _default);
			}
		}
		else 
		{
			value = _this.parseValue(expression, _default);
		}
		
		return value;
	};
	
	this.parseDataExpression = function(expression, _default) 
	{
		var result = {
			obj: null,
			value: _default
		};
		
		if(expression) 
		{
			var tempData = _this.data;
			var keysPath = expression.split(".").trimEach();
		
			keysPath.onEach(function(key, i) 
			{
				if(tempData !== null 
				&& tempData !== undefined 
				&& tempData[key] !== undefined) 
				{
					result.obj = tempData;
					result.value = tempData = tempData[key];
				}
				else if (i == 0 && window[key] !== undefined) 
				{
					result.obj = window;
					result.value = tempData = window[key];
				}
				else 
				{
					AvoidJS.Logger.error("AvoidJS.Templater.Temparser: ["+_this.name+"] Cannot find data for [" + expression + "]");

					AvoidJS.Logger.error("== Defails ==");
					AvoidJS.Logger.error("Data Available: ");
					AvoidJS.Logger.error(_this.data);
					AvoidJS.Logger.error("Content: ");
					AvoidJS.Logger.error(_this.content);
					AvoidJS.Logger.error("== End ==");
					result.value = _default;
				}
			});
		}
		
		return result;
	};
	
	this.parseExpressionArguments = function(expression) 
	{
		var retArgs = [];
		
		if(expression) 
		{
			var args = expression.split(",");
			
			args.onEach(function(item) 
			{
				retArgs.push(_this.parseValue(item));
			});
		}
		
		return retArgs;
	};
	
	this.parseValue = function(expression, _default) 
	{
		var value = _default;
		
		if(expression) 
		{
			expression = expression.trim().replace(/&quot;/g, '\"');
			if(expression.match(/^[\"']|[\"']$/g) !== null) 
			{
				value = expression.replace(/^[\"']|[\"']$/g, '');
			}
			else if(expression.isNumeric()) 
			{
				value = expression;
			}
			else 
			{
				switch (expression) 
				{
					case "true":
						value = true;
						break;

					case "false":
						value = false;
						break;

					case "this":
						value = _this.data;
						break;

					case "null":
						value = null;
						break;

					default:
						value = _this.parseDataExpression(expression, _default).value;
				}
			}
		}
		
		return value;
	}
	
	return this;
};

AvoidJS.Templater.Temparser.comparisons = 
{
	_find: function(cmp) 
	{
		for(var itm in this._map) {
			if(cmp == this._map[itm]) {
				return itm;
			}
		}
	},
	_map: {
		notEqq: "!==",
		notEq: "!=",
		eqq: "===",
		eq: "==",
		moreOrEq: ">=",
		more: ">",
		lessOrEq: "<=",
		less: "<"
	},
	eq: function(a, b) 
	{
		return a == b;
	},
	eqq: function(a, b) 
	{
		return a === b;
	},
	notEq: function(a, b) 
	{
		return a != b;
	},
	notEqq: function(a, b) 
	{
		return a !== b;
	},
	more: function(a, b) 
	{
		return (parseFloat(a) > parseFloat(b));
	},
	moreOrEq: function(a, b) 
	{
		return (parseFloat(a) >= parseFloat(b));
	},
	less: function(a, b) 
	{
		return (parseFloat(a) < parseFloat(b));;
	},
	lessOrEq: function(a, b) 
	{
		return (parseFloat(a) <= parseFloat(b));;
	}
};
AvoidJS.Templater.Manager = new function() 
{
	var _this = this;
	this.loadedTemplates = {};
	this.templateRelations = {};
	
	this.init = function(el) 
	{
		var toLoad = AvoidJS.ui.DOM.getAllByAttribute(el, AvoidJS.conf.attrs.templater.load);
		
		if(toLoad.length > 0) 
		{
			var loadedList = [];
			toLoad.onEach(
			function(el) 
			{
				var templateName = AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.load);
				AvoidJS.Ajax.Invoke(new AvoidJS.Ajax.Request(
					templateName
				),
				function(data) 
				{
					AvoidJS.ui.DOM.setHTML(el, data);
					
					loadedList.push(templateName);
					if(loadedList.length == toLoad.length) 
					{
						AvoidJS.Eventer.fire(AvoidJS.Events.TemplatesManager.loaded, null, {
							noQ: true
						});
					}
				});
			});
		} else {
			AvoidJS.Eventer.fire(AvoidJS.Events.TemplatesManager.loaded, null, {
				noQ: true
			});
		}
	}
	
	this.retrieveTemplates = function(element, parent) 
	{
		AvoidJS.ui.DOM.getAllByAttribute(element, AvoidJS.conf.attrs.templater.template).onEach(
		function(el) {
			_this.retrieveTemplate(el, parent);
		});
	};
	
	this.retrieveTemplate = function(el, parent) 
	{
		var templateName = AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.templater.template);
		
		if(_this.loadedTemplates[templateName] === undefined) 
		{
			// first retrieve included templates to prevent them from rendering as a part of this template
			_this.retrieveTemplates(el, parent);
			
			_this.loadedTemplates[templateName] = AvoidJS.ui.DOM.getHTML(el);
			if(parent) {
				_this.templateRelations[parent] = templateName;
			}

			AvoidJS.ui.DOM.removeEl(el);
		}
	};

	this.getHTML = function(templateName) 
	{
		if(this.loadedTemplates[templateName] === undefined) 
		{
			throw "Cannot find template: '"+templateName+"'";
		}
		
		return this.loadedTemplates[templateName];
	};

	this.format = function(templateName, data) 
	{
		return new AvoidJS.Templater.Temparser(this.getHTML(templateName), data, templateName).format();
	};
};

AvoidJS.Events.TemplatesManager = 
{
	loaded: "loaded"
};

AvoidJS.Events.registerEvents(AvoidJS.Events.TemplatesManager);
AvoidJS.ui.Effects = new function() 
{
	this.fadeOut = function(el) 
	{
		UIManager.setStyle(el, "opacity", 0.3);
	};
};
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
AvoidJS.ui.Format = new function() 
{
	this.nl2br = function(str) 
	{
		return str.replace(/\n/g, '<br/>');
	};
	
	this.OX = function(num) 
	{
		return (num < 10) ? "0" + num : num;
	};
	
	this.escapeHtml = function(str)
	{
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return str.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	};
};
AvoidJS.cmd = 
{
	init: function(node) 
	{
		AvoidJS.Templater.init();
		AvoidJS.Templater.Manager.init(node);

		AvoidJS.Eventer.subscribe(AvoidJS.Events.TemplatesManager.loaded, function() 
		{
			AvoidJS.Templater.digest(node);
			
			AvoidJS.Eventer.fire(AvoidJS.Events.AvoidJS.inited, null, {
				noQ: true
			});
		});
	}
};

AvoidJS.Events.AvoidJS = {
	inited: "inited"
};

AvoidJS.Events.registerEvents(AvoidJS.Events.AvoidJS);
//
//
//
module.exports = AvoidJS;