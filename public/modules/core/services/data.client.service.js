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
            authRequired: true,
        },
        {
            name: 'Starred',
            avatar: 'starred_folder',
            authRequired: true,
        },
        {
            name: 'Trending',
            avatar: 'trending',
            authRequired: false,           
        },
        {
            name: 'Newest',
            avatar: 'new',
            authRequired: false,
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