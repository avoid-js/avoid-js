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