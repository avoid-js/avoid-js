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