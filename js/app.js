var app=angular.module('EventPlanner', ['focus-if','ngMaterial','firebase', 'ngMessages']);

app.controller('allTabs', function($scope, $rootScope, $firebaseObject, $mdToast, $document, $timeout, $q, $element) {
  var ref = new Firebase("https://mini-me.firebaseio.com/USERS");
  $scope.data = $firebaseObject(ref);
  $scope.tabHeading1 = "Login";
  $scope.tabHeading2 = "Create Event";
  $scope.tabHeading3 = "Events";
  $scope.tab2Disabled = true;
  $scope.showCard = false;
  $scope.eventtypes = ['Birthday','Anniversary','Pool Party','SuperBowl','Fantasy Football','Meeting','Office','Soccer','Meetup','Event','Seminar','Conference','Bootcamp'];
  $scope.varB = false;
  $scope.varD = true;
  $scope.varE = false;
  $scope.login = false;
  $scope.user = {}
  $scope.myevent = {};
  $scope.showEvent = {};
  $scope.myevents = [];
  $scope.editEvent = false;
  $scope.editEventName = "";
  $scope.sdateflag = true;
  $scope.edateflag = true;
  $scope.focusInput = 0;
  $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });
  $scope.loginUser = function() {
    if ($scope.user.username in $scope.data) {
      if ($scope.data[$scope.user.username].password == $scope.user.password) {
        $scope.tabHeading1 = "Logged In";
        $scope.user = $scope.data[$scope.user.username]
        $scope.myevents = [];
        var i = 0;
        for(var index in $scope.user.myevents){
          i++;
          $scope.myevents.push($scope.user.myevents[index]);
        }
        $scope.login = true;
        $scope.tab2Disabled = false;
        if (i == 0) {
          $scope.selectedIndex = 1;
        } else {
          $scope.selectedIndex = 2;
        }
        $scope.showCard = false;
      } else {
          alert("Incorrect Password");
      }
    } else {
      alert("Incorrect Username/Password");
    }
  };
  $scope.logoutUser = function() {
        $scope.user = {};
        $scope.tabHeading1 = "Login";
        $scope.login = false;
        $scope.tab2Disabled = true;
        $scope.data = $firebaseObject(ref);
  };

  $scope.createUser = function() {
        $scope.varC = $scope.user;
        ref.child($scope.user.username).update($scope.user, function() {
          $scope.varB = false;
          $scope.varD = true;
          $scope.varE = false;
          $scope.tabHeading1 = "Logged In";
          $scope.login = true;
          $scope.tab2Disabled = false;
          $scope.showCard = false;
          $scope.selectedIndex = 1;
          $scope.data = $firebaseObject(ref);
          $scope.$apply();
        });
        $scope.$apply();
  };
  $scope.createEvent = function(eventItem) {
        $scope.showCard = false;
        var fireref = "https://mini-me.firebaseio.com/USERS/"+$scope.user.username+"/myevents/"+eventItem.eventname+"/";
        var ref2 = new Firebase(fireref);
        eventItem.startdate = eventItem.sdatetime.toDateString();
        eventItem.enddate = eventItem.edatetime.toDateString();
        eventItem.starttime = eventItem.sdatetime.toTimeString();
        eventItem.endtime = eventItem.edatetime.toTimeString();
        if('notes' in eventItem) {

        } else {
          eventItem.notes = " ";
        }
        if('address' in eventItem) {

        } else {
          eventItem.address = " ";
        }
        if('city' in eventItem) {

        } else {
          eventItem.city = " ";
        }
        if('state' in eventItem) {

        } else {
          eventItem.state = " ";
        }
        ref2.set({
          eventname: eventItem.eventname,
          startdate: eventItem.startdate,
          enddate: eventItem.enddate,
          starttime: eventItem.starttime,
          endtime: eventItem.endtime,
          address: eventItem.address,
          city: eventItem.city,
          state: eventItem.state,
          eventhost: eventItem.eventhost,
          eventtype: eventItem.eventtype,
          guestlist: eventItem.guestlist,
          notes: eventItem.notes
        }, function(error) {
            if (error) {
              $scope.OUTPUT = error;
            } else {
              $scope.selectedIndex = 2;
              var ref3 = new Firebase("https://mini-me.firebaseio.com/USERS");
              $scope.newdata1 = $firebaseObject(ref3);
              setTimeout(function(){
                $scope.newuser1 = $scope.newdata1[$scope.user.username]
                $scope.myevents = [];
                for(var index in $scope.newuser1.myevents){
                  $scope.myevents.push($scope.newuser1.myevents[index]);
                  $scope.$apply();
                }
              },1000);
            }
        });
        $scope.$apply();
  };

  $scope.updateClick = function() {
    $scope.varB = false;
    $scope.varD = false;
    $scope.varE = true;
    $scope.$apply();
  };

  $scope.openCard = function(eventItem) {
    $scope.showEvent = eventItem;
    $scope.showEvent.guestlistJSON = JSON.stringify($scope.showEvent.guestlist).replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "").replace(/\,/g, ", ");
    $scope.showCard = true;
    $scope.$apply();
  };

  $scope.editCard = function(showEvent) {
    $scope.myevent = showEvent;
    $scope.myevent.sdatetime = new Date(showEvent.startdate+" "+showEvent.starttime);
    $scope.myevent.edatetime = new Date(showEvent.enddate+" "+showEvent.endtime);
    $scope.editEvent = true;
    $scope.tabHeading2 = "Edit Event";
    $scope.selectedIndex = 1;
    $scope.$apply();
  };

  $scope.deleteCard = function(showEvent) {
    $scope.myevent = showEvent;
    var refString = "https://mini-me.firebaseio.com/USERS/"+$scope.user.username+"/myevents/"+$scope.myevent.eventname+"/";
    var removeRef = new Firebase(refString);
    removeRef.remove();
    for(var index in $scope.myevents){
      if ($scope.myevents[index].eventname == $scope.myevent.eventname) {
        $scope.myevents.splice(index,1);
      }
    }
    $scope.showCard = false;
    $scope.$apply();
  };

  $scope.closeCard = function() {
    $scope.showCard = false;
    $scope.$apply();
  };

  $scope.checksDate = function(dtVar) {
    currentDt = new Date();
    var error = 0;
    if(typeof dtVar == "undefined") {
      error = 1;
      $scope.sTooltipString = "Incorrect Start DateTime Fromat";
      $scope.sdateflag = false;
    } else {
      if (currentDt > dtVar) {
        error = 1;
        $scope.sTooltipString = "Start Date cannot be in the past";
        $scope.sdateflag = false;
      }
    }
    if (error == 0) {
      $scope.sTooltipString = "Start Date Valid";
      $scope.sdateflag = true;
    } else {
      $mdToast.show(
        $mdToast.simple()
          .textContent($scope.sTooltipString)
          .position("top right")
          .hideDelay(3000)
      );
    }
  }

  $scope.checkeDate = function(dtVar) {
    currentDt = new Date();
    sDate = $scope.myevent.sdatetime;
    var error = 0;
    if(typeof dtVar == "undefined") {
      error = 1;
      $scope.sTooltipString = "Incorrect End DateTime Fromat";
      $scope.edateflag = false;
    } else {
      if (currentDt > dtVar) {
        error = 1;
        $scope.sTooltipString = "End Date cannot be in the past";
        $scope.edateflag = false;
      }
      if (sDate > dtVar) {
        error = 1;
        $scope.sTooltipString = "End Date cannot be before start date";
        $scope.edateflag = false;
      }
    }
    if (error == 0) {
      $scope.sTooltipString = "Start Date Valid";
      $scope.edateflag = true;
    } else {
      $mdToast.show(
        $mdToast.simple()
          .textContent($scope.sTooltipString)
          .position("top right")
          .hideDelay(3000)
      );
    }
  }

  $scope.$watch('selectedIndex', function(current, old) {
    if (current == 1 && $scope.editEvent == false) {
      $scope.myevent = {};
      $scope.myevent.eventname = "";
      $scope.myevent.guestlist = [];
      $scope.myevent.eventhost = $scope.user.firstname+" "+$scope.user.lastname;
      $scope.myevent.address = $scope.user.address;
      $scope.myevent.city = $scope.user.city;
      $scope.myevent.state = $scope.user.state;
      $scope.myevent.guestlist.push($scope.user.email);
    }
    if (current == 0) {
      $scope.editEvent = false;
    }
    if (current == 2) {
      $scope.editEvent = false;
      $scope.tabHeading2 = "Create Event";

    }
    $scope.$apply();
  });
});
