angular.module('models', [])
.factory('$model', function(GENERAL_CONS, $helper) {
  var init = {
    Article: function(articleobj, showcategory){
      this.articleId = articleobj._id.$oid;
      this.articleMerchantName = articleobj.merchantname;
      this.articleHeadline = articleobj.headline;
      this.articleStatus = articleobj.status;
      this.articleCreatedBy = articleobj.createdby;
      this.articleType = articleobj.articletype;
      this.articleSlug = articleobj.slug;

      if(showcategory != undefined && showcategory != null){
        this.showCategory = showcategory;
      }else{
        this.showCategory = true;
      }

      if(articleobj.articletype == 3){
        this.hideArticle = true;
      }else{
        this.hideArticle = false;
      }
      
      this.articleTimeSpan = $helper.getLifeTime(articleobj.createddate);

      var order = new Date(articleobj.createddate);
      this.articleCreatedDate = order.getTime();

      var categories = [];
      for(var i = 0; i < articleobj.categories.length; i++){
        if(i == (articleobj.categories.length - 1)){
          var cat = new init.ArticleCategories(articleobj.categories[i], false);
          categories.push(cat);
        }else{
          var cat = new init.ArticleCategories(articleobj.categories[i], true);
          categories.push(cat);
        }
        
      }

      var category = "category";
      if(categories.length > 0){
        category = categories[0].category
      }
      var mainPath = GENERAL_CONS.MAINLINK + category + "/" + articleobj.slug;
      this.articleLink = mainPath;

      this.articleCategories = categories;
      this.articleFeaturedImage = articleobj.featuredimage.medium;
      this.articlePH = GENERAL_CONS.ARTICLEPH;
      this.artileIsContest = articleobj.iscontest;

      //check promotion here:
      var campaigntext = "";
      var isdisplaypromo = false;
      var promoexpiredate = 1447642827101;
      var currenttime = (new Date()).getTime();
      if(articleobj.promotion != undefined){
          campaigntext = articleobj.promotion.promotext;
          isdisplaypromo = true;
          promoexpiredate = articleobj.promotion.expiredate;
      }

      if(currenttime < promoexpiredate){
        this.promoExpiration = "Promo valid till " + moment(promoexpiredate).format('YYYY/MM/DD');
      }else{
        this.promoExpiration = "This promotion has expired";
        isdisplaypromo = false;
      }

      this.isDisplayPromo = isdisplaypromo;
      this.articlePromoText = campaigntext;
      this.promoExpireDate = promoexpiredate;

      this.articleSummary = articleobj.contents.summary;
      this.articleContent = "";
      this.articleAboutSponsor = articleobj.contents.aboutsponsor;
      this.articleDirectPromoText = articleobj.contents.directpromotext;
    },

    ArticleCategories: function(cat, isdisplaydivider) {
      this.category = cat;
      this.displayDivider = isdisplaydivider;
    },

    Item: function(itemobj, issavedmedia) {
      this.itemId = itemobj._id.$oid;
      this.itemImagePH = GENERAL_CONS.IMGPHPATH;
      this.itemUserId = itemobj.itemuser.userid.$oid;
      this.itemImage = itemobj.picture.fullurl;
      this.itemStatus = itemobj.status;
      this.itemDescription = itemobj.description;
      this.itemTitle = itemobj.title;

      var articleid = "";
      if(itemobj.articleid != undefined){
        articleid = itemobj.articleid.$oid;
      }
      this.itemArticleId = articleid;
      this.itemRank = itemobj.rank;

      var saved = [];
      if(itemobj.saved != undefined){
        saved = itemobj.saved;
      }

      this.itemSavedCount = saved.length;
      this.itemIsSaved = itemobj.issaved;
      this.isProduct = itemobj.isproduct;

      if(issavedmedia){
        this.isSavedItem = true;
      }else{
        this.isSavedItem = false;
      }

      var order = new Date(itemobj.createddate);
      this.itemCreatedDate = order.getTime();

      if(saved.length > 0){
        this.isShowSaved = true;
      }else{
        this.isShowSaved = false;
      }

      var similars = [];
      var singleproduct = null;
      var counter = 1;
      var mediaId = "";
      var isdisplaymore = false;
      var similarproducts = itemobj.similarproducts

      if(itemobj.isproduct){
        if(similarproducts != undefined && similarproducts.length > 0){
          var merchantname = "";
          if(similarproducts[0].merchantname != undefined && similarproducts[0].merchantname != "" && similarproducts[0].merchantname != null){
            merchantname = similarproducts[0].merchantname;
          }
          var product = new init.SingleProduct(similarproducts[0].productid.$oid, similarproducts[0].name, similarproducts[0].basecurrency, similarproducts[0].price, similarproducts[0].promoprice, similarproducts[0].affiliatelink, merchantname);
          singleproduct = product;
        }
      }else{
        if(similarproducts != undefined){
          if(similarproducts.length > 3){
            isdisplaymore = true;
          }

          for (var i = 0; i < similarproducts.length; i++) {
            if(counter < 4){
              var merchantname = "";
              if(similarproducts[i].merchantname != undefined && similarproducts[i].merchantname != "" && similarproducts[i].merchantname != null){
                merchantname = similarproducts[i].merchantname;
              }

              var product = new init.Product(similarproducts[i].productid.$oid, similarproducts[i].isaffiliate, similarproducts[i].basecurrency, similarproducts[i].price, similarproducts[i].name, similarproducts[i].imageurl, similarproducts[i].producttype, similarproducts[i].promoprice, itemobj._id.$oid, similarproducts[i].affiliatelink, merchantname, similarproducts[i].recommendedsize);
              similars.push(product);
            }else{
              break;
            }

            counter++;
          }
        }
      }

      this.singleProduct = singleproduct;
      this.isDisplayMoreProduct = isdisplaymore;
      this.similarProducts = similars;

      if(similars.length > 0){
        if(itemobj.isproduct){
          this.hasProduct = false;
        }else{
          this.hasProduct = true;
        }
      }else{
        this.hasProduct = false;
      }
    },

    ItemGroup: function(itemgroupobj) {
      this.groupId = itemgroupobj._id.$oid;
      this.userId = itemgroupobj.userid.$oid;
      this.groupName = itemgroupobj.groupname;
      var order = new Date(itemgroupobj.createddate);
      this.createdDate = order.getTime();
      this.updatedDate = itemgroupobj.updateddate;
      this.coverImageUrl = itemgroupobj.coverimageurl;

      if(itemgroupobj.itemgroupdetail != null && itemgroupobj.itemgroupdetail != undefined){
        this.totalOutFit = itemgroupobj.itemgroupdetail.length;
      }else{
        this.totalOutFit = 0;
      }
    },

    ItemSaved: function(itemgroupid, itemobj) {
      this.itemGroupId = itemgroupid;
      this.item = new init.Item(itemobj, true);
    },

    SingleProduct: function(productid, name, currency, price, promoprice, url, merchantname){
      this.productId = productid;
      this.productCurrency = currency;
      this.productPrice = price;
      this.productName = name;
      if(promoprice > 0){
        this.productPromoPrice = currency + " " + promoprice;
      }else{
        this.productPromoPrice = "";
      }
      this.productUrl = url;
      this.merchantName = merchantname;
    },

    Product: function(productid, isaffiliate, currency, price, name, imageurl, type, promoprice, itemid, url, merchantname, size) {
      this.productId = productid;
      this.isaffiliate = isaffiliate;
      this.productCurrency = currency;
      this.productPrice = price;
      this.productPH = GENERAL_CONS.PRODUCTPHPATH;
      this.productName = name;
      this.productImage = imageurl;
      this.productType = type;
      this.itemId = itemid;
      this.productUrl = url;
      this.merchantName = merchantname;
      this.recomemdedSize = size;
      if(size == ""){
        this.displayRecomemdedSize = false;
      }else{
        this.displayRecomemdedSize = true;
      }

      if(promoprice > 0){
        this.productPromoPrice = currency + " " + promoprice;
        this.displayPromo = true;
      }else{
        this.productPromoPrice = "";
        this.displayPromo = false;
      }

      this.viewMoreUrl = "";
      this.productMorePH = GENERAL_CONS.MOREPRODUCTPHPATH;
    },

    Award: function(position, title, description){
      this.position = position;
      this.title = title;
      this.description = description;
    },

    MyReward: function(rewardobj) {
      this.rewardId = rewardobj._id.$oid;
      this.merchantName = rewardobj.merchantname;
      this.headline = rewardobj.headline;
      var order = new Date(rewardobj.createddate);
      this.createdDate = order.getTime();

      var promoexpiredate = (new Date(rewardobj.expiredate)).getTime();
      var currenttime = (new Date()).getTime();
      if(currenttime < promoexpiredate){
        this.expireDate = "Expires " + moment(promoexpiredate).format('DDMMYYYY');
        this.isValid = true;
      }else{
        this.expireDate = "Expired";
        this.isValid = false;
      }

      this.featuredImage = rewardobj.featuredimage;
      this.promoCode = rewardobj.promocode;
      this.promoText = rewardobj.campaigntext;
      this.promoLink = rewardobj.link;
    },

    User: function(userid, name, profilepicurl){
      this.userId = userid;
      this.fullName = name;

      if(profilepicurl != undefined && profilepicurl != ""){
        this.profileImg = profilepicurl.fullurl;
      }else{
        this.profileImg = GENERAL_CONS.PROFILEPHPATH;
      }
    },

    Notification: function(notifid, title, message, imgurl, notiftype, status, createddate, targetid, senderid, sendername){
      this.notifId = notifid;
      this.imageUrl = imgurl;

      if(imgurl != undefined && imgurl != ""){
        this.imageUrl = imgurl.fullurl;
      }else{
        this.imageUrl = GENERAL_CONS.PROFILEPHPATH;
      }

      if(title.indexOf("%username%") > -1 || message.indexOf("%username%")){
        this.title = title.replace("%username%", sendername);
        this.message = message.replace("%username%", sendername);
      }else{
        this.title = title;
        this.message = message;
      }
      
      this.notifType = notiftype;
      this.targetId = targetid;
      this.senderId = senderid;
      this.status = status;
      var order = new Date(createddate);
      this.createddate =  order.getTime();
    },
    
    Setting: function(notif, isactive){
      this.notif = notif;
      this.isActive = isactive;
    }

  };

  return init;
});