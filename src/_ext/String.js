String.prototype.replaceAll = function(search, replacement) 
{
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.splitTrim = function(by) 
{
	return this.split(by).trim();
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.escapeRegExp = function () 
{
	// Escape special characters for use in a regular expression
	return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.escapeHTML = function () 
{
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return this.replace(/[&<>"']/g, function (m) {
		return map[m];
	});
};

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

String.prototype.trimChar = function (charToTrim) 
{
	charToTrim = AvoidJS.$.OR(charToTrim, " ");
	
	var escapedStr = this.escapeRegExp();
	var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
	return escapedStr.replace(regEx, "");
};

String.prototype.isNumeric = function () 
{
	return parseFloat(this) == this;
};

/**
 * 
 * https://stackoverflow.com/questions/202605/repeat-string-javascript
 * 
 * @param {type} num
 * @returns {String}
 */
if(!String.prototype.repeat) 
{
	String.prototype.repeat = function(num)
	{
		return new Array(num + 1).join(this);
	};
}