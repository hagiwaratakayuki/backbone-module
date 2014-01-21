(function(){
	'use strict';
	Backbone.Module.regist('form.value',
			{
				initialize:function(options,next){
					if(_.isFunction(options)){
						next = options;
						options = {};
					}
					if(next){
						next.call(this,options);
					}
					
					if(options.values){
						this.setValues(values);
					}
					else if(this.model){
						this.seValues(this.model.attributes);
					}
				
				},
				setValues:function(values){
					var val = _.clone(values);
					$this.$el.find(':text :select :hidden').each(function(){
						var $target = $(this);
						var name = $target.attr('name');
						if(!val[name]){
							return;
						}
							
						$target.val(val[name]);
						delete val[name];
							
					});
					for ( var name in val) {
						var selceter = "[name='" + name + "']";
						var $target = this.$el.find(selceter);
						if($target.eq(':radio')){
							$target.val(val[name]);
						}
						if($target.eq(':checkbox')){
							var checker = val[name];
							var is_array = _.isArray(checker);
							$target.each(function(){
								var $t = $(this);
								var cheked = (is_array && checker.indexOf($t.val()) !== -1) || (is_array === false && $t.val() == checker);
								$t.prop('checked',checked);																
																				
							});
																	
						}
												
					}								
				}				
			});

})();