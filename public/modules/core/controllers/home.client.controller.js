'use strict';
 
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
'usersService', '$mdMedia', '$mdSidenav', '$mdBottomSheet', '$log',
    function($scope, Authentication, usersService, $mdMedia, $mdSidenav, $mdBottomSheet, $log) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
 
 
        /**
         * Main Controller for the Angular Material Starter App
         * @param $scope
         * @param $mdSidenav
         * @param avatarsService
         * @constructor
         */

        // Load all registered users
 
        usersService
            .loadAll()
            .then( function( users ) {
                self.users    = [].concat(users);
                self.selected = users[0];
            });
 
        // *********************************
        // Internal methods
        // *********************************
 
        /**
         * Select the current avatars
         * @param menuId
         */
        function selectUser ( user ) {
            self.selected = angular.isNumber(user) ? $scope.users[user] : user;
        }
 
        /**
         * Show the bottom sheet
         */
        function share($event) {
            var user = self.selected;
 
            /**
             * Bottom Sheet controller for the Avatar Actions
             */
            function UserSheetController( $mdBottomSheet ) {
                this.user = user;
                this.items = [
                    { name: 'Phone'       , icon: 'phone'       },
                    { name: 'Twitter'     , icon: 'twitter'     },
                    { name: 'Google+'     , icon: 'google_plus' },
                    { name: 'Hangout'     , icon: 'hangouts'    }
                ];
                this.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }
 
            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'modules/core/views/contactSheet.client.view.html',
                controller: [ '$mdBottomSheet', UserSheetController],
                controllerAs: 'vm',
                bindToController : true,
                targetEvent: $event
            }).then(function(clickedItem) {
                $log.debug( clickedItem.name + ' clicked!');
            });
 
 
        }

        /**
         * Show the 'left' sideNav area
         */
        function openSidenav() {
            if (!isLargeView()){
                self.activeSidenav = true;
            }
        }

        /**
         * Show the 'left' sideNav area
         */
        function closeSidenav() {
            if (!isLargeView()){
                self.activeSidenav = false;
            }
        }

        /**
         * Determine CSS class for sidenav
         */
        function sideNavClass(){
            if (self.activeSidenav || isLargeView()){
                return 'expandedSidenav';
            }
            else {
                return '';
            }
        }

        /**
         * Determines if the current media has a large viewport
         */
        function isLargeView(){
            if ($mdMedia('gt-md')){
                return true;
            }
            else {
                return false;
            }
        }
 
        var self = this;
 
        self.selected      = null;
        self.users         = [ ];
        self.selectUser    = selectUser;
        self.openSidenav   = openSidenav;
        self.closeSidenav  = closeSidenav;
        self.share         = share;
        self.isLargeView   = isLargeView;
        self.sideNavClass  = sideNavClass;
 
    }
]);