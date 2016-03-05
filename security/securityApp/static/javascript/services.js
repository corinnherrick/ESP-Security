app = angular.module("securityApp.services", []);

app.factory('skills', function($http) {
    return {
        get: function(params) {
            return $http.get("/api/v1/skill/?format=json", {params: params});
        }
    };

});

app.factory('volunteers', function($http) {
    return {
        get: function(params) {
            return $http.get("/api/v1/volunteer/?format=json", {params: params});
        }
    };

});

app.factory('dateUtils', function() {
    var getPrettyDateTime = function(dateString) {
        var date = new Date(Date.parse(dateString));
        var minutes = String(date.getMinutes());
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] + " " + date.getHours() + ":" + minutes;
        
    };

    return {
        getPrettyDateTime: getPrettyDateTime,
    };
})


app.factory('taskService', function($http) {

    var save = function(task) {
            $http({
                method: 'PUT',
                url: task.resource_uri,
                data: task,
            });
        };

    var saveSkills = function(task, skills) {
            task.skills = [];
            for (var i=0; i<skills.length; i++) {
                if (skills[i].selected) {
                    task.skills.push(skills[i]);
                }
            }
            save(task);
        };

    var saveVolunteers = function(task, volunteers) {
        task.volunteers = [];
        for (var i=0; i<volunteers.length; i++) {
            if (volunteers[i].selected) {
                task.volunteers.push(volunteers[i]);
            }
        }
        save(task);

    };




    return {
        save: save,
        saveSkills: saveSkills,
        saveVolunteers: saveVolunteers,
    };



});
