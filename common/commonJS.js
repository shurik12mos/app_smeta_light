Object.prototype.processResult = function(response){	
	if (response==undefined) {
		alert ("Ответ сервера пустой. Ответ: " + response);
		return false;
	}
	if (response.length==0) return false;
	if (Array.isArray(response) || (({}.toString).call(response).slice(8, -1)=="Array")) {
		if (response[0]["result"] && response[0]["result"]==false) {
			alert(response[0]["message"]+ "Код ошибки: " + response[0]["error"]);
			return false;
		}else {
			return true;
		};
	}else if (typeof response === "object") {
		if (response.result===false) {
			alert(response.message + "Код ошибки: " + response.error);
			return false;
		}else {
			return true;
		}
	} else {
		alert ("Ответ сервера не является объектом или массивом. Ответ: " + response);
		return false;
	}
};

Object.prototype.copyObject = function (objectTo, objectFrom) {
	function copyArray(arr) {
		var result=[];		
		arr.forEach(function(item,i){
			if (Object.prototype.toString.call(item) === '[object Array]') {
				result[i] = copyArray(item);
			}else {
				result[i] = item;
			}			
		});		
		return result;
	}	
	
	if (arguments.length==1) {
		for (var prop in arguments[0]) {
			if (arguments[0].hasOwnProperty(prop)) {
				if (Object.prototype.toString.call(arguments[0][prop]) === '[object Array]'){					
					this[prop] = copyArray(arguments[0][prop]);
				} else {
					this[prop] = arguments[0][prop];
				}				
			}			
		}
	}
	if (typeof objectTo == "object" && objectFrom) {
		for (var prop in objectFrom) {
			if (objectFrom.hasOwnProperty(prop)) {
				objectTo[prop] = objectFrom[prop];
			}			
		}
	}
			
	return objectTo;
}
