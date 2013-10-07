backbone-module
===============

A simple module system for backbone.js.Å@event process make reusable easiry.

##How To Use

1.link width "backbone set".

    <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/underscore.js" type="text/javascript"></script>
    <script src="js/backbone.js" type="text/javascript"></script>
    <script src="js/backbone.module.js" type="text/javascript"></script>

2.regist your cool module.

    Backbone.Module.regist('my.cool.module',//module name.
    {
    	events:{
		"click":"onClick"	
	},
	onClick:function(event,next){
		if(next){//super class method in last arg if exist.
			next.call(this,event);
		}
		window.alert('click');
	}
    
    })

3 extend your module.

    Backbone.Module.registWrap('my.cool.module.extend',
    'my.cool.module',//regited module name or object you want extend.
    {
    	events:{
		"mousemouseover":"onMouseover"	
	},
	onClick:function(event,next){
		
		next.call(this,event);//nest is my.cool.module.Onclick
		
		window.alert('extend!');
	},
	onMouseover:function(event,next){
		if(next){
			next.call(this,event);
		}
		window.alert('mouseover');
	
	}
    
    });

4.bind to backbone class and use.

    var view =Backbone.Module.extendView('my.cool.module.extend',
    					{
    						el:"#test",
    
    					});
    $(function(){
    	 new view();
    
    });


##TODO

 write test and modules.
