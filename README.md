# avoid-js
[AvoidJS](https://avoid-js.github.io/avoid-js/) is a simple experimental library the main purpose of which is too provide a tool and the code style that helps to **separate HTML and JS code completely**.



# Overview
Actions and Events instead of interacting with UI from JavaScript.

So if regular JS code usually looks like this:
```javascript
if(myObject.doSomething()) {
	something.show(".success");
} else {
	something.show(".failed");
}
```

With AvoidJS it can be like this:
```javascript
if(myObject.doSomething()) {
	AvoidJS.Eventer.fire(AvoidJS.Events.MyComponent.success, {
		message: "We good."
	});
} else {
	AvoidJS.Eventer.fire(AvoidJS.Events.MyComponent.failed, {
		message: "That's not good."
	});
}
```

```html
<div class="success" 
     avj-action="hide, draw" 
     avj-draw-wait="event" 
     avj-draw-event-when="AvoidJS.Events.MyComponent.success" 
     avj-draw-content="this" 
     avj-draw-after="show">
	{{event.message}}
</div>
<div class="error" 
     avj-action="hide, draw" 
     avj-draw-wait="event" 
     avj-draw-event-when="AvoidJS.Events.MyComponent.failed" 
     avj-draw-content="this" 
     avj-draw-after="show">
	{{event.message}}
</div>
```

With this approach JS code can be 100% UI-agnostic and only be responsible for application logic, while HTML code becomes explicit and straightforward about UI dynamics. 

Read [documentation](https://avoid-js.github.io/avoid-js/) to learn more.
