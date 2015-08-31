'use strict';

angular.module('sparks').controller('SparksController', ['$scope', 'Authentication', 'Sparks', '$mdDialog',
	function($scope, Authentication, Sparks, $mdDialog) {
		
		/**
         * Spark Dialog
         */

        var errorAlert = function(errorMessage) {
            return $mdDialog.alert()
              .title('Oops!')
              .content(errorMessage)
              .clickOutsideToClose(true)
              .ok('Close');
        };

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
              $mdDialog.hide();
            }, function() {
              // Cancelled
            });
          }
          else{
            // Ask user to log in
            
            $mdDialog
              .show( errorAlert('You must be logged in to create new Sparks :-)') );
          }
        }

        /**
         * Dialog Controller
         */
        function DialogController($scope, $mdDialog) {
          
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.save = function() {
            var spark = new Sparks ($scope.spark);
            spark.$save(function(response) {
            	// Success
            }, function(errorResponse) {
            	// Error
              $mdDialog
                .show( errorAlert(errorResponse.data.message) );
            });
          };
        }

        var self = this;
        self.authentication     = Authentication;
        self.sparkDialog 		= sparkDialog;

	}
]);