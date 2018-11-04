Array.prototype.onEach = function(func, withResult) 
{
	var result;
	var left = this.length;

	for(var i = 0; i < this.length; i++, left--) 
	{
		var eachRes = func(this[i], i, left-1);

		if(false === eachRes) {
			break;
		}

		if(withResult) {
			result = withResult(eachRes, result);
		}
	}

	return result;
};

Array.prototype.remove = function(el) 
{
	var index = this.indexOf(el);
	if (index > -1) 
	{
		this.splice(index, 1);
	}
};

Array.prototype.removeConditional = function(func) 
{
	for(var i = 0; i < this.length; i++) 
	{
		if(func(this[i], i)) {
			this.splice(i, 1);
		}
	}
};

Array.prototype.condition = function(func) 
{
	for(var i = 0; i < this.length; i++) 
	{
		if(func(this[i], i)) {
			return true;
		}
	}
	
	return false;
};


Array.prototype.shuffle = function() 
{
	var i = this.length, j, temp;
	if (i == 0)
		return this;
	
	while (--i) 
	{
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	
	return this;
};

Array.prototype.trimEach = function() 
{
	return this.map(function(item) 
	{
		return item.trim();
	});
};