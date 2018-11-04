AvoidJS.Remember = 
{
	my: {
		
	},
	
	defaults: {
		
	},
	
	typesSupport: {
		json: {
			to: function(val) {
				return JSON.stringify(val);
			},
			from: function(val, _default) {
				if(val) {
					try {
						return JSON.parse(val);
					} catch(e) {
						
					}
				}
				
				return _default;
			}
		}
	},
	
	types: {
		userChatsFilter: "json"
	},
	
	please: function(key, val) 
	{
		if(this.types[key]) {
			val = this.typesSupport[this.types[key]].to(val);
		}
		AvoidJS.Storage.save(key, val);
	},
	
	that: function(key, _default) 
	{
		var result = AvoidJS.Storage.get(key);
		if(result === "undefined" || result === undefined || result === null) {
			result = AvoidJS.$.OR(_default, AvoidJS.Remember.defaults[key]);
			
			AvoidJS.Remember.please(key, result);
		}
		else 
		{
			if(this.types[key]) {
				result = this.typesSupport[this.types[key]].from(result, _default);
			}
		}
		
		return result;
	},
	
	forget: function(key) 
	{
		AvoidJS.Storage.remove(key);
	}
};