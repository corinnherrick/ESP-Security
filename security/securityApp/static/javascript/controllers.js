app = angular.module("securityApp.controllers", ['securityApp.services']);

app.controller("TaskController", ["$scope", "$http", "skills", "volunteers", "taskService", "dateUtils", function($scope, $http, skills, volunteers, taskService, dateUtils) {
    $scope.taskService = taskService;

    skills.get({}).then(function(response) {
            $scope.skills = response.data.objects;
            $scope.updateSelectedSkills($scope.task, $scope.skills);
    });

    volunteers.get({currently_here: true}).then(function(response) {
        $scope.volunteers = response.data.objects;
        $scope.updateSelectedVolunteers($scope.task, $scope.volunteers);
    });

    $scope.getPrettyDateTime = dateUtils.getPrettyDateTime;

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
}]);

app.controller("TaskListController", ["$scope", "$http", "skills", function($scope, $http, skills) {
    skills.get({}).then(function(response) {
        $scope.skills = response.data.objects;
    })
    $scope.tasks = [];
    $http({
        method: 'GET',
        url: "/api/v1/task/?format=json",
        }).then(function successCallback(response) {
            $scope.tasks = response.data.objects;
        });
    $scope.filterobject = {
        status: {
            TD: true,
            IP: true,
            CP: false,
            VO: false,
            },
        priority: {
            UR: true,
            ME: true,
            NU: true,
            NI: true,
            },
        skills: {

        },
        time: "future",
    }
    $scope.filterTasks = function(task, index, array) {
        var correctPriority = false;
        var correctStatus = false;
        var correctSkills = true;
        var correctTime = false;
        for (var key in $scope.filterobject.priority) {
            if ($scope.filterobject.priority.hasOwnProperty(key) && 
                $scope.filterobject.priority[key] &&
                task.priority == key) {
                correctPriority = true;
            }
        }
        for (var key in $scope.filterobject.status) {
            if ($scope.filterobject.status.hasOwnProperty(key) && 
                $scope.filterobject.status[key] &&
                task.status == key) {
                correctStatus = true;
            }
        }
        for (var key in $scope.filterobject.skills) {
            if ($scope.filterobject.skills.hasOwnProperty(key) && 
                $scope.filterobject.skills[key]) {
                var taskContainsSkill = false;
                for (var i=0; i<task.skills.length; i++) {
                    if (task.skills[i].name == key) {
                        taskContainsSkill = true;
                    }
                }
                if (!taskContainsSkill) {
                    correctSkills = false;
                }
            }
        }
 
        return correctPriority && correctStatus && correctSkills;
    }

}]);


