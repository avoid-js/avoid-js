AvoidJS.conf = 
{
	version: "0.0",
	
	attrs: 
	{
		templater: {
			load: "avj-load-templates",
			template: "avj-template",
			action: "avj-action",
			digested: "avj-digested",

			preserveContent: "avj-preserve-content",
			contentPreserved: "avj-content-preserved"
		},
		macros: {
			def: "avj-macros", // "data-js"
			apply: function(macros) 
			{
				return "avj-apply-"+macros;
			},
			applied: function(key) {
				return "avj-"+key+"-applied";
			}
		},
		actions: {
			prop: function(actionName, propName) {
				return "avj-" + actionName.toLowerCase() + "-"+propName;
			},
			data: function(actionName) {
				return "avj-" + actionName.toLowerCase() + "-data-";
			},
			formValidation: "avj-form-validation" // data-js
		}
	}
};