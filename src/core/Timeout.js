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