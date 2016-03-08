app = angular.module("securityApp.controllers", ['securityApp.services']);

app.controller("TaskController", ["$scope", "$http", "skills", "volunteers", "taskService", "dateUtils", function($scope, $http, skills, volunteers, taskService, dateUtils) {
    $scope.taskService = taskService;

    $(setTimeout(function() {
        $scope.minpicker = $('#mindatetimepicker' + $scope.task.id)
        $scope.minpicker.datetimepicker({
            sideBySide: true,
        });
        $scope.maxpicker = $('#maxdatetimepicker' + $scope.task.id)
        $scope.maxpicker.datetimepicker({
            sideBySide: true,
        });

        $scope.maxpicker.data("DateTimePicker").date(new Date(Date.parse($scope.task.max_time)));
        $scope.minpicker.data("DateTimePicker").date(new Date(Date.parse($scope.task.min_time)));
        $scope.maxpicker.on("dp.change", function() {
            $scope.task.max_time = dateUtils.getDateForPost($scope.maxpicker.find("input").val());
        });
         $scope.minpicker.on("dp.change", function() {
            $scope.task.min_time = dateUtils.getDateForPost($scope.minpicker.find("input").val());
        });
     }, 500));
 
    $scope.editTimes = function() {
        $scope.editTime = true;
        
    };

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

app.controller("TaskAddController", ["$scope", "$timeout", "skills", "taskService", "$http", "dateUtils", function($scope, $timeout, skills, taskService, $http, dateUtils) {
    skills.get({}).then(function(response) {
        $scope.skills = response.data.objects;
    })

    $scope.newTask = {};
 

    $($timeout(function() {
        $scope.minpicker = $('#mindatetimepickeradd')
        $scope.minpicker.datetimepicker({
            sideBySide: true,
        });
        $scope.maxpicker = $('#maxdatetimepickeradd')
        $scope.maxpicker.datetimepicker({
            sideBySide: true,
        });

        $scope.maxpicker.on("dp.change", function() {
            $scope.newTask.max_time = dateUtils.getDateForPost($scope.maxpicker.find("input").val());
        });
 
        $scope.minpicker.on("dp.change", function() {
            $scope.newTask.min_time = dateUtils.getDateForPost($scope.minpicker.find("input").val());
        });
    }, 500));

    $scope.taskskills = {};
    
    $scope.clearForm = function() {
            $scope.newTask = {};
            $scope.minpicker.data("DateTimePicker").clear();
            $scope.maxpicker.data("DateTimePicker").clear();
 
    }
    $scope.addTask = function() {
        var skillMap = {};
        for (var i=0; i<$scope.skills.length; i++) {
            var tempSkill = $scope.skills[i];
            skillMap[tempSkill.name] = tempSkill;
        }
            
        $scope.newTask.skills = [];
        for (var skill in $scope.taskskills) {
            if ($scope.taskskills[skill]) {
                $scope.newTask.skills.push('/api/v1/skill/' + skillMap[skill].id + '/');
            }
        }
        $http({
            method: 'POST',
            url: "/api/v1/task/?format=json",
            data: $scope.newTask,
        }).success(function(response) {
           window.dispatchEvent(new Event('newtask'));
            $scope.clearForm();
            $scope.validationErrors = undefined;
        }).error(function(response) {
            $scope.validationErrors = response.error_message;
        });
    }

}]);

app.controller("TaskListController", ["$scope", "$timeout", "$http", "skills", "dateUtils", function($scope, $timeout, $http, skills, dateUtils) {
    skills.get({}).then(function(response) {
        $scope.skills = response.data.objects;
    })
    $scope.tasks = [];
    $scope.refreshTaskList = function() {
        $http({
            method: 'GET',
            url: "/api/v1/task/?format=json",
            }).then(function successCallback(response) {
                $scope.tasks = response.data.objects;
            });
    }
    $scope.refreshTaskList();
    window.addEventListener('newtask', function(e) {
        $scope.refreshTaskList(); 
        $scope.showaddtaskform=false; 
        $scope.showtaskaddedalert=true;
        $timeout(function() {
            $scope.showtaskaddedalert=false;
            console.log("hi");
        }, 5000);
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
        time: "futuretoday",
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

        var diffTime = dateUtils.timeUntil(task.min_time);
        if ($scope.filterobject.time == "next10") {
            correctTime = diffTime.days == 0 && 
                          diffTime.hours == 0 && 
                          diffTime.minutes >= 0 && 
                          diffTime.minutes < 10;
        } else if ($scope.filterobject.time == "next30") {
            correctTime = diffTime.days == 0 &&
                          diffTime.hours == 0 &&
                          diffTime.minutes >= 0 &&
                          diffTime.minutes < 30;
        } else if ($scope.filterobject.time == "next60") {
            correctTime = diffTime.days == 0 &&
                          diffTime.hours == 0 &&
                          diffTime.minutes >= 0 &&
                          diffTime.minutes < 60;
        } else if ($scope.filterobject.time == "futuretoday") {
            correctTime = diffTime.days == 0 &&
                          diffTime.hours >= 0 &&
                          diffTime.minutes >= 0;
        } else if ($scope.filterobject.time == "today") {
            correctTime = diffTime.days == 0;
        } else if ($scope.filterobject.time == "future") {
            correctTime = diffTime.days >= 0 &&
                          diffTime.hours >= 0 &&
                          diffTime.minutes >= 0;
        } else if ($scope.filterobject.time == "all") {
            correctTime = true;
        } else {
            console.log("Unknown time filter name: " + $scope.filterObject.time);
        }
 
        return correctPriority && correctStatus && correctSkills && correctTime;
    }

}]);


