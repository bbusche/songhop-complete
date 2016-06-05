angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
    // get our first songs
    Recommendations.getNextSongs()
      .then(function(){
        $scope.currentSong = Recommendations.queue[0];
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
    }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
    // get the list of our favorites from the user service
    $scope.favorites = User.favorites;

    $scope.removeSong = function(song, index) {
        User.removeSongFromFavorites(song, index);
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope) {

});
