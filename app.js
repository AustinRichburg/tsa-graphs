/* Sets up the module, the routes, and the user data component */
var app = angular.module("app", ["ngRoute"])
    .config(function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: './home.html',
            activeTab: 'home'
        });
        $routeProvider.when('/claims', {
            templateUrl: './bar-graph/bar.html',
            controller: 'BarCtrl',
            activeTab: 'bar'
        });
        $routeProvider.when('/cost', {
            templateUrl: './line-graph/line.html',
            controller: 'LineCtrl',
            activeTab: 'line'
        });
        $routeProvider.otherwise({
            redirectTo: '/',
            controller: 'MainCtrl'
        });
    })
    .component("userData", {
        templateUrl: "./shared/user-data.html",
        controller: 'MainCtrl'
    });

/* Sets up the main controller. Controls the tabs and the user data form */
app.controller("MainCtrl", function($scope, UpdateService){
    $scope.userData = {};
    $scope.datePattern = /\d{2}\/\d{2}\/\d{4}/;
    $scope.pricePattern = patt;
    $scope.submitUserData = function(data){
        update(data);
        UpdateService.setUpdated();
    }
});

/* The controller used for the bar graph */
app.controller("BarCtrl", function($scope, UpdateService){
    $scope.updated = UpdateService.updated;

    var createGraph = function(){
        console.log("Bar Graph Created");
        initBarGraph();
        drawBarGraph();
    }

    $scope.$watch(function(){
        return UpdateService.updated;
    }, function(newValue){
        if(newValue){
            console.log("updated bar graph!");
            createGraph();
            UpdateService.setUpdated();
        }
    });

    createGraph();
});

/* The controller used for the line graph */
app.controller("LineCtrl", function($scope, UpdateService){
    $scope.updated = UpdateService.updated;

    var createGraph = function(){
        console.log("Line Graph Created");
        initLineGraph();
        drawLineGraph();
    };

    $scope.$watch(function(){
        return UpdateService.updated;
    }, function(newValue){
        if(newValue){
            console.log("updated line graph!");
            createGraph();
            UpdateService.setUpdated();
        }
    });

    createGraph();
});

app.controller("TabCtrl", function($scope, $route){
    $scope.route = $route;
});

/* A service that tells whether the data set has been updated */
app.factory('UpdateService', function(){
    return {
        updated: false,
        setUpdated: function(){
            this.updated = !this.updated;
            console.log("Updated is: " + this.updated);
        }
    }
});

