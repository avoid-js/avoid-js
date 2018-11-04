Object.prototype.toArray = function() 
{
	var arr = [];
	
	this.onEach(function(val, key) 
	{
		arr.push({
			key: key,
			value: val
		});
	});
	
	return arr;
};

Object.prototype.onEach = function(func, withResult) 
{
	var result;
	var i = 0;

	for (var key in this) 
	{
		if (this.hasOwnProperty(key)) 
		{
			var eachRes = func(this[key], key, i);

			if(false === eachRes) {
				break;
			}

			if(withResult) {
				result = withResult(eachRes, result);
			}

			i++;
		}
	}

	return result;
}; 

Object.prototype.clone = function() 
{
	return JSON.parse(JSON.stringify(this));
};

Object.prototype.copy = function(source) 
{
	source.onEach(function(val, key) {
		this[key] = val;
	});
};

Object.prototype.merge = function(obj2) 
{
	var obj3 = {};
	for (var attrname in this) {
		obj3[attrname] = this[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
};