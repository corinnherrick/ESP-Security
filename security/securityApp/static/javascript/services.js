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

    var timeUntil = function(dateString) {
        var today = new Date();
        var newDate = new Date(Date.parse(dateString));
        // This does not handle the case where one day of the program is in a different month than another.
        var diffDays = newDate.getDate() - today.getDate();
        var diffHrs = newDate.getHours() - today.getHours();
        var diffMins = newDate.getMinutes() - today.getMinutes();
        return {
            days: diffDays,
            hours: diffHrs,
            minutes: diffMins,
        }
    }

    var twodigits = function(number) {
        if (number < 10) {
            return "0" + number;
        } else {
            return number;
        }
    }

    var getDateForPost = function(datestring) {
            var date = new Date(Date.parse(datestring));
            var hours = date.getHours() + 5;
            var days = date.getDate();
            if (hours > 24) {
                hours = hours - 24;
                days = days + 1;
            }
            return date.getFullYear() + "-" + 
                    twodigits(date.getMonth() + 1) + "-" + 
                    twodigits(days) + "T" + 
                    twodigits(hours) + ":" + 
                    twodigits(date.getMinutes()) + ":" + 
                    twodigits(date.getSeconds());
 
    }

    return {
        getPrettyDateTime: getPrettyDateTime,
        timeUntil: timeUntil,
        getDateForPost: getDateForPost,
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
