var app=angular.module('CorporateDashboard', ['ngMaterial', 'ngMessages']);

app.controller('allTabs', function($scope, $timeout, $interval, $q) {
  $scope.pageHeading = "Corporate Dashboard Home";
  $scope.selectedMenu = 1;
  $scope.homeView = function() {
    $scope.pageHeading = "Corporate Dashboard Home";
    $scope.selectedMenu = 1;
  };
  $scope.geoView = function() {
    $scope.pageHeading = "GeoSpatial Employee Counts Dashboard";
    $scope.selectedMenu = 2;
    $timeout($scope.drawMap, 100);
    //$interval($scope.drawMap, 1000);
  };
  $scope.metricsView = function() {
    $scope.pageHeading = "Key Metrics Dashboard";
    $scope.selectedMenu = 3;
    $timeout($scope.readCSV, 100);
  };
  $scope.dataView = function() {
    $scope.pageHeading = "Data View Dashboard";
    $scope.selectedMenu = 4;
  };
  $scope.map == null;
  $scope.company = {};

  $scope.drawMap = function() {
    $.getScript("data/employee.json")
      .done(function() {
          $scope.company = companyVar;
          alert($scope.company);
          alert($scope.company.employees);
          if ($scope.map == null) {
            $scope.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 1,
                    center: new google.maps.LatLng(0, 0),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
            });
          } 
          var markerClusterer = null;
          $scope.markers = [];
          for (i = 0; i < $scope.company.employees.length; i++){
            for (j = 0; j < $scope.company.employees[i].Count; j++) {
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.company.employees[i].LAT, $scope.company.employees[i].LON),
                draggable: true
              });
              $scope.markers.push(marker); 
            }
          }
          markerClusterer = new MarkerClusterer($scope.map, $scope.markers, {
              styles: [{
                  url: 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/pin.png',
                  height: 48,
                  width: 30,
                  anchor: [-18, 0],
                  textColor: '#ffffff',
                  textSize: 10,
                  iconAnchor: [15, 48]
              }]
          });
     });
  };
  $scope.openIssues = [];
  $scope.closedIssues = [];
  $scope.openIssuesCount = 0;

  $scope.readCSV = function() {
    $scope.openIssues = [];
    $scope.closedIssues = [];
    $.ajax({
        type: "GET",
        url: "data/issues.csv",
        dataType: "text",
        success: function(data) {
          var lines = data.split("\n");
          for (var i = 1; i < lines.length; i++) {
            var columns = lines[i].split(',');
            if (columns[3] == ' open') {
              $scope.openIssues.push(lines[i])
            } 
            if (columns[3] == ' closed') {
              $scope.closedIssues.push(lines[i])
            }            
          }
          $scope.openIssuesCount = $scope.openIssues.length;
          //$scope.$apply();

        }
     });
  }
      
});
