function findCategory(results,find_id){
	for(var i = 0; i < results.length; i++) {
		if (results[i].category_id==find_id) {
			//console.log(results[i].category_id);
			return results[i];
		}else{
			var subcat = results[i].subCollection;
			if(subcat!=null){
				for(var j = 0; j < subcat.length; j++) {
					if(subcat[j].category_id==find_id){
						//console.log(subcat[j].category_id);
						return subcat[j];
					}
				}
			}
		}
	}
}

function getParentCat(results,find_id){
	for(var i = 0; i < results.length; i++) {
		if (results[i].category_id==find_id) {
			//console.log(results[i].toSource());
			return results[i];
		}else{
			var subcat = results[i].subCollection;
			if(subcat!=null){
				for(var j = 0; j < subcat.length; j++) {
					if(subcat[j].category_id==find_id){
						//console.log(subcat[j].category_id);
						//console.log(results[i].toSource());
						return results[i];
					}
				}
			}
		}
	}
}

function getAutoSuggest(results){
	 var rval = [];
	 angular.forEach(results,function(obj){
		 rval.push({id:obj.category_id,title:obj.title});

		 var subcat = obj.subCollection;
			if(subcat!=null){
				  angular.forEach(subcat,function(subObj){
					rval.push({id:subObj.category_id,title:subObj.title,parent:obj.title,parent_id:obj.category_id});
				 });
			}
	 });

	return rval;

}

function getSelectedFilter(data,seletedArray,ftype){
	 angular.forEach(data,function(obj){
		 angular.forEach(seletedArray,function(id){
			if(ftype=='brands')if(obj.brand_id==id){ obj.selected = true; }
			if(ftype=='price')if(obj.pricefilter==id){ obj.selected = true; }
			if(ftype=='discount')if(obj.discountfilter==id){ obj.selected = true; }
		 });
	 });

	 return data;
}

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}
