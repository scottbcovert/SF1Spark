'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
        '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($locationProvider, $mdThemingProvider, $mdIconProvider) {
        $locationProvider.hashPrefix('!');
 
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('deep-orange');
 
        // Register the user `avatar` icons
        $mdIconProvider
            .defaultIconSet('./assets/svg/avatars.svg', 128)
            .icon('menu'                                           , './assets/svg/menu.svg'                   , 24)
            .icon('share'                                          , './assets/svg/share.svg'                  , 24)
            .icon('google_plus'                                    , './assets/svg/google_plus.svg'            , 512)
            .icon('hangouts'                                       , './assets/svg/hangouts.svg'               , 512)
            .icon('twitter'                                        , './assets/svg/twitter_box.svg'            , 512)
            .icon('phone'                                          , './assets/svg/phone.svg'                  , 512)
            .icon('flash'                                          , './assets/svg/flash.svg'                  , 24)
            .icon('personal_folder'                                , './assets/svg/personal_folder.svg'        , 24)
            .icon('starred_folder'                                 , './assets/svg/starred_folder.svg'         , 24)
            .icon('trending'                                       , './assets/svg/trending.svg'               , 24)
            .icon('new'                                            , './assets/svg/new.svg'                    , 24)
            .icon('add'                                            , './assets/svg/add.svg'                    , 24)
            .icon('github-circle'                           , './assets/svg/github-circle.svg'                 , 24)
            .icon('heart'                                           , './assets/svg/heart.svg'                 , 24)
            .icon('heart-outline'                           , './assets/svg/heart-outline.svg'                 , 24)
            .icon('twitter'                                       , './assets/svg/twitter.svg'                 , 24)
            .icon('facebook'                                     , './assets/svg/facebook.svg'                 , 24)
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});