var app = angular.module("app", ["ngRoute"])
    .config(function($routeProvider){
        $routeProvider.when('/claims', {
            templateUrl: 'bar.html',
            controller: 'BarCtrl'
        });
        $routeProvider.when('/cost', {
            templateUrl: 'line.html',
            controller: 'LineCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/',
            controller: 'MainCtrl'
        });
    });

app.controller("MainCtrl", function($scope){
    $scope.activeTab = -1;
    var tabs = document.body.querySelectorAll(".nav-link");
    $scope.$watch('activeTab', function(newValue, oldValue, scope){
        if(scope.activeTab != -1){
            tabs.forEach(function(tab){
                tab.classList.remove("active");
            });
            tabs[scope.activeTab].classList.add('active');
        }
    });
});

app.controller("BarCtrl", function($scope){
    var createGraph = function(){
        console.log("Bar Graph Created");
        initBarGraph();
        createBarGraph();
    }

    createGraph();
});

app.controller("LineCtrl", function($scope){
    var createGraph = function(){
        console.log("Line Graph Created");
        initLineGraph();
        createLineGraph();
    };

    createGraph();
});
