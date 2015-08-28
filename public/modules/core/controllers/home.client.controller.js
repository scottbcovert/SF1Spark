'use strict';
 
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
'usersService', 'Sparks', '$mdMedia', '$mdSidenav', '$mdDialog', '$window', '$log',
    function($scope, Authentication, usersService, Sparks, $mdMedia, $mdSidenav, $mdDialog, $window, $log) {
        
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
                if (self.authentication.user){
                  self.selected = users[0];
                }
                else{
                  self.selected = users[2];
                }
            });
 
        // *********************************
        // Internal methods
        // *********************************
 
        /**
         * Builds out spark tile grid
         */
        function buildSparkGrid(sparkTmpl){
          var it,
              results = [ ];
              return Sparks.query({query: null}, function (sparks) {
                for (var j=0; j<sparks.length; j++) {
                  it = angular.extend({},sparkTmpl);
                  it.icon  = 'flash';
                  it.title = sparks[j].name;
                  it.span  = { row : 1, col : 1 };
                  switch(j+1) {
                    case 1:
                      it.background = "red";
                      it.span.row = it.span.col = 2;
                      break;
                    case 2: it.background = "green";         break;
                    case 3: it.background = "darkBlue";      break;
                    case 4:
                      it.background = "blue";
                      it.span.col = 2;
                      break;
                    case 5:
                      it.background = "yellow";
                      it.span.row = it.span.col = 2;
                      break;
                    case 6: it.background = "pink";          break;
                    case 7: it.background = "darkBlue";      break;
                    case 8: it.background = "purple";        break;
                    case 9: it.background = "deepBlue";      break;
                    case 10: it.background = "lightPurple";  break;
                    case 11: it.background = "yellow";       break;
                  }
                  results.push(it);
                }
                self.tiles = results;
              });
          
              
        }

        /**
         * Select the current avatars
         * @param menuId
         */
        function selectUser ( user ) {
            self.selected = angular.isNumber(user) ? $scope.users[user] : user;
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
         * Spark Dialog
         */
        function sparkDialog($event) {
          // Must be logged in to create Sparks
          if (self.authentication.user){
            $mdDialog.show({
              controller: DialogController,
              template: '<md-dialog aria-label="Form"> <md-content class="md-padding"> <form name="sparkForm"> <div layout layout-sm="column"> <md-input-container flex> <label>Spark Name</label> <input ng-model="spark.name"> </md-input-container> <md-input-container flex> <label>Application</label> <input ng-model="spark.application"> </md-input-container> </div> <md-input-container flex> <label>Repository URL</label> <input ng-model="spark.repositoryUrl"> </md-input-container> <md-input-container flex> <label>Description</label> <textarea ng-model="spark.description" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="save()" class="md-primary"> Save </md-button> </div></md-dialog>',
              targetEvent: $event,
              clickOutsideToClose: true
            })
            .then(function() {
              // Saving Spark
            }, function() {
              // Cancelled
            });
          }
          else{
            // Ask user to log in
            var loginRequiredAlert = $mdDialog.alert()
              .title('Oops!')
              .content('You must be logged in to create new Sparks :-)')
              .clickOutsideToClose(true)
              .ok('Close');

            $mdDialog
              .show( loginRequiredAlert )
              .finally(function() {
                loginRequiredAlert = undefined;
              });
          }
        };

        /**
         * Dialog Controller
         */
        function DialogController($scope, $mdDialog) {
          
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.save = function() {
            $mdDialog.hide();
          };
        };

        /**
         * Open New Window
         */
        function openWindow(url, title, w, h) {
          if (w && h){
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);
            $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);  
          }
          else{
            $window.open(url);
          }        
        }
 
        var self = this;

        self.authentication     = Authentication;
        self.selected           = null;
        self.users              = [ ];
        self.selectUser         = selectUser;
        self.activateSidenav    = activateSidenav;
        self.deactivateSidenav  = deactivateSidenav;
        self.isLargeView        = isLargeView;
        self.sideNavClass       = sideNavClass;
        self.openWindow         = openWindow;
        self.actions            = [
                                      {name: "Mention on Twitter", icon: "twitter", direction: "left", windowURL: 'https://twitter.com/intent/tweet?hashtags=SalesforceLightning&original_referer=http%3A%2F%2Fsf1spark.com&ref_src=web&share_with_retweet=never&text=I%27m%20using%20%23SF1Spark%20to%20%23golightningfast%20-%20you%20should%20too!&url=http://sf1spark.com', windowWidth: 600, windowHeight: 250 },
                                      {name: "Post to Facebook", icon: "facebook", direction: "left", windowURL: 'https://www.facebook.com/sharer/sharer.php?u=sf1spark.com', windowWidth: 600, windowHeight: 250 },
                                      {name: "Share on Google+", icon: "google_plus", direction: "left", windowURL: 'https://plus.google.com/share?url=sf1spark.com', windowWidth: 600, windowHeight: 450 },
                                      {name: "Star on GitHub", icon: "github-circle", direction: "left", windowURL: 'https://github.com/scottbcovert/SF1Spark', windowWidth: null, windowHeight: null }
                                  ];
        self.sparkDialog        = sparkDialog;
        buildSparkGrid({});
        
 
    }
]);