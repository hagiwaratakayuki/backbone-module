(function() {
	'use strict';

	Backbone.Module.regist("hammerView.basic",{
		_hammerd:false,
		initialize:function(options,next){
			
			if(this._hammerd){
				return;
			}
			
			if(next){
				next.call(this,options);
			}
			if(this.$el){
				this._hammerOn();
			}
			
		},
	    _hammerOn:function(){
	    	if(this._hammerd){
	    		return;
	    	}
	    	this.$el.hammer();
	    	if(_.has(this,'$el') === true && _.isUndefined(this.$el.hammer) === false){
				this._hammerd = true;
				this.$el.hammer();
				
			}
	    },
	    _hammerOf:function(){
	    	this._hammerd = false;
	    	
	    }
	
	});
	
	
	
	Backbone.Module.registWrap('hammerView.dragable','hammerView.basic',{
		events:{
			'dragstart':"onDragStart",
			'drag':"onDrag",
		},
		onDragStart:function(event){
			var position = this.getPosition();
			this.start_left = position.left || 0;
			this.start_top = position.top || 0;		
			
		},
		onDrag:function(event){
			event.preventDefault();				

			var left = this.start_left + event.gesture.deltaX;
			var top =  this.start_top + event.gesture.deltaY;
			if (left >= 0 && top >= 0){
			
				this.$el.css({left:left.toString() + "px",top:top.toString() + "px"});
			}
			return {top:top,left:left};
		},
		getPosition:function(){
			var ret = {};
			
			ret.left = parseFloat(this.$el.css('left').replace("px",""));
			ret.top = parseFloat(this.$el.css('top').replace("px","")); 
			return ret;
			
		}
		
	});
	Backbone.Module.registWrap('hammerView.transFormable','hammerView.basic',{
		events:{
			"transform":"onTransform",
			"transformend":"onTransformEnd"
		},
	    rotation:0,
	    scale:1,
	    now_rotation:0,
	    now_scale:1,
	    pinch:true,
	    rotate:true,
	    onTransform:function(event){
	    	var gesture = event.gesture;
			
			var scale_str = 'scale(' + (this.scale * gesture.scale).toString() + ')';
			var rotation_str = 'rotate(' + (gesture.rotation + this.rotation).toString() + 'deg)';
			var transforms = [];
			if(this.pinch){
				transforms.push(scale_str);
			}
			if(this.rotate){
				
				transforms.push(rotation_str);
			}
			this.$el.css('transform',transforms.join(" "));
			this.now_rotate = gesture.rotation + rotation;
			this.now_scale = scale * gesture.scale;
	    },
	    onTransformEnd:function(event){
			this.scale = this.now_scale;
			this.rotation = this.now_rotate;
	    	
	    }
	    
		
	});
})();