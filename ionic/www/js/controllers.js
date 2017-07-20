angular.module('starter.controllers', [])


.controller('TabsCtrl', function($scope, Data ) {
	$scope.myFunctionName = function(){
    if (Data.getUser().role =="Manager") {
    return "ng-show";
    } else {
     return "ng-hide";
    }
	}
})


.controller('DashCtrl', function($scope,$http,$ionicPopup,Data,$rootScope) {
	 $scope.$on('$ionicView.enter', function() {
	if(Data.getUser().role!="Manager"){
			var latLng = new google.maps.LatLng(Data.getUser().location.lat, Data.getUser().location.lng);



	    var mapOptions = {
	            center: latLng,
	            zoom: 15,
	            mapTypeId: google.maps.MapTypeId.ROADMAP,
	            disableDefaultUI: true,
	            zoomControl: true,
	            mapTypeControl: true
	          };

	          document.getElementById("spin11").style.display = 'none';
	          $scope.mapdash = new google.maps.Map(document.getElementById("mapdash"), mapOptions);

	    //var alljobs;

	    $http.post($rootScope.ipaddress+'/getalljobs',{}).then(function(resp){
				console.log(resp);
	      if(resp.data =="No Jobs Found"){
	          var alertPopup = $ionicPopup.alert({
	              title: 'No Jobs Found!',
	              template: 'Oops! There no jobs posted'
	            });
	      }
	      else{
	        var infowindow = new google.maps.InfoWindow();

	          for(var i=0;i<resp.data.length;i++){

	            var pos = new google.maps.LatLng(resp.data[i].location.lat, resp.data[i].location.lng);

	            var marker = new google.maps.Marker({
	              position: pos,
	              map: $scope.mapdash,
	              animation: google.maps.Animation.DROP,
	              icon: 'img/marker.png'
	            });
	            //var content[i] = '<h4>'+resp.data[i].title+'</h4'+'<br><p>'+resp.data[i].pay+'</p>';

	            google.maps.event.addListener(marker, 'click', (function(marker, i) {
	              return function() {
	                infowindow.setContent('<h4>'+resp.data[i].title+'</h4'+'<br><p>$'+resp.data[i].pay+'</p>');
	                infowindow.open($scope.mapdash, marker);
	                $scope.mapdash.setCenter(marker.getPosition());
	              }
	            })(marker, i));

	          }

	      }
	    },function(err){

	    })
	        var marker = new google.maps.Marker({
	              position: latLng,
	              map: $scope.mapdash,
	              animation: google.maps.Animation.DROP,
	              icon: 'img/marker1.png'
	            });

	}
	else{
		var latLng = new google.maps.LatLng(Data.getUser().location.lat, Data.getUser().location.lng);



		var mapOptions = {
						center: latLng,
						zoom: 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						disableDefaultUI: true,
						zoomControl: true,
						mapTypeControl: true
					};

					document.getElementById("spin11").style.display = 'none';
					$scope.mapdash = new google.maps.Map(document.getElementById("mapdash"), mapOptions);

		//var alljobs;

		$http.post($rootScope.ipaddress+'/getallhelps',{}).then(function(resp){
			console.log(resp);
			if(resp.data =="No Help Found"){
					var alertPopup = $ionicPopup.alert({
							title: 'No Help Found!',
							template: 'Oops! You are on your own'
						});
			}
			else{
				var infowindow = new google.maps.InfoWindow();

					for(var i=0;i<resp.data.length;i++){
						if(resp.data[i].location!=null){
						var pos = new google.maps.LatLng(resp.data[i].location.lat, resp.data[i].location.lng);

						var marker = new google.maps.Marker({
							position: pos,
							map: $scope.mapdash,
							animation: google.maps.Animation.DROP,
							icon: 'img/marker1.png'
						});
						//var content[i] = '<h4>'+resp.data[i].title+'</h4'+'<br><p>'+resp.data[i].pay+'</p>';

						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infowindow.setContent('<h4>'+resp.data[i].fullname+'</h4>');
								infowindow.open($scope.mapdash, marker);
								$scope.mapdash.setCenter(marker.getPosition());
							}
						})(marker, i));
					}
					else {
						continue;
					}
					}

			}
		},function(err){

		})
				var marker = new google.maps.Marker({
							position: latLng,
							map: $scope.mapdash,
							animation: google.maps.Animation.DROP,
							icon: 'img/marker.png'
						});

	}
})
})

.controller('ChatsCtrl', function($scope, Chats,$http,$ionicPopup,$rootScope,Data,$timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.manager = function(){
		if (Data.getUser().role =="Manager") {
		return "ng-show";
		} else {
		 return "ng-hide";
		}
	}
	$scope.worker = function(){
		if (Data.getUser().role !="Manager") {
		return "ng-show";
		} else {
		 return "ng-hide";
		}
	}

	$scope.doRefresh = function(){
		var applied=[];
		var accepted=[];
		var rejected=[];
if(Data.getUser().role!="Manager"){

		$http.post($rootScope.ipaddress+'/getallworkerapplied',{"username":Data.getUser().username}).then(function(resp){

		if(resp.data =="No Jobs Found"){
				Chats.setapp(null);
				Chats.setacc(null);
				Chats.setrej(null);
				$scope.applied = Chats.allapp();
				$scope.accepted = Chats.allacc();
				$scope.rejected = Chats.allrej();
		}
		else{
			var k=0,l=0,m=0;
					console.log(resp);
					for(var i = 0;i<resp.data.length;i++){
						if(resp.data[i].status=="Applied"){
							applied.push({id:k,image:Data.getUser().pic ,name:Data.getUser().fullname,title:resp.data[i].title,pay:resp.data[i].pay})
							k++;
						}
						if(resp.data[i].status=="Accepted"){
							accepted.push({id:l,image:Data.getUser().pic ,name:Data.getUser().fullname,title:resp.data[i].title,pay:resp.data[i].pay})
							l++;
						}
						if(resp.data[i].status=="Rejected"){
							rejected.push({id:m,image:Data.getUser().pic ,name:Data.getUser().fullname,title:resp.data[i].title,pay:resp.data[i].pay})
							m++;
						}



					}
					if(applied.length!=0){
						console.log(applied.length);
						Chats.setapp(applied);
						$scope.appliedtext = function(){
							return "ng-hide";
						 }
					}
					if(accepted.length!=0){
						console.log(accepted.length);
						Chats.setacc(accepted);
						$scope.acceptedtext = function(){
							return "ng-hide";
						 }
					}
					if(rejected.length!=0){
						console.log(rejected.length);
						Chats.setrej(rejected);
						$scope.rejectedtext = function(){
							return "ng-hide";
						 }
					}
					$scope.applied = Chats.allapp();
					$scope.accepted = Chats.allacc();
					$scope.rejected = Chats.allrej();

		}
		},function(err){

		})
		.finally(function() {
		 // Stop the ion-refresher from spinning

		 $scope.$broadcast('scroll.refreshComplete');
	 });
 }
	 else{
			$http.post($rootScope.ipaddress+'/getallapplied',{"username":Data.getUser().username}).then(function(resp){
			if(resp.data =="No Help Found"){
					Chats.setapp(null);
					Chats.setacc(null);
					Chats.setrej(null);
					$scope.applied = Chats.allapp();
					$scope.accepted = Chats.allacc();
					$scope.rejected = Chats.allrej();
			}
			else{
				var k=0,l=0,m=0;
						console.log(resp);
						for(var i = 0;i<resp.data.length;i++){
							if(resp.data[i].workers!=null){
								if(resp.data[i].workers.applied!=null){
									for(var j=0;j<resp.data[i].workers.applied.length;j++){
										applied.push({id:k,image:resp.data[i].workers.applied[j].pic ,name:resp.data[i].workers.applied[j].fullname,title:resp.data[i].title,pay:resp.data[i].pay})
										k++;
									}
								}
								if(resp.data[i].workers.accepted!=null){
									for(var j=0;j<resp.data[i].workers.accepted.length;j++){
										accepted.push({id:l,image:resp.data[i].workers.accepted[j].pic ,name:resp.data[i].workers.accepted[j].fullname,title:resp.data[i].title,pay:resp.data[i].pay})
										l++;
									}
								}
								if(resp.data[i].workers.rejected!=null){
									for(var j=0;j<resp.data[i].workers.rejected.length;j++){
										rejected.push({id:m,image:resp.data[i].workers.rejected[j].pic ,name:resp.data[i].workers.rejected[j].fullname,title:resp.data[i].title,pay:resp.data[i].pay})
										m++;
									}
								}
							}

						}
						if(applied.length!=0){
							Chats.setapp(applied);
							$scope.appliedtext = function(){
						    return "ng-hide";
						   }
						}
						if(accepted.length!=0){
							Chats.setacc(accepted);
							$scope.acceptedtext = function(){
						    return "ng-hide";
						   }
						}
						if(rejected.length!=0){
							Chats.setrej(rejected);
							$scope.rejectedtext = function(){
						    return "ng-hide";
						   }
						}
						$scope.applied = Chats.allapp();
						$scope.accepted = Chats.allacc();
						$scope.rejected = Chats.allrej();

			}
			},function(err){

			})
			.finally(function() {
			 // Stop the ion-refresher from spinning

			 $scope.$broadcast('scroll.refreshComplete');
		 });
	 }





	}
	  $scope.doRefresh();

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	console.log($stateParams.chatId);
	console.log($stateParams.chat);
	if($stateParams.chat =="applied")
  	$scope.chat = Chats.getapp($stateParams.chatId);
	if($stateParams.chat =="accepted")
	  	$scope.chat = Chats.getacc($stateParams.chatId);
	if($stateParams.chat =="rejected")
		  	$scope.chat = Chats.getrej($stateParams.chatId);
})

.controller('JobsCtrl', function($scope, $state, Data,Jobs, $http,$ionicPopup,$rootScope) {

   // $scope.abc.role = Data.getUser().role();
	 $scope.data={};
	 $scope.addjobbutton = function(){
     if (Data.getUser().role =="Manager") {
     return "ng-show";
     } else {
      return "ng-hide";
     }
 	}
	$scope.findjobbutton = function(){
		if (Data.getUser().role !="Manager") {
		return "ng-show";
		} else {
		 return "ng-hide";
		}
 }
 if($scope.data.distance==null){
	 $scope.data.distance=20;
 }

    $scope.doRefresh = function(){

			if(Data.getUser().role !="Manager"){
				console.log($scope.data.distance);

	      $http.post($rootScope.ipaddress+'/getnearbyjobs',{"username":Data.getUser().username,"location":Data.getUser().location,"distance":$scope.data.distance}).then(function(resp){
	      if(resp.data =="No Jobs Found"){
	          var alertPopup = $ionicPopup.alert({
	              title: 'No Jobs Found!',
	              template: 'Add jobs to view'
	            });
							$scope.jobs=null;
	      }
	      else{
	            console.log(resp.data);
	            Jobs.set(resp.data);
	            $scope.jobs = Jobs.all();
	      }
	    },function(err){

	    })
	      .finally(function() {
	       // Stop the ion-refresher from spinning
	       $scope.$broadcast('scroll.refreshComplete');
	     });
		 }
		 else{
			 $http.post($rootScope.ipaddress+'/getjobs',{"username":Data.getUser().username}).then(function(resp){
			 if(resp.data =="No Jobs Found"){
					 var alertPopup = $ionicPopup.alert({
							 title: 'No Jobs Found!',
							 template: 'Add jobs to view'
						 });
			 }
			 else{
						 console.log(resp.data);
						 Jobs.set(resp.data);
						 $scope.jobs = Jobs.all();
			 }
		 },function(err){

		 })
			 .finally(function() {
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		 }
    }

  $scope.addjob= function(){
      $state.go('tab.addjobs');
    }
		$scope.findjob= function(){
	      $scope.doRefresh();
	    }

    $scope.doRefresh();

})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs,$http,Data,$ionicPopup,$rootScope) {

	$scope.applyjobbutton = function(){
		if (Data.getUser().role !="Manager") {
		return "ng-show";
		} else {
		 return "ng-hide";
		}
 }

	$scope.$on('$ionicView.enter', function() {
		$scope.mapjob=null;
		$scope.job = Jobs.get($stateParams.jobId);
	 	var mapOptions = {
				center: new google.maps.LatLng($scope.job.location.lat,$scope.job.location.lng),
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			};

			$scope.mapjob = new google.maps.Map(document.getElementById("mapjob"), mapOptions);

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng($scope.job.location.lat,$scope.job.location.lng),
				map: $scope.mapjob,
				animation: google.maps.Animation.DROP,
				title: 'Hello World!',
				icon: 'img/marker.png'
			});
     });

		 $scope.applyjob = function() {
			 $http.post($rootScope.ipaddress+'/applyjob',{"username":Data.getUser().username,"jobid":$scope.job._id,"fullname":Data.getUser().fullname,"pic":Data.getUser().pic}).then(function(resp){
			 if(resp.data =="Already Applied"){
					 var alertPopup = $ionicPopup.alert({
							 title: 'Already Applied',
							 template: 'You have already applied for the job'
						 });

			 }
			 else{
				 var alertPopup = $ionicPopup.alert({
						 title: 'Applied successfully',
						 template: 'Yeah!! Now Just Sit tight'
					 });
			 }
		 },function(err){

		 })
		 }



})



.controller('AddJobsCtrl', function($scope, Data,$ionicPopup,$http,$state,$rootScope) {

$scope.data = {};



     $scope.addjob = function() {


      if($scope.data.title!=null && $scope.data.pay !=null &&  $scope.data.starttime!=null && $scope.data.endtime!=null){
        $rootScope.jobposted = true;
        $http.post($rootScope.ipaddress+'/addjob',{
          "username":Data.getUser().username,
          "title":$scope.data.title,
          "pay":$scope.data.pay,
          "starttime":$scope.data.starttime,
          "endtime":$scope.data.endtime,
					"range":$scope.data.range,
          "desc":$scope.data.desc,
          "location":Data.getUser().location}).then(function(resp){

          console.log('Success', resp); // JSON object
          if(resp.data == "Job Already Exists"){
            var alertPopup = $ionicPopup.alert({
              title: 'Job Already Exists!',
              template: 'You have already posted this job'
            });
          }
          else{
            var alertPopup = $ionicPopup.alert({
              title: 'Job Posting Successfull!',
              template: 'Your Job was added. Pull Down to refresh'
            });
            $state.go('tab.jobs');

          }


        }, function(err){
          console.error('ERR', err);
          var alertPopup = $ionicPopup.alert({
              title: 'ERROR!!',
              template: 'You have been hacked'
            });

        })


      }
      else {

            var alertPopup = $ionicPopup.alert({
                title: 'Enter all the fields',
                template: 'Everything is required except description'
            });
        }

    }
})

.controller('XyzCtrl', function($scope, TDCardDelegate, $timeout,$rootScope, Data, $http, $ionicPopup) {


	$scope.appliedpics = [];
	$scope.appliedfullnames =[];
	$scope.cardst=[]
	  //console.log(pic);
		$http.post($rootScope.ipaddress+'/getapplied',{"username":Data.getUser().username}).then(function(resp){
		if(resp.data =="No Applications Found"){
				var alertPopup = $ionicPopup.alert({
						title: 'No one Applied',
						template: 'May be wait for some more time'
					});
					$scope.jobs=null;
		}
		else{
					console.log(resp);
					for(var i = 0;i<resp.data.length;i++){
						if(resp.data[i].workers!=null){
							for(var j=0;j<resp.data[i].workers.applied.length;j++){
								$scope.cardst.push({image:resp.data[i].workers.applied[j].pic ,name:resp.data[i].workers.applied[j].fullname,title:resp.data[i].title,username:resp.data[i].workers.applied[j].username})
							}
						}
						else {
							continue;
						}
					}

		}
	},function(err){

	})





	$timeout(function () {
		console.log($scope.cardst);
		var cardTypes = $scope.cardst;
		console.log(cardTypes);
				$scope.cards = {
					master: Array.prototype.slice.call(cardTypes, 0),
					active: Array.prototype.slice.call(cardTypes, 0),
					discards: [],
					liked: [],
					disliked: []
				}
	    }, 1500);





			$scope.cardDestroyed = function(index) {
				$scope.cards.active.splice(index, 1);
			};

			$scope.addCard = function() {
				var newCard = cardTypes[0];
				$scope.cards.active.push(angular.extend({}, newCard));
			}

			$scope.refreshCards = function() {
				// Set $scope.cards to null so that directive reloads
				$scope.cards.active = null;
				$timeout(function() {
					$scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
				});
			}
			$scope.$on('removeCard', function(event, element, card) {

			});

			$scope.cardSwipedLeft = function(index) {
				console.log('LEFT SWIPE');
				var card = $scope.cards.active[index];
				$scope.cards.disliked.push(card);
				$http.post($rootScope.ipaddress+'/reject',{"username":Data.getUser().username,"title":card.title,"worker":card.username}).then(function(resp){
					var alertPopup = $ionicPopup.alert({
					title: 'Reject Message sent',
					template: 'No Worries..!!'
				});
				},function(err){

				})


				var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
				$scope.cards.discards.push(discarded);
			};

			$scope.cardSwipedRight = function(index) {
				console.log('RIGHT SWIPE');
				var card = $scope.cards.active[index];
				$scope.cards.liked.push(card);
				$http.post($rootScope.ipaddress+'/accept',{"username":Data.getUser().username,"title":card.title,"worker":card.username}).then(function(resp){
					var alertPopup = $ionicPopup.alert({
					title: 'Acceptance Message sent',
					template: 'Happy working..!!'
				});
				},function(err){

				})

				var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
				$scope.cards.discards.push(discarded);
			};






})


.controller('AccountCtrl', function($scope,$state, Data, $http,$ionicHistory,$ionicPopup) {
   $scope.data={};
     $scope.$on('$ionicView.enter', function() {
    // code to run each time view is entered

    $scope.data.picture = Data.getUser().pic;
    $scope.data.username = Data.getUser().username
    $scope.data.fullname = Data.getUser().fullname;
    $scope.data.email = Data.getUser().email;
    $scope.data.role = Data.getUser().role;



    var latLng = new google.maps.LatLng(Data.getUser().location.lat, Data.getUser().location.lng);

    var mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    document.getElementById("spin1").style.display = 'none';
    $scope.mapaccount = new google.maps.Map(document.getElementById("mapaccount"), mapOptions);

    var marker = new google.maps.Marker({
      position: latLng,
      map: $scope.mapaccount,
      animation: google.maps.Animation.DROP,
      title: 'Hello World!',
      icon: 'img/marker1.png'
    });



});

     $scope.logout =function(){
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go("login");

     }
		 $scope.change = function(){

      $state.go("changepwd");

     }

})

.controller('SignUpCtrl', function($scope, $http, $ionicPopup, $state, Data,$rootScope) {
    $scope.data = {};
		var manager = false;
		$scope.checkrole = function(){
	    if ($scope.data.role == "Manager") {
	    return "ng-show";
			manager = true;
	    } else {
	     return "ng-hide";
			 manager = false;
	    }
		}


     $scope.signup = function() {
      if($scope.data.username!=null && $scope.data.password !=null &&  $scope.data.confirmpassword!=null &&  $scope.data.fullname!=null &&  $scope.data.email!=null &&  $scope.data.dob!=null &&  $scope.data.gender!=null &&  $scope.data.role!=null){
        $http.post($rootScope.ipaddress+'/checkuser',{"username":$scope.data.username}).then(function(resp){
          console.log('Success', resp); // JSON object
          if(resp.data=="Username Already Exists"){
              var alertPopup = $ionicPopup.alert({
              title: 'Username Already Exists!',
              template: 'Try using a different Username'
            });

          }
          else if ($scope.data.password!=$scope.data.confirmpassword){
            var alertPopup = $ionicPopup.alert({
              title: 'Passwords dont match!',
              template: 'Re enter the password'
            });
          }
          else if(resp.data == "Success"){
            var encrypted = CryptoJS.AES.encrypt(
                  $scope.data.password,
                  $rootScope.base64Key,
                  { iv: $rootScope.iv }
                );
            var password = encrypted.ciphertext.toString(CryptoJS.enc.Base64);


            $http.post($rootScope.ipaddress+'/adduserprofile',{
              "username":$scope.data.username,
              "password":password,
              "fullname":$scope.data.fullname,
              "DOB":$scope.data.dob,
              "gender":$scope.data.gender,
              "role":$scope.data.role,
              "email":$scope.data.email,
							"business":$scope.data.bus
            }).then(function(resp){
            console.log('Success', resp); // JSON object

            $http.post($rootScope.ipaddress+'/login',{"username":$scope.data.username,"password":password}).then(function(resp){
              console.log('Success', resp); // JSON object
              if(resp.data!="Failed"){
                Data.setUser(resp.data);

                console.log(Data.getUser().fullname);
              }

            }, function(err){
              console.error('ERR', err);

            })
            $state.go("location");

            }, function(err){
              console.error('ERR', err);

            })
          }
          else{
            var alertPopup = $ionicPopup.alert({
                  title: 'Error Occured',
                  template: resp.data
              });
          }
        }, function(err){
          console.error('ERR', err);

        })
      }
      else {

            var alertPopup = $ionicPopup.alert({
                title: 'Enter all credentials',
                template: 'Create your Username and password'
            });
        }

    }



})

.controller('MyCtrl', function($scope,$http, Data, $ionicPopup, $cordovaCamera,$state,$rootScope) {

   $scope.user = {};



   $scope.takePicture = function (options) {

      var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1024 ,
            targetHeight: 1024 ,
            popoverOptions: CameraPopoverOptions,
            cameraDirection: 1,
            saveToPhotoAlbum: false
        };

      $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.user.picture = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });

   }

   $scope.addpic = function(){
      //$state.go('profilepic');
      console.log($scope.user.picture);
      $http.post($rootScope.ipaddress+'/profilepic',{"_id":Data.getUser()._id,"pic":$scope.user.picture}).then(function(resp){
              console.log('Success', resp); // JSON object
              var alertPopup = $ionicPopup.alert({
                title: 'Signup Successfull',
                template: 'Please Login'
            });
              $state.go('login');


            }, function(err){
              console.error('ERR', err);

            })

      //console.log($scope.data.myPicture);
    }


   $scope.getPicture = function (options) {

      var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500 ,
            targetHeight: 500 ,
            popoverOptions: CameraPopoverOptions,
            cameraDirection: true,
            saveToPhotoAlbum: false
        };

      $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.user.picture = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });
   }

})

.controller('LocCtrl', function($scope, $state,$ionicPopup,Data,$http,$rootScope) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  var gps;



  $scope.pic = function(){

      $http.post($rootScope.ipaddress+'/location',{"username":Data.getUser().username,"location":gps}).then(function(resp){
              console.log('Success', resp); // JSON object
              var alertPopup = $ionicPopup.alert({
              title: 'SignUp Successfull!',
              template: 'Please Add your picture'
            });
               $state.go('profilepic');

            }, function(err){
              console.error('ERR', err);

            })
    }

    var onMapSuccess = function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        gps = latLng;

        var mapOptions = {
          center: latLng,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true
        };

        document.getElementById("spin").style.display = 'none';
        $scope.maploc = new google.maps.Map(document.getElementById("maploc"), mapOptions);

        var marker = new google.maps.Marker({
          position: latLng,
          map: $scope.maploc,
          draggable:true,
          animation: google.maps.Animation.BOUNCE,
          title: 'Hello World!'
        });

        marker.addListener('click', handleEvent);
        marker.addListener('drag', handleEvent);
        marker.addListener('dragend', handleEvent);

    }
    var onMapError = function (position) {

       console.log("Location Failed");
       var alertPopup = $ionicPopup.alert({
                title: 'Location Failed',
                template: 'Failed'
            });

    }

    function handleEvent(event) {
          gps = event.latLng;
    }

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, {enableHighAccuracy: true });
    }


})

.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state, Data, $rootScope) {
    $scope.data = {};

    $scope.login = function() {
      if($scope.data.username!=null && $scope.data.password!=null ){

        var encrypted = CryptoJS.AES.encrypt(
            $scope.data.password,
            $rootScope.base64Key,
            { iv: $rootScope.iv }
          );
        var password = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

        $http.post($rootScope.ipaddress+'/login',{"username":$scope.data.username,"password":password,"token":$rootScope.token}).then(function(resp){
          console.log('Success', resp); // JSON object
          if(resp.data!="Failed"){
            Data.setUser(resp.data);
              var alertPopup = $ionicPopup.alert({
              title: 'Login Successfull!',
              template: 'Welcome '+Data.getUser().fullname +'. You are a ' + Data.getUser().role
            });

               $state.go('tab.dash');
        }
        else{
          var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        }

        }, function(err){
          console.error('ERR', err);

        })
      }
      else {

            var alertPopup = $ionicPopup.alert({
                title: 'Enter credentials',
                template: 'Enter your Username and password'
            });
        }
    }

    $scope.signup = function() {
        $state.go('signup');

    }
		$scope.forgot = function() {
        $state.go('forgot');

    }
})

.controller('ForgotCtrl', function($scope, $ionicPopup, $http,$rootScope,$state,Data) {
	$scope.data = {};
	  $scope.check = function() {
			if($scope.data.username!=null && $scope.data.email!=null ){

				$http.post($rootScope.ipaddress+'/forgot',{"username":$scope.data.username,"email":$scope.data.email}).then(function(resp){
          console.log('Success', resp); // JSON object
          if(resp.data!="Failed"){
						Data.setUser({"username":$scope.data.username});
						var alertPopup = $ionicPopup.alert({
              title: 'Info provided Correct',
              template: 'Enter your new password'
            });

               $state.go('changepwd');
        }
        else{
          var alertPopup = $ionicPopup.alert({
                title: 'Info provided Wrong',
                template: 'Try again'
            });
        }

        }, function(err){
          console.error('ERR', err);

        })
			}
			else{
				var alertPopup = $ionicPopup.alert({
						title: 'Enter credentials',
						template: 'Enter your Username and email'
				});
			}
		}


})

.controller('ChangepwdCtrl', function($scope, $ionicPopup, $http,$rootScope,$state,Data,$ionicHistory) {
	$scope.data = {};
	$scope.change = function() {
	 if($scope.data.password!=null && $scope.data.confirmpassword!=null ){
		 if($scope.data.password==$scope.data.confirmpassword){

			 var encrypted = CryptoJS.AES.encrypt(
						 $scope.data.password,
						 $rootScope.base64Key,
						 { iv: $rootScope.iv }
					 );
			 var password = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

			 $http.post($rootScope.ipaddress+'/changepwd',{"username":Data.getUser().username,"password":password}).then(function(resp){
				 console.log('Success', resp); // JSON object
				 if(resp.data!="Failed"){
					var alertPopup = $ionicPopup.alert({
						 title: 'Passowrd Change Successfull',
						 template: 'Login using new password'
					 });

					 $ionicHistory.clearCache();
					 $ionicHistory.clearHistory();
							$state.go('login');
			 }
			 else{
				 var alertPopup = $ionicPopup.alert({
							 title: 'Error',
							 template: 'Contact Support'
					 });
			 }

			 }, function(err){
				 console.error('ERR', err);

			 })
		 }
		 else{
			 var alertPopup = $ionicPopup.alert({
					 title: 'Passwords Do not Match',
					 template: 'Try again'
			 });
		 }
	 }
	 else{
		 var alertPopup = $ionicPopup.alert({
				 title: 'Enter credentials',
				 template: 'Enter your new password'
		 });
	 }
	}


});;
