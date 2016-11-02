

(function() {
    'use strict';

    class AlgoliaProduct {
        constructor(algoliaHit) {
            this.id = algoliaHit.product_id;
            this.name = algoliaHit.name;
            this.brand_name = algoliaHit.brand_name;
            this.upc = algoliaHit.upc;
            this.description = algoliaHit.description;
            this.placement = algoliaHit.placement;
            this.images = [algoliaHit.image];
            this.bogo = algoliaHit.bogo;
            this.categories = algoliaHit.categories;
            this.unit_of_measure = algoliaHit.unit_of_measure;
            this.unit_weight = algoliaHit.unit_weight;
            this.product_type = algoliaHit.product_type;
            this.size = algoliaHit.size;
            this.on_sale = algoliaHit.on_sale;
            this.price = algoliaHit.price;
            this.sale_price = algoliaHit.sale_price;
            this.description_label = algoliaHit.description_label;
            this.bullet_points = algoliaHit.bullet_points;
            this.has_custom_label = algoliaHit.has_custom_label;
        }
    }

    angular
        .module('app.shipt.search')
        .service('AlgoliaProductProvider', AlgoliaProductProvider);

    function AlgoliaProductProvider(){
        this.getNew = function(algoliaHit){
            return new AlgoliaProduct(algoliaHit);
        }
    }

})();
