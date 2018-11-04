AvoidJS.$.OR = function OR(a, b) 
{
	return (a !== null && a !== undefined) ? a : b;
};

AvoidJS.$.getBool = function(val)
{
	if(val === undefined || val === null) 
		return false;
	
	if(val === true || val === false)
		return val;
	
	switch (val.toString().toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
		case "on":
			return true;

		case "false":
		case "no":
		case "0":
		case null:
			return false;

		default:
			return Boolean(val);
	}
};