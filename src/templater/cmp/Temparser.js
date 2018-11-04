AvoidJS.Templater.Temparser = function(content, data, name) 
{
	var _this = this;
	this.content = content;
	this.name = name;
	this.data = data;
	
	this.format = function() 
	{
		return this.content.replace(new RegExp("{{(.[^{{]+)}}", "g"), function(match, matchInner) 
		{
			var value = _this.evaluate(matchInner, match);

			return AvoidJS.$.OR(value, "");
		}).trim();
	};
	
	this.evaluate = function(expression, _default) 
	{
		var value = null;
		
		var conditionParts = expression.split("?").trimEach();
		
		// if condition
		if(conditionParts.length > 1) 
		{
			var condition = conditionParts[0];
			
			var whenTrue = conditionParts[1];
			var whenFalse = null;
			
			// if "else" is presented
			var outcomes = conditionParts[1].split(":").trimEach();
			
			if(outcomes.length > 1) 
			{
				whenTrue = outcomes[0];
				whenFalse = outcomes[1];
			}
			
			if(_this.evaluateCondition(condition)) 
			{	
				if(whenTrue) {
					value = _this.evaluate(whenTrue);
				}	
			}
			else 
			{
				if(whenFalse) {
					value = _this.evaluate(whenFalse);
				}	
			}
			
		}
		else 
		{
			// no condition, jsut an expression
			value = _this.evaluateCondition(conditionParts[0], _default);
		}
		
		return value;
	};
	
	this.evaluateCondition = function(expression) 
	{
		var result = false;
		
		var ands = expression.split(/\sand\s/).trimEach();
		var ors = expression.split(/\sor\s/).trimEach();
		
		if(ands.length > 1) 
		{
			for(var i = 0; i < ands.length; i++) 
			{
				if(_this.evaluateCondition(ands[i])) 
				{
					result = true;
				} else {
					result = false;
					break;
				}
			}
		} 
		else if(ors.length > 1) 
		{	
			var ors = expression.split(" or ").trimEach();
			
			for(var i = 0; i < ors.length; i++) 
			{
				if(_this.evaluateCondition(ors[i])) 
				{
					result = true;
					break;
				}
			}
		}
		else 
		{
			if(expression.match(/^[\"'].*[\"']$/g) === null) 
			{
				// checking if it's entry like 'a == b'
				// not the best approach
				var availableCompars = []; 
				AvoidJS.Templater.Temparser.comparisons._map.onEach(function(val, key) {
					availableCompars.push(val);
				});
				
				var matches = expression.match("(.+)("+availableCompars.join("|")+")(.+)");
					
				if(matches) 
				{
					matches = matches.trimEach();
					var val1 = _this.evaluateExpression(matches[1]);
					var val2 = _this.evaluateExpression(matches[3]);

					var compareFunc = AvoidJS.Templater.Temparser.comparisons._find(matches[2]);

					if(compareFunc) 
					{
						result = AvoidJS.Templater.Temparser.comparisons[compareFunc](val1, val2);
					}
					else 
					{
						AvoidJS.Logger.error("Tempater.comparison: ["+matches[1]+"] not found.");
					}
				}
				else 
				{
					result = _this.evaluateExpression(expression, false);
				}
				
			} else {
				result = expression.replace(/^[\"']|[\"']$/g, '');
			}
		}
		
		return result;
		
	};
	
	this.evaluateExpression = function(expression, _default) 
	{
		var value = _default;
		
		var executive = expression.match(/(.[^(]+)\(?/);
		var arguments = expression.match(/[(](.*)[)]/);

		if(executive && executive.length > 0) 
		{
			if(arguments && arguments.length > 0) 
			{
				var func = _this.parseDataExpression(executive[1], undefined);
				var funcArguments = _this.parseExpressionArguments(arguments[1]);

				if(func.value !== undefined) 
				{
					value = func.value.apply(func.obj, funcArguments);
				}
			}
			else 
			{
				value = _this.parseValue(executive[1], _default);
			}
		}
		else 
		{
			value = _this.parseValue(expression, _default);
		}
		
		return value;
	};
	
	this.parseDataExpression = function(expression, _default) 
	{
		var result = {
			obj: null,
			value: _default
		};
		
		if(expression) 
		{
			var tempData = _this.data;
			var keysPath = expression.split(".").trimEach();
		
			keysPath.onEach(function(key, i) 
			{
				if(tempData !== null 
				&& tempData !== undefined 
				&& tempData[key] !== undefined) 
				{
					result.obj = tempData;
					result.value = tempData = tempData[key];
				}
				else if (i == 0 && window[key] !== undefined) 
				{
					result.obj = window;
					result.value = tempData = window[key];
				}
				else 
				{
					AvoidJS.Logger.error("AvoidJS.Templater.Temparser: ["+_this.name+"] Cannot find data for [" + expression + "]");

					AvoidJS.Logger.error("== Defails ==");
					AvoidJS.Logger.error("Data Available: ");
					AvoidJS.Logger.error(_this.data);
					AvoidJS.Logger.error("Content: ");
					AvoidJS.Logger.error(_this.content);
					AvoidJS.Logger.error("== End ==");
					result.value = _default;
				}
			});
		}
		
		return result;
	};
	
	this.parseExpressionArguments = function(expression) 
	{
		var retArgs = [];
		
		if(expression) 
		{
			var args = expression.split(",");
			
			args.onEach(function(item) 
			{
				retArgs.push(_this.parseValue(item));
			});
		}
		
		return retArgs;
	};
	
	this.parseValue = function(expression, _default) 
	{
		var value = _default;
		
		if(expression) 
		{
			expression = expression.trim().replace(/&quot;/g, '\"');
			if(expression.match(/^[\"']|[\"']$/g) !== null) 
			{
				value = expression.replace(/^[\"']|[\"']$/g, '');
			}
			else if(expression.isNumeric()) 
			{
				value = expression;
			}
			else 
			{
				switch (expression) 
				{
					case "true":
						value = true;
						break;

					case "false":
						value = false;
						break;

					case "this":
						value = _this.data;
						break;

					case "null":
						value = null;
						break;

					default:
						value = _this.parseDataExpression(expression, _default).value;
				}
			}
		}
		
		return value;
	}
	
	return this;
};

AvoidJS.Templater.Temparser.comparisons = 
{
	_find: function(cmp) 
	{
		for(var itm in this._map) {
			if(cmp == this._map[itm]) {
				return itm;
			}
		}
	},
	_map: {
		notEqq: "!==",
		notEq: "!=",
		eqq: "===",
		eq: "==",
		moreOrEq: ">=",
		more: ">",
		lessOrEq: "<=",
		less: "<"
	},
	eq: function(a, b) 
	{
		return a == b;
	},
	eqq: function(a, b) 
	{
		return a === b;
	},
	notEq: function(a, b) 
	{
		return a != b;
	},
	notEqq: function(a, b) 
	{
		return a !== b;
	},
	more: function(a, b) 
	{
		return (parseFloat(a) > parseFloat(b));
	},
	moreOrEq: function(a, b) 
	{
		return (parseFloat(a) >= parseFloat(b));
	},
	less: function(a, b) 
	{
		return (parseFloat(a) < parseFloat(b));;
	},
	lessOrEq: function(a, b) 
	{
		return (parseFloat(a) <= parseFloat(b));;
	}
};