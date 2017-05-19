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

    // $http.get('https://api.github.com/users/anyweez').then(function (response) {
    //     console.log(response);
    // });

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
        }
    }
});