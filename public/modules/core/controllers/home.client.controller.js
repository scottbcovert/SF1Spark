'use strict';
 
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
'usersService', '$mdMedia', '$mdSidenav', '$mdDialog', '$mdBottomSheet', '$log',
    function($scope, Authentication, usersService, $mdMedia, $mdSidenav, $mdDialog, $mdBottomSheet, $log) {
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
         * Activate the 'left' sideNav area
         */
        function activateSidenav() {
            self.activeSidenav = true;            
        }

        /**
         * Deactivate the 'left' sideNav area
         */
        function deactivateSidenav() {
            self.activeSidenav = false;            
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

        /**
         * Action Dialog
         */
        function showActionDialog($event) {
            $mdDialog.show({
              controller: DialogController,
              template: '<md-dialog aria-label="Form"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="user.lastName"> </md-input-container> </div> <md-input-container flex> <label>Message</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
              targetEvent: $event,
              clickOutsideToClose: true
            })
            .then(function(answer) {
              $scope.alert = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.alert = 'You cancelled the dialog.';
            });
        };

        /**
         * Dialog Controller
         */
        function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
        };
 
        var self = this;
 
        self.selected           = null;
        self.users              = [ ];
        self.selectUser         = selectUser;
        self.activateSidenav    = activateSidenav;
        self.deactivateSidenav  = deactivateSidenav;
        self.share              = share;
        self.isLargeView        = isLargeView;
        self.sideNavClass       = sideNavClass;
        self.actions = [
            {name: "Mention on Twitter", icon: "twitter", direction: "left" },
            {name: "Post to Facebook", icon: "facebook", direction: "left" },
            {name: "Star on GitHub", icon: "github-circle", direction: "left" }
        ];
        self.showActionDialog = showActionDialog;
 
    }
]);