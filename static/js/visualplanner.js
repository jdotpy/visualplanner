var reports = angular.module('VisualPlanner', []);
reports.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('((');
	$interpolateProvider.endSymbol('))');
});

function getMonthName(timestamp){
	return timestamp.toString().split(' ')[1];
}

function getWeeksBreakdown(weekToStart, numWeeks){
	var startOfWeek = 0;
	var startDay = new Date(weekToStart.getTime());
	while (startDay.getDay() != startOfWeek){
		startDay.setDate(startDay.getDate()-1);
	}
	var weeks = [];
	var currentDay = new Date(startDay.getTime())
	for (var w=0;w<numWeeks;w++){
		var days = [];
		weeks.push({
			"label": "Week " + (w + 1).toString(),
			"days": days,
		});
		for (var d=0;d<7;d++){
			var dateObj = new Date(currentDay.getTime())
			days.push({
				"obj": dateObj,
				"num": d,
				"monthName": getMonthName(dateObj) 
			})
			currentDay.setDate(currentDay.getDate() + 1)
		}
	}
	console.log(weeks);
	return weeks;
}

example_data = {
	'workers': [
		{"label": "Frame 1", "work_rate": 5.2, "work_price": 5.25, "tags": ["work:design"]},
		{"label": "Frame 2", "work_rate": 2.2, "work_price": 5.25, "tags": ["work:design", "work:develop"]},
		{"label": "Frame 3", "work_rate": 5.2, "work_price": 5.25, "tags": ["work:foo", "SD1"]},
		{"label": "Frame 4", "work_rate": 3.2, "work_price": 5.25, "tags": ["SD1"]},
		{"label": "Frame 5", "work_rate": 1.2, "work_price": 5.25, "tags": ["SD2"]},
	],
	'projects': {
		"Project 1": {"work": 500, "tags": ["work:design"]},
		"Project 2": {"work": 500, "tags": ["work:develop"]},
		"Project 3": {"work": 500, "tags": ["work:develop"]},
		"Project 4": {"work": 500, "tags": ["work:develop"]},
	}
}

reports.controller('GanttView', function($scope, $http) {
	$scope.workers = example_data.workers;
	$scope.projects = example_data.projects;
	$scope.assignments = {};

	$scope.weeks = 4;

	$scope.getWorkerAssignments = function(worker){
		return $scope.assignments[worker];
	}
	$scope.renderSchedule = function(){
		$scope.now = new Date();
		$scope.dayWidth = Math.floor((document.getElementById("GanttWrapper").clientWidth / $scope.weeks - 2) / 7);
		$scope.weekWidth = ($scope.dayWidth * 7) + 2;
		console.log('week width:', $scope.weekWidth);
		console.log('day width:', $scope.dayWidth);
		return getWeeksBreakdown($scope.now, $scope.weeks);
	}
	$scope.isCurrentDay = function(timestamp){
		if (
			timestamp.getDate() == $scope.now.getDate() 
			&& timestamp.getMonth() == $scope.now.getMonth() 
			&& timestamp.getYear() == $scope.now.getYear()
		){
			return true;
		} else {
			return false;
		}
	}
	$scope.schedule = $scope.renderSchedule();
	$scope.weekStyle = function(){
		return {'width': $scope.weekWidth + 'px'}
	}
	$scope.dayStyle = function(){
		return {'width': $scope.dayWidth + 'px'}
	}
})
