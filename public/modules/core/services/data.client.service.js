'use strict';
angular.module('core').service('usersService', ['$q',
    function($q) {
 
 
    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
 
    var users = [
        {
            name: 'Personal',
            avatar: 'personal_folder',
        },
        {
            name: 'Starred',
            avatar: 'starred_folder',
        },
        {
            name: 'Trending',
            avatar: 'trending',            
        },
        {
            name: 'Newest',
            avatar: 'new',
        }
    ];
 
    // Promise-based API
    return {
        loadAll : function() {
            // Simulate async nature of real remote calls
            return $q.when(users);
        }
    };
}]);