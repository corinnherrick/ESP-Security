var app = angular.module('securityApp', ['ui.router', 'securityApp.controllers'])

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/tasks");
    $stateProvider
        .state('tasks', {
            url: "/tasks",
            templateUrl: "/static/html/task_list.html",
            controller: "TaskListController",
        })
        .state('addTask', {
            url: "/tasks/add",
            templateUrl: "/static/html/task_edit.html",
            controller: "TaskAddController",
        })

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
app.directive('taskform', function() {
    return {
        templateUrl: "/static/html/task_edit.html",
        restrict: 'E',
        scope: {
        },
    };
});

