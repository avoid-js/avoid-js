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