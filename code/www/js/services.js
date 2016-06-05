angular.module('songhop.services', [])
    .factory('User', function() {

        var o = {
            favorites: []
        }

        o.addSongToFavorites = function(song) {
            // make sure there's a song to add
            if (!song) return false;

            // add to favorites array
            o.favorites.unshift(song);
        }

        o.removeSongFromFavorites = function(song, index) {
            // make sure there's a song to add
            if (!song) return false;

            // add to favorites array
            o.favorites.splice(index, 1);
        }

        return o;
    })

.factory('Recommendations', function($http, $q, SERVER) {
    var o = {
        queue: []
    };

    // Music playing var
    var media;

    // Music playing stuff - WARNING: may not be audio only
    // user may refresh in favorites tab and then return to discover
    /*
      When you tap on the favorites page, the current song will now pause.
      But when you go back to the discover page, the song won't resume.
      We could just fire Recommendations.playCurrentSong() for on-deselect,
      but that method assumes that there is at least one song in our queue,
      which is not a good assumption.

      For example, what if the user is on the favorites page, refreshes, and then goes to the Discover page?
      playCurrentSong would throw an error trying to call play() on a nonexistent audio object.

      !!! First line of discover controller changed from Recommendations.getNextSongs() to Recommendations.init()
    */
    o.init = function() {
      if (o.queue.length === 0) {
        // if there's nothing in the queue, fill it.
        // this also means that this is the first call of init.
        return o.getNextSongs();

      } else {
        // otherwise, play the current song
        return o.playCurrentSong();
      }
    }

    o.getNextSongs = function() {
      return $http({
        method: 'GET',
        url: SERVER.url + '/recommendations'
      }).success(function(data){
        // merge data into the queue
        o.queue = o.queue.concat(data);
      });
    }

    o.nextSong = function() {
      // pop the index 0 off
      o.queue.shift();

      // Music playing stuff
      o.haltAudio();

      // low on the queue? lets fill it up
      if (o.queue.length <= 3) {
        o.getNextSongs();
      }

    }

    // Music playing stuff
    o.playCurrentSong = function() {
      var defer = $q.defer();

      // play the current song's preview
      media = new Audio(o.queue[0].preview_url);

      // when song loaded, resolve the promise to let controller know.
      media.addEventListener("loadeddata", function() {
        defer.resolve();
      });

      media.play();

      return defer.promise;
    }

    // used when switching to favorites tab
    o.haltAudio = function() {
      if (media) media.pause();
    }

    return o;
});
