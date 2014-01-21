(function() {
	'use strict';
	Backbone.Module.regist('modules.view.single',{
		display_area:"",
		initialize:function(){
			 if(this.display_area){
				 this.$display_area = this.$el(this.display_area);
			 }
			 else
			 {
				 this.$display_area = this.$el;
			 }
		},
		render:function(values,next){
			
			values = values || {};
			if(next){
				next.call(this,values);
			}
			if(!this.template){
				var template_selecter =  this.options.template_selecter || this.template_selecter;
				if(template_selecter){
					var template_text = $(template_selecter);
					
				}
				else
				{
					var template_text = this.options.template_text;
				}
				this.tempalte = _.template(template_text);
			}
			var $view  = this.$.parseHTML(this.tempalte(values));
			this.$display_area.append($view);
			this.setElement($view);
		}
		
	});
})();