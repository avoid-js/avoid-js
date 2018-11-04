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