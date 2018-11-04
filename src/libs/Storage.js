AvoidJS.Storage = 
{
	types: {},
	storage: null,
	
	init: function(storage) 
	{
		this.storage = storage;
	},
	save: function(key, value) 
	{
		this.storage.save(key, value); 
	},
	get: function(key) 
	{
		return this.storage.get(key); 
	},
	remove: function(key) 
	{
		this.storage.remove(key); 
	}
};