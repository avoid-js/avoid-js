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