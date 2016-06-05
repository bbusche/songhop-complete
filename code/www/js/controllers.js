angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
    // helper functions for loading
    var showLoading = function() {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i>',
        noBackdrop: true
      });
    }

    var hideLoading = function() {
      $ionicLoading.hide();
    }

    // set loading to true first time while we retrieve songs from server.
    showLoading();

    // get our first songs
    Recommendations.init()
      .then(function(){
        $scope.currentSong = Recommendations.queue[0];
        // Music playing stuff
        return Recommendations.playCurrentSong();
      })
      .then(function(){
        // turn loading off
        hideLoading();
        $scope.currentSong.loaded = true;
      });

    // initialize the current song
    // $scope.currentSong = angular.copy($scope.songs[0]);

    // fired when we favorite / skip a song.
    $scope.sendFeedback = function(bool) {
        if (bool) User.addSongToFavorites($scope.currentSong);
        // set variable for the correct animation sequence
        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;

        // prepare the next song
        Recommendations.nextSong();

        $timeout(function() {
            // $timeout to allow animation to complete before changing to next song
            // set the current song to one of our three songs
            // var randomSong = Math.round(Math.random() * ($scope.songs.length - 1));

            // update current song in scope
            // $scope.currentSong = angular.copy($scope.songs[randomSong]);
            $scope.currentSong = Recommendations.queue[0];
        }, 250);

        // Music playing stuff
        Recommendations.playCurrentSong().then(function() {
          $scope.currentSong.loaded = true;
        });
    }

    // used for retrieving the next album image.
    // if there isn't an album image available next, return empty string.
    $scope.nextAlbumImg = function() {
      if (Recommendations.queue.length > 1) {
        return Recommendations.queue[1].image_large;
      }

      return '';
    }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User) {
    // get the list of our favorites from the user service
    $scope.favorites = User.favorites;

    $scope.removeSong = function(song, index) {
        User.removeSongFromFavorites(song, index);
    }

    $scope.openSong = function(song) {
      $window.open(song.open_url, "_system");
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
    // Music Playing stuff - stop audio when going to favorites page
    $scope.enteringFavorites = function() {
      User.newFavorites = 0;
      Recommendations.haltAudio();
    }

    $scope.leavingFavorites = function() {
      Recommendations.init();
    }

    $scope.favCount = User.favoriteCount;
});
