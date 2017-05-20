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

app.controller('ActivityController', function ($scope, GitService) {

});

app.factory('GitService', function ($http) {
    let profiles = [];
    let activity = [];

    return {
        getProfiles() {
            return profiles;
        },

        getUser(user) {
            $http.get('https://api.github.com/users/' + user).then(function (response) {
                let log = response.data;

                profiles.push({
                    handle: log.login,
                    picture: log.avatar_url,
                    name: log.name,
                })

            });
            $http.get('https://api.github.com/users/' + user + '/events').then(function (response) {
                console.log(response);
                let log = response.data;
                console.log(new Date(Date.now()));
                console.log(new Date(Date.parse(log[0].created_at)));
                console.log(new Date(Date.getDate()));


                // activity.push({
                //     week: '',
                //     month: function (log) {
                //         for (let i = 0; i < log.length; i++) {
                //             console.log('')
                //         }
                //     },
                //     history: '',
                // })

            });
        },
        // getActivity(id){
        //     $http.get('https://api.github.com/users/' + id + '/events').then(function (response) {
        //         console.log(response);
        //     })
        // }
    }
});

app.component('gitProfile', {
    templateUrl: 'templates/profile.html',
    bindings: {
        which: '<',
    },
});