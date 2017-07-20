// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic.contrib.ui.tinderCards2', 'ion-profile-picture', 'ngCordova','angularjs-crypto'])

.run(function($ionicPlatform,$ionicPopup,cfCryptoHttpInterceptor, $rootScope) {

    $rootScope.base64Key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef')
    $rootScope.iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');
    $rootScope.ipaddress = "http://52.38.153.189:80";
    $rootScope.jobposted = false;

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.Connection) {

                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }

    FCMPlugin.getToken(
      function (token) {
        $rootScope.token = token;
          //alert('Token: ' + token);
          console.log('Token: ' + token);
      },
      function (err) {
          console.log('error retrieving token: ' + err);
      }
    );

    FCMPlugin.onNotification(function(data){

          //Notification was received in foreground. Maybe the user needs to be notified.
        $ionicPopup.alert({
                title: data.title,
                template: data.pay
              });


    });


});


})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

   .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

   .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignUpCtrl'
  })


.state('location', {
      url: '/location',
      templateUrl: 'templates/location.html',
      controller: 'LocCtrl'
  })

.state('profilepic', {
      url: '/profilepic',
      templateUrl: 'templates/profilepic.html',
      controller: 'MyCtrl'
  })

  .state('forgot', {
     url: '/forgot',
     templateUrl: 'templates/forgot.html',
     controller: 'ForgotCtrl'
  })

  .state('changepwd', {
     url: '/changepwd',
     templateUrl: 'templates/changepwd.html',
     controller: 'ChangepwdCtrl'
  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chat/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.jobs', {
      url: '/jobs',
      views: {
        'tab-jobs': {
          templateUrl: 'templates/tab-jobs.html',
          controller: 'JobsCtrl'
        }
      }
    })
    .state('tab.jobs-detail', {
      url: '/jobs/:jobId',
      views: {
        'tab-jobs': {
          templateUrl: 'templates/jobs-detail.html',
          controller: 'JobDetailCtrl'
        }
      }
    })
    .state('tab.addjobs', {
    url: '/addjobs',
    views: {
      'tab-jobs': {
        templateUrl: 'templates/tab-addjobs.html',
        controller: 'AddJobsCtrl'
      }
    }
  })

    .state('tab.xyz', {
    url: '/xyz',
    views: {
      'tab-xyz': {
        templateUrl: 'templates/tab-xyz.html',
        controller: 'XyzCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/login');

})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})




.controller('CardCtrl', function($scope, TDCardDelegate) {

});
