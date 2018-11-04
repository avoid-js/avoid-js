AvoidJS.Logger = 
{
	options: {
		info: false,
		error: true
	},
	info: function(str) 
	{
		if(this.options.info) {
			console.log(str);
		}
	},
	error: function(str) 
	{
		if(this.options.error) {
			console.log(str);
		}
	}
};