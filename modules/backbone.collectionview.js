//module for display collenction node.
//stab.

(function() {
	'use strict';
	
	Backbone.Module.regist('collectionview.parent',{
		auto_render:false,
		viewport:null,
		vecter:false,
		initialize:function(options){
			this.views = [];
			this.view_class = options.view_class || this.view_class;
			
			if(this.viewport){
				this.$viewport = this.$el.find(this.viewport);
			}
			else
			{
				this.$viewport = this.$el;
			}
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
				
				    
				my.renderValues(values,options);
				
				
				
				
			};
			if(this.template){
				callback.call(this);
			}
			else
			{
				this.loadTemplate(options,callback);
			}
		},
		loadTemplate:function(options,callback,next){
			options = options || {};
			var selecter = options.template_id || this.template_id;
			
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
				
				this.add(value,options);
			}
		},
		renderCollection:function(options,next){
			var my = this;
			this.collection.forEach(function(model){
				my.renderModel(model, options);
			});
			if(next){
				next.call(this);
				
			}
			
		},
		renderModel:function(model,options,next){
			if(next){
				next.call(this,opt);
				
			}
			options = _.extend({model:model},options || {});
			this.render([model.attributes],options);
			
		},
		add:function(value,options,next){
			
			if(next){
				next.call(this,value,options);
				
			}
			options = _.extend({template:this.template,value:value},options || {});
			
			var view = new this.view_class(options);
			this.addViewport(view,options.at);
			return view;
			
		},
		addViewport:function(view,at,next){
			if(next){
				
				next.call(this,view);
			}
			var $children = this.$viewport.children();
			if($children.length === 0){
				this.views.push(view);
				this.$viewport.append(view.$el);
			}
			else
			{
				if(_.isUndefined(at)){
					this.views.push(view);
					this.$viewport.append(view.$el);
					
				}
				else
				{
					if(at >= $children.length){
						
						this.views.push(view);
						this.$viewport.append(view.$el);
					}
					else
					{
						$children.eq(at).before(view.$el);
						this.views.splice(at, 0, view)
						
					}
				}
				
				
				
			}
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
	Backbone.Module.registWrap('collectionview.parent.subscribe',
		'collectionview.parent',
		{
			guard:true,
			now_at:null,
			initialize:function(options,next){
				if(_.isFunction(options)){
					next = options;
					options = {};
				}
				if(next){
					next.call(this,options);				
				}
				this.collection.bind('reset',_.bind(this.onReset,this));
				this.collection.bind('add',_.bind(this.onAdd,this));
				this.collection.bind('change',_.bind(this.onChange,this));
				this.collection.bind('remove',_.bind(this.onRemove,this));
			},
			onReset:function(collections,next){
				this.$viewport.empty();
			},
			onAdd:function(model, collection, options,next){
				
				
				if(next){
					next.call(this,options);
				}
				if(this.guard){
					
					if(_.isUndefined(options.at) === false && this.now_at === options.at){
						return;
					}
					this.now_at = options.at;
					
				}
				this.renderModel(model,options);
			},
			onChange:function(){

			
			},
			onRemove:function(model, options,next){
				_.reject(this.views,function(view){
							return view.model.cid === model.cid;
				})
				
			},
			
		}
	);
	Backbone.Module.registWrap('collectionview.node.subscribe',
		'collectionview.node',
		{
			initialize:function(options,next){
				next.call(this,options);				
				this.model.bind('destroy',_.bind(this.onDestroy,this));				
				this.model.bind('change',_.bind(this.onChange,this));
				
			},
			onDestroy:function(){
				this.$el.remove();
				this.$el = null;
			},
			onChange:function(){
				
			},
						
			
			
			
		}
	)
})();