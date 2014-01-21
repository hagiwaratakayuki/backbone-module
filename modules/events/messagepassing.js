(function(){
	'use strict';
	var evs_class = function(){};
	_.extend(evs_class.prototype,Backbone.Events);
	var events = {};

	Backbone.Module.regist('events.messagepassing',
			{
				initialize:function(options,next){
					if(next){
						next.call(this,options);
					}
					
					var message_namespaces = this.message_namespaces;
					if(_.isArray(message_namespaces) === false){
						message_namespaces = [message_namespaces];
					}
					this.messages = {};
					for ( var i = 0; i < message_namespaces.length; i++) {
						var namespace = message_namespaces[i];
						if(_.has(this.messages,namespace)){
							continue;
						}
						this.messages[namespace] = this._getMessageMediator(namespace)
					}
				},
				_getMessageMediator:function(namespace){
					if(_.has(events,namespace) === false){
						events[namespace] = new evs_class();
					}
					return events[namespace];
				}
			})
})();