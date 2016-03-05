var app = angular.module('securityApp', ['ui.router'])

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/tasks");
    $stateProvider
        .state('tasks', {
            url: "/tasks",
            templateUrl: "/static/html/task_list.html",
            controller: "TaskListController",
        })

});

app.controller("TaskController", function($scope, $http) {
    $scope.skills = [];
    $http({
        method: 'GET',
        url: "/api/v1/skill/?format=json",
        }).then(function successCallback(response) {
            $scope.skills = response.data.objects;
            $scope.updateSelectedSkills($scope.task, $scope.skills);
        });

    $scope.volunteers = [];
    $http({
        method: 'GET',
        url: "/api/v1/volunteer/?format=json&currently_here=true",
        }).then(function successCallback(response) {
            $scope.volunteers = response.data.objects;
            $scope.updateSelectedVolunteers($scope.task, $scope.volunteers);
        });


    $scope.saveSkills = function(task, skills) {
        task.skills = [];
        for (var i=0; i<skills.length; i++) {
            if (skills[i].selected) {
                task.skills.push(skills[i]);
            }
        }
        $scope.save(task);

    };

    $scope.saveVolunteers = function(task, volunteers) {
        task.volunteers = [];
        for (var i=0; i<volunteers.length; i++) {
            if (volunteers[i].selected) {
                task.volunteers.push(volunteers[i]);
            }
        }
        $scope.save(task);

    };


    $scope.getPrettyDateTime = function(dateString) {
        var date = new Date(Date.parse(dateString));
        var minutes = String(date.getMinutes());
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] + " " + date.getHours() + ":" + minutes;
        
    };

    $scope.save = function(task) {
        $http({
            method: 'PUT',
            url: task.resource_uri,
            data: task,
        });
    };


    $scope.setPriority = function(task, newPriority) {
        task.priority = newPriority;
        $scope.save(task)
   };
    
    $scope.setStatus = function(task, newStatus) {
        task.status = newStatus;
        $scope.save(task)
    };

    $scope.updateSelectedSkills = function(task, allSkills) {
        var taskSkillIds = [];
        for (var i=0; i<task.skills.length; i++) {
            taskSkillIds.push(task.skills[i].id);
        }
        for (var i=0; i<allSkills.length; i++) {
            allSkills[i].selected = $.inArray(allSkills[i].id, taskSkillIds) != -1;
        }
    };

    $scope.updateSelectedVolunteers = function(task, allVolunteers) {
        var taskVolunteerIds = [];
        for (var i=0; i<task.volunteers.length; i++) {
            taskVolunteerIds.push(task.volunteers[i].id);
        }
        for (var i=0; i<allVolunteers.length; i++) {
            allVolunteers[i].selected = $.inArray(allVolunteers[i].id, taskVolunteerIds) != -1;
        }
    };
});

app.controller("TaskListController", function($scope, $http) {
    $scope.tasks = [];
    $http({
        method: 'GET',
        url: "/api/v1/task/?format=json",
        }).then(function successCallback(response) {
            $scope.tasks = response.data.objects;
        });

});

app.directive('task', function() {
    return {
        templateUrl: "/static/html/task.html",
        restrict: 'E',
        scope: {
            task: '=',
        },
    };
});

