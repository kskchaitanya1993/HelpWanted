angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var applied = [];
  var accepted = [];
  var rejected = [];
  return {
    allapp: function() {
      return applied;
    },
    allacc: function() {
      return accepted;
    },
    allrej: function() {
      return rejected;
    },
    getapp: function(chatId) {
      return applied[parseInt(chatId)];
    },
    getacc: function(chatId) {
      return accepted[parseInt(chatId)];

    },
    getrej: function(chatId) {
      return rejected[parseInt(chatId)];
    },
    setapp: function (job) {
        applied = job;
    },
    setacc: function (job) {
        accepted = job;
    },
    setrej: function (job) {
        rejected = job;
    }
  };
})

.factory('Jobs', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var jobs;

  return {

    all: function() {
      return jobs;
    },
    remove: function(job) {
      jobs.splice(jobs.indexOf(job), 1);
    },
    get: function(jobId) {
      var i = parseInt(jobId);
          return jobs[i];

    },

    set: function (jobs1) {
        jobs = jobs1;
    }
  };
})


.factory('Data', function () {
var user = {};
return {
    getUser: function () {
        return user;
    },
    setUser: function (userparameter) {
        user = userparameter;
    }
};
})

.factory('Camera', function($q) {

   return {
      getPicture: function(options) {
         var q = $q.defer();

         navigator.camera.getPicture(function(result) {
            q.resolve(result);
         }, function(err) {
            q.reject(err);
         }, options);

         return q.promise;
      }
   }

});
