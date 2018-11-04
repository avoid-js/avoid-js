AvoidJS.Templater.actions = 
{
	void: 
	{
		perform: function() 
		{
			return;
		}
	},
	trigger: 
	{
		perform: function(action) 
		{
			action.getProp("action", "").split(",").trimEach().onEach(function(action_id) 
			{
				AvoidJS.Eventer.fire(AvoidJS.Events.Templater.triggerAction, 
				{
					data: action.getData(),
					action: action
				}, 
				{
					noQ: true,
					subtype: action_id
				});
			});
		}
	},
	retrigger: 
	{
		perform: function(action) 
		{
			action.getProp("action", "").split(",").trimEach().onEach(function(action_id) 
			{
				AvoidJS.Eventer.refire(AvoidJS.Events.Templater.triggerAction, action_id);
			});
		}
	},
	execute: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {unresolved}
		 */
		perform: function(action) 
		{
			var code = action.getProp("func", "");
			
			code.split(";").trimEach().onEach(function(piece) 
			{
				new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateExpression(piece);
			});
		}
	},
	fire: 
	{
		perform: function(action) 
		{
			return AvoidJS.Eventer.fire(action.getProp("event"), null, {
				noQ: true,
				subtype: action.getProp("subtype")
			}); 
		}
	},
	condition: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {undefined}
		 */
		perform: function(action) 
		{
			var cond = action.getProp("expr", "");
			var when_true = action.getProp("true");
			var when_false = action.getProp("false");

			if(AvoidJS.$.getBool(new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateCondition(cond))) 
			{
				if(when_true) {
					AvoidJS.Templater.processActions(when_true, action.el, action.getData(), action.parentEl);
				}
			}
			else 
			{
				if(when_false) {
					AvoidJS.Templater.processActions(when_false, action.el, action.getData(), action.parentEl);
				}
			}
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @param {type} el
	 * @returns {undefined}
	 */
	include: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setHTML(action.el, AvoidJS.Templater.Manager.getHTML(action.getProp("template")));
			
			AvoidJS.Templater.digest(action.el, action.getData());
		}
	},
	/**
	 * 
	 * @param {AvoidJS.Templater.Action} action
	 * @param {type} el
	 * @returns {undefined}
	 */
	draw: 
	{
		_pre: function(action) 
		{
			action.html = AvoidJS.ui.DOM.getHTML(action.el);
			
			var placeholder = action.getProp('placeholder');

			if(placeholder) {
				AvoidJS.ui.DOM.setHTML(action.el, placeholder);
			}
		},
		perform: function(action) 
		{
			return new AvoidJS.Templater.Temparser(this.__getContent(action), action.getData(), null).format();
		},
		_post: function(action, result) 
		{
			if(AvoidJS.$.getBool(action.getProp("clear", true))) {
				AvoidJS.ui.DOM.clearEl(action.el);
			}
			
			var isAbove = action.getProp("above", false);

			AvoidJS.ui.DOM.addNodeFromHTML(action.el, result, isAbove);			
			AvoidJS.Templater.digest(action.el, action.getData());
		},
		__getContent: function(action) 
		{
			if(action.getProp("template")) {
				return AvoidJS.Templater.Manager.getHTML(action.getProp("template"));
			}
			
			if(action.getProp("page")) {
				return AppPage.getPageHTML(action.getProp("page"));
			}
			
			if(action.getProp("content")) {
				return action.getProp("content");
			}
			
			var content = action.html;
			AvoidJS.Templater.preservedContent.onEach(function(item) {
				if(item.el === action.el) {
					content = item.content;
					return false;
				}
			});

			return content;
		}
	},
	drawEvery:
	{
		_pre: function(action) 
		{
			return AvoidJS.Templater.actions.draw._pre(action);
		},
		perform: function(action) 
		{
			var args = 
			{
				clear: AvoidJS.$.getBool(action.getProp("clear", true)),
				alias: action.getProp("alias", "val"),
				sep: action.getProp("sep", ""),
				sepEvery: parseInt(action.getProp("sepEvery", 1)),
				isAbove: action.getProp("above", false),
				
				every: action.getProp('every'),
				everyIf: action.getProp("everyIf", false),
				everyAfter: action.getProp("everyAfter", false),
				
				ifNone: action.getProp('ifNone')
			};
			
			var every = new AvoidJS.Templater.Temparser(null, action.getData()).evaluateExpression(args.every);	

			if(every.length > 0) 
			{
				if(args.clear) {
					AvoidJS.ui.DOM.clearEl(action.el);
				}
				
				return every.onEach( 
				function(val, i, l) 
				{
					var itemData = {
						parent: action.getData(),
						val: val,
						index: i
					};
					
					itemData[args.alias] = val;
					
					action.setData("_item", itemData);
					
					if(!args.everyIf || AvoidJS.$.getBool(new AvoidJS.Templater.Temparser(null, itemData, null).evaluateCondition(args.everyIf))) 
					{
						// if not first element and the amount of elements that needs to be separated is reached
						var sep = (l > 0 && ((i+1) % args.sepEvery == 0)) 
									? args.sep 
									: "";

						var html = new AvoidJS.Templater.Temparser(AvoidJS.Templater.actions.draw.__getContent(action), itemData, null).format();

						AvoidJS.core.Threader.run(function() 
						{
							AvoidJS.ui.DOM.addNodeFromHTML(action.el, html+sep, args.isAbove);

							AvoidJS.Templater.digest(action.el, itemData);

							if (args.everyAfter) {
								AvoidJS.Templater.processActions(args.everyAfter, action.el, itemData, action.parentEl);
							}
						}, 
						{
							inQ: false,
							callback: null
						});
					}
				},
				function(eachRes, result) 
				{
					return AvoidJS.$.OR(result, "") + eachRes;
				});
			}
			else 
			{
				if(args.ifNone) {
					AvoidJS.ui.DOM.setHTML(action.el, args.ifNone);
				}
			}
		}
	},
	setHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setHTML(action.el, action.getProp("value"));
		}
	},
	addHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.addNodeFromHTML(action.el, action.getProp("value"), action.getProp("above"));
		}
	},
	clearHTML: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.clearEl(action.el, action.getProp("value"));
		}
	},
	show: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.showEl(action.el, action.getProp("display"));
		}
	},
	hide: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.hideEl(action.el);
		}
	},
	enable: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.enEl(action.el);
		}
	},
	disable: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.disEl(action.el);
		}
	},
	focus: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setFocus(action.el);
		}
	},
	placeholder: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "placeholder", action.getProp("text"));
		}
	},
	checked: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setChecked(action.el, AvoidJS.$.getBool(action.getProp("value")));
		}
	},	
	selected: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setSelectedOption(action.el, action.getProp("value"));
		}
	},
	addClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.addClassToEl(action.el, action.getProp("class"));
		}
	},
	removeClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.removeClassFromEl(action.el, action.getProp("class"));
		}
	},
	switchClass: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.switchClassOnEl(action.el, action.getProp("class"));
		}
	},
	setValue: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setValue(action.el, action.getProp("value", ""));
		}
	},
	resetValue: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.resetValue(action.el);
		}
	},
	select: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.select(action.el);
		}
	},
	restorableValue: 
	{
		perform: function(action) 
		{
			var storageKey = action.getProp("storageKey");
			
			AvoidJS.ui.DOM.setValue(action.el, AvoidJS.Remember.that(storageKey, AvoidJS.ui.DOM.getValue(action.el)))
			
			AvoidJS.Eventer.subscribeOnce(AvoidJS.Events.PageDirector.pageUnloaded, function() {
				AvoidJS.Remember.please(storageKey, AvoidJS.ui.DOM.getValueTrimmed(action.el));;
			});
		}
	},
	rememberGlob: 
	{
		perform: function(action) 
		{
			AvoidJS.Remember.please(action.getProp("remember"), AvoidJS.Templater.Glob.get(action.getProp("glob")));
		}
	},
	setSrc: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "src", action.getProp("value"));
		}
	},
	setHref: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "href", action.getProp("href"));
		}
	},
	toggleDisplay: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.toggleElDisplay(action.el, action.getProp("display"));
		}
	},
	adaptHeight: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.adaptElHeight(action.el);
		}
	},
	autoHeight: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.adaptiveHeight(action.el);
		}
	},
	scrollTop: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollTop(action.el);
		}
	},
	scrollIntoView: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollIntoView(action.el);
		}
	},
	scrollDown: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.scrollDown(action.el);
		}
	},
	preserveScroll: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setElAttr(action.el, "tmp-preserveScroll-value", action.el.scrollHeight - action.el.scrollTop);
		}
	},
	restoreScroll: 
	{
		perform: function(action) 
		{
			var preservedScroll = AvoidJS.ui.DOM.getElAttr(action.el, "tmp-preserveScroll-value");
			
			if(preservedScroll !== undefined) 
			{
				AvoidJS.ui.DOM.setScrollTop(action.el, action.el.scrollHeight - preservedScroll);
				AvoidJS.ui.DOM.removeElAttr(action.el, "tmp-preserveScroll-value")
			}
		}
	},
	noScrollingPropagation: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.preventScrollPropagation(action.el);
		}
	},
	processForm: 
	{
		/**
		 * 
		 * @param {AvoidJS.Templater.Action} action
		 * @returns {undefined}
		 */
		perform: function(action) 
		{
			var formData = {};
			var form = new FormData(action.el);
			
			action.el.querySelectorAll("[name]").onEach(function(el) 
			{
				var name = AvoidJS.ui.DOM.getElAttr(el, "name");
				var value = AvoidJS.ui.DOM.getValue(el);
				
				if(!formData[name+"_array"]) {
					formData[name+"_array"] = [];
				}
		
				if(AvoidJS.ui.DOM.getElAttr(el, "type") === "checkbox") {
					if(el.checked) {
						formData[name] = "on";
						formData[name+"_array"].push(value); // 
					}
					else 
					{
						formData[name] = "off";
					}
				}
				else 
				{
					formData[name] = value;
					formData[name+"_array"].push(value); // 
				}
			});
			
			action.setData("formData", formData);
			action.setData("form", form);
			
			var isValid = true;
			
			AvoidJS.ui.DOM.getAllByAttribute(action.el, AvoidJS.conf.attrs.actions.formValidation).onEach(function(el) 
			{
				var func = AvoidJS.ui.DOM.getElAttr(el, AvoidJS.conf.attrs.actions.formValidation);
				
				var result = new AvoidJS.Templater.Temparser(null, action.getData(), null).evaluateExpression(func)(AvoidJS.ui.DOM.getValueTrimmed(el));
				
				if(!result.valid) 
				{
					isValid = false;
					PageDirector.showOperationError(result.message);
					return false;
				}
			});
			
			var whenValid = action.getProp("ifValid");
			
			if(isValid && whenValid) {
				AvoidJS.Templater.processActions(whenValid, action.el, action.getData(), action.parentEl);
			}
		}
	},
	
	fadeOut: 
	{
		perform: function(action) 
		{
			UIEffects.fadeOut(action.el);
		}
	},
	
	setStyle: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.setStyle(action.el, action.getProp("style"), action.getProp("value"));
		}
	},
	
	json2html: 
	{
		perform: function(action) 
		{
			AvoidJS.ui.DOM.json2html(action.el);
		}
	}
};