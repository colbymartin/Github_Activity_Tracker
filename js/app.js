const app = angular.module('TrackerApp', []);

app.controller('UserInputController', function ($scope, GitService) {
    $scope.user_input = '';

    $scope.add = function () {
        GitService.getUser($scope.user_input);
        $scope.user_input='';
    }
});

app.controller('UserListController', function ($scope, GitService) {
    $scope.profiles = GitService.getProfiles();
});

app.factory('GitService', function ($http) {
    let profiles = [];

    return {
        getProfiles() {
            return profiles;
        },

        getUser(user) {
            let profile = {
                handle: null,
                picture: null,
                name: null,
                activity: {
                    week: 0,
                    month: 0,
                    time: 0,
                }
            }
            profiles.push(profile);

            $http.get('https://api.github.com/users/' + user).then(function (response) {
                let log = response.data;

                profile.handle = log.login;
                profile.picture = log.avatar_url;
                profile.name = log.name;

            });
            $http.get('https://api.github.com/users/' + user + '/events?per_page=200').then(function (response) {
                let log = response.data;
                for (let i = 0; i < log.length; i++) {

                    let today = moment(new Date());
                    let eventDate = moment(log[i].created_at);
                    let weekago = moment(today).subtract(7, 'days').calendar();
                    let monthago = moment(today).subtract(1, 'month').calendar();


                    if (moment(eventDate).isBetween(weekago, today)) {
                        profile.activity.week++;
                        profile.activity.month++;
                        profile.activity.time++;
                    } else {
                        if (moment(eventDate).isBetween(monthago, today)){
                            profile.activity.month++;
                            profile.activity.time++;
                        } else {
                            profile.activity.time++;
                        }
                    }

                }
            });
        },
    }
});

app.component('gitProfile', {
    templateUrl: 'templates/profile.html',
    bindings: {
        which: '<',
    },
});

app.component('activity', {
    templateUrl: 'templates/activity.html',
    controller: 'UserListController',
    bindings: {
        which: '<',
    }
})