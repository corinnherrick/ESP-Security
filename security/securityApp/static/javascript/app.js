var app = angular.module('securityApp', ['ui.router', 'securityApp.controllers'])

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/tasks");
    $stateProvider
        .state('tasks', {
            url: "/tasks",
            templateUrl: "/static/html/task_list.html",
            controller: "TaskListController",
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

