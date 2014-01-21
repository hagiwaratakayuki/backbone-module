(function() {
	'use strict';
	var module = Backbone.Module = {};
	module.namespaces = {};	
	var wrapTail = function(func, wrapper) {
	    var arg_count =  wrapper.length -1;
	    return function() {
	      var args = Array.prototype.slice.call(arguments);
	      if(args.length < arg_count){
	    	  for ( var i = 0; i < arg_count - args.length ; i++) {
	    		  args.push(undefined);
			  }  	  
	      }
	      args.push(func);
	      return wrapper.apply(this, args);
	    };
	};
	module.wrap = function() {//_.extend event, rout,fixedparam, wrapTail function
		var ret = this._getResult();
		for ( var i = 0; i < arguments.length; i++) {
			var argument = arguments[i];
			var mod = this.getModule(argument);
			for ( var name in mod) {
				var prop = mod[name];
				if (this._extendable(prop) && (_.isUndefined(ret[name]) === true || this._extendable(ret[name]))) {
					
					ret[name] = _.extend(ret[name] || {},prop);
									
				}
				else
				{
					if(_.isUndefined(ret,name) !== true){
						if(typeof ret[name] === 'function'){
							ret[name] = wrapTail(ret[name],prop);
						}
						else
						{
							ret[name] = prop;
						}
					}
					else
					{
						ret[name] = prop;
					}
										
				}
			}
			
		}
		return ret;
	};
	module._extendable = function(prop) {
		return _.isObject(prop) === true &&_.isFunction(prop) === false &&_.isArray(prop) === false;
	}
	//extend Backbone basic class
	module.extendView = function() {
		var modules = Array.prototype.slice.call(arguments);
		return this.extendTo(Backbone.View, modules);		
	};
	
	module.extendModel = function() {
		var modules = Array.prototype.slice.call(arguments);
		return this.extendTo(Backbone.Model, modules);
		
	};
	module.extendCollection = function() {
		
		var modules = Array.prototype.slice.call(arguments);
		return this.extendTo(Backbone.Collection, modules);
		
	};
	module.extendRouter = function(){
		
		var modules = Array.prototype.slice.call(arguments);
		return this.extendTo(Backbone.Model, modules);
	};
	
	module.extendTo = function(target,modules) {
		if(_.isArray(modules) === false){
			 
			modules = Array.prototype.slice.call(arguments);
			modules.shift();
		}
	
		var ex = this.wrap.apply(this, modules);
		return target.extend(ex);
	}
	
	
	//regist module
	module.regist = function(namespace,mod){//regist module
		
		this._registNameSpace(namespace, mod);
		return mod;		
	};
	module.registWrap = function(namespace) {//regist with extend
		var args = Array.prototype.slice.call(arguments,1);
		var mod = this.wrap.apply(this, args);
		this._registNameSpace(namespace, mod);
		return mod;
	};
	module._registNameSpace = function(namespace,mod){
		
		var names = namespace.split(".");
		var regist_name = names.pop();
		var target = module.namespaces;
		
		for ( var i = 0; i < names.length; i++) {
			var name = names[i];
			if(_.has(target,name) === false){
				
				target[name] = {};
				
			}
			
			target = target[name];
			
		}
		target[regist_name] = mod;
	};
	
	module.getModule =function(param){
		if(_.isString(param) === false){
		
			return param;
		}
		else
		{
			var names = param.split(".");
			var ret = module.namespaces;
			
			for ( var i = 0; i < names.length; i++) {
				var name = names[i];
				if(_.has(ret,name) === false){
					
					ret[name] = {};
					
				}
				
				ret = ret[name];
				
			}
			return ret;
		}
		
	};
	module._getResult = function() {
		return _.extend({},this);
	};
})();