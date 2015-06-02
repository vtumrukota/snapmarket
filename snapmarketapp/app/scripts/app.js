angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'config'])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data):/);
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:
  .state('tab.login', {
    url: '/login',
    views: {
      'profile': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    },
    data: {redirectOnAuth: true}
  })
  .state('tab.profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {requireLogin: true}
  })
  .state('tab.buySearch', {
    url: '/buySearch',
    views: {
      'buy': {
        templateUrl: 'templates/buy-search.html',
        controller: 'BuySearchCtrl'
      }
    }
  })
    .state('tab.buyItemDetail', {
      url: '/buySearch/:itemId',
      views: {
        'buy': {
          templateUrl: 'templates/buy-itemDetail.html',
          controller: 'BuyItemDetailCtrl'
        }
      }
    })
      .state('tab.buyItemOffer', {
        url: '/buySearch/:itemId/offer',
        views: {
          'buy': {
            templateUrl: 'templates/buy-itemOffer.html',
            controller: 'BuyItemOfferCtrl'
          }
        }
      })
  .state('tab.sellCamera', {
    url: '/sellCamera',
    views: {
      'sell': {
        templateUrl: 'templates/sell-camera.html',
        controller: 'SellCameraCtrl'
      }
    },
    data: {requireLogin: true}
  })
    .state('tab.sellCreateListing', {
      url: '/sellCamera/sellCreateListing',
      views: {
        'sell': {
          templateUrl: 'templates/sell-createListing.html',
          controller: 'SellCreateListingCtrl',
        }
      },
      data: {requireLogin: true}
    })
      .state('tab.sellTagItem', {
        url: '/sellCamera/sellCreateListing/sellTagItem',
        views: {
          'sell': {
            templateUrl: 'templates/sell-tagItem.html',
            controller: 'SellTagItemCtrl'
          }
        }
      })
  .state('tab.transaction', {
    url: '/transaction',
    views: {
      'transaction': {
        templateUrl: 'templates/transaction.html',
        controller: 'TransactionCtrl',
      }
    },
    data: {requireLogin: true}
  })
    .state('tab.transaction.buyOffers', {
      url: '/buyOffers',
      views: {
        'offers': {
          templateUrl: 'templates/buy-offers.html',
          controller: 'BuyOfferCtrl'
        } 
      }
    })
     .state('tab.transaction.sellListings', {
      url: '/sellListings',
      views: {
        'offers': {
          templateUrl: 'templates/sell-listings.html',
          controller: 'SellListingsCtrl'
        }
      }
    })
      .state('tab.buy-transactionChat', {
        url: '/transaction/buyOffers/tid',
        views: {
          'transaction': {
            templateUrl: 'templates/buy-transactionChat.html',
            controller: 'BuyTransactionChatCtrl'
          }
        }
      })
      .state('tab.sellListingItems', {
        url: '/transaction/sellListings/sellListingItems',
        views: {
          'transaction': {
            templateUrl: 'templates/sell-listingItems.html',
            controller: 'SellListingItemsCtrl'
          }
        }
      })
        .state('tab.sellListingItems.sellItemOffers', {
          url: '/itemOffers',
          views: {
            'transaction': {
              templateUrl: 'templates/sell-itemOffers.html',
              controller: 'SellItemOffersCtrl'
            }
          }
        })
  .state('tab.profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
