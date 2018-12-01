# [AvoidJS](https://avoid-js.github.io/avoid-js/) [![npm version](https://img.shields.io/npm/v/@avoid-js/avoid-js.svg?style=flat)](https://www.npmjs.com/package/@avoid-js/avoid-js)

AvoidJS is a simple experimental library the main purpose of which is too provide a tool and the code style that helps to **separate HTML and JS code completely**.

# Install 
Using npm:

```npm install @avoid-js/avoid-js ``` 

or download JS file from ```./build/plain/``` and use directly in HTML code: 

```<script type="java/script">avoid.js</script>```.



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
