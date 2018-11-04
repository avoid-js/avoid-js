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