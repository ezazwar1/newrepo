angular.module('welzen').factory('MeditationOfflineService', meditationService);

function meditationService($q, fileUtils, $rootScope){

	var meditations = [];
	var categories = [];

	var meditationService = {
		init : init,
		updateFrom: updateFrom,
		getAllCategories : getAllCategories,
		getMeditations : getMeditations,
		getMeditation : getMeditation,
		getAllMediasByProduct : getAllMediasByProduct,
		getAllMediasByProductAndCategory : getAllMediasByProductAndCategory
	};

	return meditationService;


	function init(){
		var deferred = $q.defer();
		if (meditations.length > 0) {
			deferred.resolve(meditations);
		} else {
			fileUtils.readFile("meditationdata","meditations.json").then(function(data){
				updateFrom(data);
				deferred.resolve(meditations);
			});
		}
		return deferred.promise;
	}


	function updateFrom(jsonData) {
		console.log('Welzen.updateFrom : cargando meditations');
		//limpio la lista asi no duplica
		meditations = [];
		if (jsonData.meditations){
			for (var i = 0; i < jsonData.meditations.length; i++) {
				var meditation = jsonData.meditations[i];
				meditations.push((new Meditation()).from(meditation));
			}
		}
		console.log('Welzen.updateFrom : cargando meditations finalizado');
		console.log('updating categories');
		updateCategories();
		sortCategories();
		$rootScope.$broadcast('categories_updated', categories);
		console.log('finish updating categories');
	}

	function updateCategories(){
		//limpio la lista asi no duplica
		categories = []; 
		for (var i = 0; i < meditations.length; i++) {
			var meditation = meditations[i];
			if (meditation.hasCategory() && (!hasAddedCategory(categories,meditation.category)) ){
				categories.push(meditation.category);
			}
		}
	}

	function sortCategories(){
		categories.sort(function(a, b) {
			if(a.order !== undefined && a.order !== null && b.order !== undefined && b.order !== null){
				return a.order - b.order;
			}
			return 1;
		});
	}	

	function getAllCategories(){
		return categories;
	}

	function hasAddedCategory(categories, category){
		for (var i = 0; i < categories.length; i++) {
			var c = categories[i];
			if (category.name === c.name){
				return true;
			}
		}
		return false;
	}

	function getMeditations(productName, category){
		var meds = [];
		for (var i = 0; i < meditations.length; i++) {
			var meditation = meditations[i];
			if ((meditation.product === productName) && (meditation.category.name === category.name)){
				meds.push(meditation);
			}
		}
		return meds;
	}

	function getMeditation(productName){
		for (var i = 0; i < meditations.length; i++) {
			var meditation = meditations[i];
			if ((meditation.product === productName)){
				return meditation;
			}
		}
		return null;
	}

	function getAllMediasByProduct(productName){
		var all = [];
		for (var i = 0; i < meditations.length; i++) {
			var meditation = meditations[i];
			if (meditation.product === productName){
				all = all.concat(meditation.medias);
			}
		}
		if('MindfulnessCoaching'===productName){
			all.sort(function(a, b) {
				//logica media extraña, pero Free viene antes que Premium en el diccionario
				if(a.membrecy < b.membrecy) return -1;
				if(a.membrecy > b.membrecy) return 1;
				return 0;
			});
		}
		return all;
	}

	function getAllMediasByProductAndCategory(productName, category){
		var meds = getMeditations(productName,category);
		var all = [];
		for (var i = 0; i < meds.length; i++) {
			var meditation = meds[i];
			all = all.concat(meditation.medias);
		}
		return all;
	}


	

}