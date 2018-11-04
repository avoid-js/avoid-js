AvoidJS.Templater.actions.drawHTML = Object.create(AvoidJS.Templater.actions.draw);

AvoidJS.Templater.actions.drawHTML.perform = function(action) 
{
	return this.__getContent(action);
};

AvoidJS.Templater.actions.drawHTML.__getContent = function(action) 
{
	var content = AvoidJS.Templater.actions.draw.__getContent(action);
	var lines = content.split("\n");
	lines.onEach(function(line, i) 
	{
		var tabsAmount = 0;
		var tabsMatches = line.match(/(\t)+</g);
		if(tabsMatches) { tabsAmount += tabsMatches.length; }
		
		var tagLength = 0;
		var tagMatch = line.match(/(<[\w-]+\s)/g);
		if(tagMatch) {
			tagLength = tagMatch[0].length;
		}
		
		var matches = line.match(/([\w-]+="[\w-=\.{} ,]+")+/g);
		
		if(matches && matches.length > 2) 
		{
			var skipFirst = true;
			lines[i] = line.replace(/([\w-]+="[\w-=\.{} ,]+")+/g, function(match) 
			{
				if(skipFirst) {
					skipFirst = false;
					return match;
				} else {
					return "\n" + " ".repeat(tagLength) + "\t".repeat(tabsAmount) + match;
				}
			});
		}
	});
	
	return lines.join("\n").escapeHTML();
};

AvoidJS.Templater.actions.highlightCode = 
{
	perform: function(action) 
	{
		hljs.highlightBlock(action.el);
	}
};