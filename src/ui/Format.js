AvoidJS.ui.Format = new function() 
{
	this.nl2br = function(str) 
	{
		return str.replace(/\n/g, '<br/>');
	};
	
	this.OX = function(num) 
	{
		return (num < 10) ? "0" + num : num;
	};
	
	this.escapeHtml = function(str)
	{
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return str.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	};
};