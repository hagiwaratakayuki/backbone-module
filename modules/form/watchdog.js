(function(){
	'use strict';
	Backbone.Module.regist('form.watchdog',
	{
		events:{
			"change select,:radio":"onChange",
			"change :checkbox":"onCheckChange",
		},
		model_class:null,
		direct_mode:false,
		initialize:function(options,next){
			if(_.isFunction(options)){
				next = options;
				options = {};
			}
			if(next){
				next.call(this);				
			}
			
					
			this.value = {};
			if(this.$el){
				this.startWatch();
			}
		},
		startWatch:function(next){
			if(next){
				next.call(this);
			}
			if(this.iid){
				 clearInterval(this.iid);
			}
			if(!this.$texts){
				this.$texts = this.$el.find(":text");
			}
			this.iid = setInterval(_.bind(this.checkText,this),100);
		},
		checkText:function(next){
			if(next){
				next.call(this);
			}
			var my = this;
			this.$texts.each(function(i){
				var $this = $(this);
				var name = $this.attr('name');
				var text = $this.val();
				if(my.checkTextChange(name,text)){
					my.onTextChange(name,text);
				}
				
			});
			
		},
		checkTextChange:function(name,text){
			if(_.isUndefined(this.value[name]) === true ){
				this.value[name] = text;
				return false;
			}
			
			return  this.value[name] !== text;
					
		},		
		onTextChange:function(name,text,next){
			if(next){
				next.call(this);
			}
			this.setValue(name,text,false);
		},
		onChange:function(event,next){
			if(next){
				next.call(this);
			}
			var $target = $(event.target);
			var name = $taget.attr('name');
			var value = $target.val();
			this.setValue(name,value)	
			
			
		},
		onCheckChange:function(evet,next){
			if(next){
				next.call(this);
			}
			var $target = $(event.target);
			var name = $taget.attr('name');
			if($target.prop()){
				this.setValue(name,value,$target.data('multiple'));
			}
			else
			{
				this.removeValue(name,value,$target.data('multiple'));
			}
		},
		setValue:function(name,value,multiple){
			if(multiple){
				if(this.direct_mode){
					this.model.get(name) || [];
				}
				else
				{
					var val = this.value[name] || [];
				}
				val.push(value);
				this.value[name] = val;
			}
			else
			{
				this.value[name] = value;
			}
			
		},
		removeValue:function(name,value,multiple){
			if(multiple){
				if(this.direct_mode){
					this.model.get(name) || [];
				}
				else
				{
					var val = this.value[name] || [];
				}
				val = _.reject(val,	function(v){ return v === value;});
				if(val.length === 0){
					if(this.direct_mode){
						this.model.unset(name);
					}
					else
					{
						delete this.value[name];
					}
				}
			}
			else
			{
				
				if(this.direct_mode){
					this.model.unset(name);
				}
				else
				{
					delete this.value[name];
				}
			}
			
		}
	});
	

	
})();