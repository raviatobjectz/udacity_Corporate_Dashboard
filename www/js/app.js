var app=angular.module('CorporateDashboard', ['ngTable', 'ngMaterial', 'ngMessages']);

app.controller('allTabs', function($scope, $timeout, $interval, $q, NgTableParams) {

  $scope.pageHeading = "XYZ Corporate Dashboard";
  $scope.selectedMenu = 1;
  google.charts.load('current', {packages: ['corechart', 'bar']});
  $scope.homeView = function() {
    $scope.pageHeading = "XYZ Corporate Dashboard";
    $scope.selectedMenu = 1;
   };
  $scope.geoView = function() {
    $scope.pageHeading = "GeoSpatial Employee Counts Dashboard";
    $scope.selectedMenu = 2;
    $timeout($scope.drawMap, 100);
    $interval($scope.drawMap, 5000);
  };
  $scope.metricsView = function() {
    $scope.pageHeading = "Key Metrics Dashboard";
    $scope.selectedMenu = 3;
    $timeout($scope.readCSV, 100);
    $interval($scope.readCSV, 1000);    
  };
  $scope.dataView = function() {
    $scope.pageHeading = "Issue Dashboard";
    $scope.selectedMenu = 4;
    $scope.showDataView();
  };
  $scope.map == null;
  $scope.company = {};
  $scope.customers = new Array();

  $scope.drawMap = function() {
    $.getScript("data/employee.json")
      .done(function() {
          $scope.company = companyVar;
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

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  
  var issueCounts = new Array();
  var customerCounts = new Array();
  
  for (var k = 0; k < month.length; k++) {
    issueCounts[month[k]] = 0;
    customerCounts[month[k]] = 0;
  }

  $scope.readCSV = function() {
    //$scope.openIssuesCount = 0;
    $scope.openIssues = [];
    $scope.closedIssues = [];
    for (var k = 0; k < month.length; k++) {
      issueCounts[month[k]] = 0;
      customerCounts[month[k]] = 0;
    }

    $.ajax({
        type: "GET",
        url: "data/issues.csv",
        dataType: "text",
        success: function(data) {
          var lines = data.split("\n");
          for (var i = 1; i < lines.length; i++) {
            var columns = lines[i].split(',');
            var d = new Date(columns[2]);
            issueCounts[month[d.getMonth()]] = issueCounts[month[d.getMonth()]] + 1;
            if (columns[3] == ' open') {
              $scope.openIssues.push(lines[i])
            } 
            if (columns[3] == ' closed') {
              $scope.closedIssues.push(lines[i])
            }            
          }
          $scope.openIssuesCount = $scope.openIssues.length;
          $scope.drawBarChart();
        }
    });

    $.getScript("data/customer.json").done(function() {
        $scope.customers = customerVar;
        for(var a = 0; a < $scope.customers.length; a++) {
          if ($scope.customers[a].Paying == 'YES') {
            var d1 = new Date($scope.customers[a].Customer_From);
            customerCounts[month[d1.getMonth()]] = customerCounts[month[d1.getMonth()]] + 1;
          }
        }
        $scope.drawLineChart();
    });
  }

  $scope.drawBarChart = function() {
      $scope.data = new google.visualization.DataTable();
      $scope.data.addColumn('string', 'Month');
      $scope.data.addColumn('number', 'Issue Count');
      
      $scope.data.addRows([
        [month[0], issueCounts[month[0]]],
        [month[1], issueCounts[month[1]]],
        [month[2], issueCounts[month[2]]],
        [month[3], issueCounts[month[3]]],
        [month[4], issueCounts[month[4]]]
      ]);

      $scope.options = {
        title: 'Issues over Time',
        hAxis: {
          title: '2016 Issues',
        },
        vAxis: {
          title: '# of issues'
        }
      };
      $scope.chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));
      $scope.chart.draw($scope.data, $scope.options);
  }

  $scope.drawLineChart = function() {
      $scope.data = new google.visualization.DataTable();
      $scope.data.addColumn('string', 'Month');
      $scope.data.addColumn('number', 'Customer Count');
      $scope.data.addRows([
        [month[0], customerCounts[month[0]]],
        [month[1], customerCounts[month[1]]],
        [month[2], customerCounts[month[2]]],
        [month[3], customerCounts[month[3]]],
        [month[4], customerCounts[month[4]]]
      ]);

      $scope.options = {
        title: 'Paying Customers Over Time',
        curveType: 'function',
        hAxis: {
          title: '2016 Paying Customers',
        },
        vAxis: {
          title: '# of Paying Costomers'
        }
      };
      $scope.chart = new google.visualization.LineChart(
        document.getElementById('chart_line'));
      $scope.chart.draw($scope.data, $scope.options);
  }

  $scope.showDataView = function() {
    //alert("I am here");
    $.ajax({
      type: "GET",
      url: "data/issues.csv",
      dataType: "text",
      success: function(fileData) {
        var lines = fileData.split("\n");
        var data = [];
        for (var b = 1; b < lines.length; b++) {
          var columns = lines[b].split(',');
          var rowVar = {
            IssueNumber: parseInt(columns[0]),
            Description: columns[1],
            OpenDate: columns[2],
            Status: columns[3],
            CloseDate: columns[4]
          };
          //alert(rowVar);
          data.push(rowVar);
        }
        $scope.tableParams = new NgTableParams({count: 25}, {dataset: data});
        $scope.$apply();
      }
    });
  }



      
});
