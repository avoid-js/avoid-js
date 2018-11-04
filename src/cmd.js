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