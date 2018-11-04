if(!document.contains) 
{
	document.contains = function(el) 
	{
		while(el.parentNode)
			el = el.parentNode;
		
		return el === document;
	}
}