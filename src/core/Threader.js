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