(function() {
	'use strict';
	
	Backbone.Module.regist('collectionview.parent',{
		auto_render:false,
		initialize:function(options){
			this.views = [];
			this.view_class = options.view_class || this.view_class;
			if(this.auto_render){
				this.render(options.values,options);
			}

		},
		render:function(values,options,next){
			if(next){
				next.call(this,values);
			}
			var my = this;
			var callback = function(){
				if(my.collection){
					my.renderCollection(options);
				}
				else{
				    
					my.renderValues(values,options);
				
				}
				/*if(my.autobind && my.collection){
					my.collection.on({
						
						
					});					
				}*/
				
			};
			this.loadTemplate(options,callback);
		},
		loadTemplate:function(options,callback,next){
			options = options || {};
			var selecter = options.template_id || this.template_id;
			var test = $(selecter).html()
			this.template = _.template($(selecter).html());		
			
			if(next){
				next.call(this,options,callback);
				
			}
			else
			{
				callback.call(this);
			}
		},		
		renderValues:function(values,options,next){
			if(next){
				ret = next.call(this,options,next);
			}
			for ( var i = 0; i < values.length; i++) {
				var value = values[i];
				
				this.append(value,options);
			}
		},
		renderCollection:function(options,next){
			
			this.collection.forEach(this.renderModel,this);
			if(next){
				next.call(this);
				
			}
			
		},
		renderModel:function(model,options,next){
			if(next){
				next.call(this);
				
			}
			var value = model.properties;
			this.append(value);
			
		},
		append:function(value,options,next){
			
			options = options || {};
			if(next){
				next.call(this,value,options);
				
			}
			options = _.extend({template:this.template,value:value},options);
			var view = new this.view_class(options);
			this.appendViewport(view);
			return view;
			
		},
		appendViewport:function(view,next){
			if(next){
				
				next.call(this,view);
			}
			this.views.push(view);
			this.$el.append(view.$el);
		}		
	});
	
	Backbone.Module.regist('collectionview.node',{
		require_style:false,
		initialize:function(options,next){
			if(next){
				next.call(this,options);
				
			}
			this.template = options.template;
			if(options.value){
				this.render(options.value);
			}
		},
		render:function(value,next){
			if(next){
			
				next.call(this,value);
			}
			if($.parseHTML){
				var elements = $.parseHTML(this.template(value));
				if(this.require_style){
					var els = [];
					for ( var i = 0; i < elements.length; i++) {
						var element = elements[i];
						if(_.isUndefined(element.style) === false){
							els.push(element);
						}
					}
					elements = $(els);
				}
				
				this.setElement(elements);
				
			}
			
			return this;
			
		}
	
	});
	
})();