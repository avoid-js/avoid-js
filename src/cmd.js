AvoidJS.cmd = 
{
	init: function(node) 
	{
		// subscribe before init as the event will be thrown without queueing
        AvoidJS.Eventer.subscribe(AvoidJS.Events.TemplatesManager.loaded, function()
        {
            AvoidJS.Templater.digest(node);

            AvoidJS.Eventer.fire(AvoidJS.Events.AvoidJS.inited, null, {
                noQ: true
            });
        });

		AvoidJS.Templater.init();
		AvoidJS.Templater.Manager.init(node);
	}
};

AvoidJS.Events.AvoidJS = {
	inited: "inited"
};

AvoidJS.Events.registerEvents(AvoidJS.Events.AvoidJS);