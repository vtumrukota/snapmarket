angular.module('transaction.controllers', [])

  //Buy Navigation controllers
  .controller('BuyOfferCtrl', function($rootScope, $scope, $state, $firebaseObject, Db, $ionicLoading) {
    $rootScope.nav = {
      bar : false
    };
    $ionicLoading.show({
      template: 'Loading...'
    });
   
     $scope.viewOffer = function(offer){
      console.log(offer);
      $rootScope.nav = {
        bar : true,
        title: offer.seller.name,
        url: "#/tab/transaction/buyOffers"
      };
      $rootScope.currentOffer = offer;
      $state.go('tab.transaction.chat', {offerId : offer.uniqueId});
    }

    //grab current user and all offers on DB
    $rootScope.currentUser = $rootScope.production ? Db.getAuth().uid : $rootScope.TESTUSER.uid;
    var offers = $firebaseObject(Db.child('offers'));
    $scope.userOffers = {};
    $scope.noListings = true;

    offers.$loaded().then(function(){
      angular.forEach(offers, function(value, key) {
        if(offers[key].hasOwnProperty('buyer') && offers[key].buyer.uid === $rootScope.currentUser.toString()){
          offers[key].moment = moment(offers[key].createdAt).fromNow(); 
         $scope.userOffers[key] = offers[key];
        }
      });
      $ionicLoading.hide();
      if(Object.keys($scope.userOffers).length > 0) {
        $scope.noListings = false;
      }  
    });
  })

  //Sell Navigation controllers
  .controller('SellListingsCtrl', function($rootScope, $scope, $state, $firebaseObject, Db, $ionicLoading, ionicMaterialMotion, ionicMaterialInk) {
    $rootScope.nav = {
      bar : false
    };

    $scope.viewList = function(listing){
      $rootScope.currentlisting = listing;
      $state.go('tab.transaction.sellOffers');
    }
    //Loading indicator while Db is being loaded
    $ionicLoading.show({
        template: 'Loading...'
    });

    //Grab facebookId of current user
    $rootScope.currentUser = $rootScope.production ? Db.getAuth().uid : $rootScope.TESTUSER.uid; 
    //Grab object of all listings in the Db
    var listings = $firebaseObject(Db.child('listings'));
    //create filtered object of current users listings
    $rootScope.userListings = {};
    //Flag to check if the user has any listings at all 
    $scope.noListings = true;
    //When Db loads, filter through and find all listings from that user
    listings.$loaded().then(function(){ 
      angular.forEach(listings, function(value, key) {
        //check if user facebookId matches listingId user
        if(listings[key]['user'].toString() === $rootScope.currentUser.toString()){
          listings[key].moment = moment(listings[key].createdAt).fromNow(); 
          $rootScope.userListings[key] = listings[key];
        } 
      });
      //Hide loading screen when array is filled
      $ionicLoading.hide();
      if(Object.keys($scope.userListings).length > 0) {
        $scope.noListings = false;
      }              
    });

    $scope.totalOffers = function(listing) {
      if(listing.offers === undefined || listing.offers.length === 0) {return 'No one has made any offers yet';}
      else if(listing.offers.length === 1) {return 'Someone made you an offer!';}
      else if(listing.offers.length >= 2) {return 'You currently have ' + listing.offers.length + ' offers!';}
    }

  })

  .controller('SellOffersCtrl', function($rootScope, $scope, $state, Db, $firebaseObject) {
    $rootScope.nav = {
      bar : true,
      title: "Seller: Offers",
      url: "#/tab/transaction/sellListings"
    };

    console.log($rootScope.currentlisting);

    $scope.viewOffer = function(offer){
      console.log(offer);
      $rootScope.nav = {
        bar : true,
        title: offer.buyer.name,
        url: "#/tab/transaction/sellListings/sellOffers"
      };
      $rootScope.currentOffer = offer;
      $state.go('tab.transaction.chat', {offerId : offer.uniqueId});
    }

    //create array of offers
    var offerIds = $rootScope.currentlisting.offers;    

    var user = $firebaseObject(Db.child('users'));
    var offers = $firebaseObject(Db.child('offers'));

    $scope.listingOffers = [];   //array to hold all offer objects
    $scope.noListings = true;

    offers.$loaded().then(function(){
      for(var i=0; i < offerIds.length; i++) {
        console.log(offerIds[i]);
        $scope.listingOffers.push(offers[offerIds[i]]);
      }
       if($scope.listingOffers.length > 0) {
        $scope.noListings = false;
      }      
    });
  })
.controller('ChatCtrl', function($rootScope, $scope, ChatManager, $cordovaCamera, $ionicScrollDelegate, $ionicModal, $ionicActionSheet, $timeout, Db) {

  $scope.handle = $rootScope.production ? Db.getAuth().uid : $rootScope.TESTUSER.uid;
  $scope.showTime = false;
  var offerId = $rootScope.currentOffer.uniqueId;

  function scrollBottom() {
    $timeout(function() {
      var startHandle = _.find($ionicScrollDelegate._instances, function (view) {
          return view.$$delegateHandle === "chat";
      });
      startHandle.scrollBottom();
    });
  }

  function addPost(message, img) {
    ChatManager.posts(offerId).$add({
      message: message ? message : null,
      img: img ? img : null,
      timestamp: new Date().getTime(),
      user: $scope.handle
    });
  }

  $scope.data = {};
  
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  $scope.inputUp = function() {
    window.addEventListener('native.keyboardshow', function() {
      if (isIOS) {
        $scope.data.keyboardHeight = 216;
      }
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    });
  };

  $scope.inputDown = function() {
    if (isIOS) {
      $scope.data.keyboardHeight = 0;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.posts = ChatManager.posts(offerId);
  $scope.posts.$watch(scrollBottom);

  $scope.add = function(message) {
    addPost(message);
    // pretty things up
    $scope.message = null;
  };

  $scope.takePicture = function() {
    $ionicActionSheet.show({
      buttons: [{
        text: 'Picture'
      }, {
        text: 'Selfie'
      }, {
        text: 'Saved Photo'
      }],
      titleText: 'Take a...',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        ionic.Platform.isWebView() ? takeARealPicture(index) : takeAFakePicture();
        return true;
      }
  });

  function takeARealPicture(cameraIndex) {
    var options = {
      quality: 50,
      sourceType: cameraIndex === 2 ? 2 : 1,
      cameraDirection: cameraIndex,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 600,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        var photo = 'data:image/jpeg;base64,' + imageData;
        addPost(null, photo);
      }, function(err) {
        // error
        console.error(err);
        takeAFakePicture();
      });
  }

  function takeAFakePicture() {
      addPost(null, $cordovaCamera.getPlaceholder());
    }
  };

  $scope.save = function(handle) {
    localStorage.handle = $scope.handle = handle;
    $scope.modal.hide();
  };

  $scope.openModal = function() {
    $scope.modal.show();
  };
});
