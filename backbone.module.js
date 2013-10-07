(function() {
	'use strict';
	var module = Backbone.Module = {};
	module.namespaces = {};	
	var wrapTail = function(func, wrapper) {
	    return function() {
	      var args = Array.prototype.slice.call(arguments);;
	      args.push(func);
	      return wrapper.apply(this, args);
	    };
	};
	module.wrap = function() {//イベントと固定パラメーターをextend、それ以外をwrapTail
		var ret = this._getResult();
		var events = {};		
		for ( var i = 0; i < arguments.length; i++) {
			var argument = arguments[i];
			var mod = this._getModule(argument);
			for ( var name in mod) {
				var prop = mod[name];
				if (name === 'events' ) {
					
					events = _.extend(events,prop);
									
				}
				else
				{
					if(_.has(ret,name)){
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
		ret.events = events;
		return ret;
	};
	
	//extend Backbone basic class
	module.extendView = function() {
		var args = Array.prototype.slice.call(arguments);
		var ex = this.wrap.apply(this, args);
		return Backbone.View.extend(ex);		
	};
	
	module.extendModel = function() {
		var args = Array.prototype.slice.call(arguments);
		var ex = this.wrap.apply(this, args);
		return Backbone.Model.extend(ex);
		
	};
	module.extendCollection = function() {
		var args = Array.prototype.slice.call(arguments);
		var ex = this.wrap.apply(this, args);
		return Backbone.Collection.extend(ex);
		
	};
	
	//regist module
	module.regist = function(namespace,mod){//モジュールを登録
		
		this._registNameSpace(namespace, mod);
				
	};
	module.registWrap = function(namespace) {//複数のモジュールを継承して登録
		var args = Array.prototype.slice.call(arguments,1);
		var mod = this.wrap.apply(this, args);
		this._registNameSpace(namespace, mod);
	};
	module._registNameSpace = function(namespace,mod){//登録処理
		
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
	}
	
	module._getModule =function(param){
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