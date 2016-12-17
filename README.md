# 观察者模式事件中心


## API

```javascript
	require(['./eventEmitter.js'],function(Emit){
	    var emiter = new Emit();
	    emiter.on("newclick",function(e){
		console.log('click1',e);
	    });
	    emiter.on("newclick",function(e){
		console.log('click2',e);
	    });

	    emiter.one("hello",function(){
		console.log("i only excute once");
	    });

	    emiter.trigger("newclick");
	    emiter.trigger("newclick",{name:"alan"});
	    emiter.trigger("hello");
	    emiter.trigger("hello");
	})

```
