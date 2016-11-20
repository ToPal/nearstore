"use strict";

var nearstore_api = 'http://api.nearstore.ru';

angular.module('nsApp', ['ngCookies'])
.controller('authController', ['$scope', '$cookies', '$http', function($scope, $cookies, $http) {
    $scope.status = '';
    $scope.process = 'login';
    $scope.yaAccount = '';
    var authData = $cookies.getObject('authData');
    if (authData&&authData.login&&authData.pass&&authData.uid) {
        $scope.login = authData.login;
        $scope.pass = authData.pass;
        $scope.uid = authData.uid;
        $scope.company = authData.company;
    } else {
        $scope.login = '';
        $scope.pass = '';
        $scope.uid = '';
        $scope.company = '';
    }
    function auth_complete(res) {
        if (res.data.error)
            return $scope.status = res.data.error;
        $scope.status = '';
        $scope.process = 'login';
        res = res.data.result;
        $scope.uid = res._id;
        $scope.company = res.company;
        $cookies.putObject('authData', {login: $scope.login, pass: $scope.pass, uid: $scope.uid, company: $scope.company});
    }
    $scope.auth = function() {
        $scope.status = 'Авторизация...';
        $http.get(nearstore_api+'/auth', {params: {
            username: $scope.login,
            password: $scope.pass
        }}).then(auth_complete);
    };
    $scope.logout = function() {
        $cookies.remove('authData');
        $scope.login = '';
        $scope.pass = '';
        $scope.uid = '';
        $scope.company = '';
        $scope.yaAccount = '';
    };
    $scope.setProcess = function(process) {
        $scope.process = process;
        if (process=='register' && !map)
            createMap();
    };
    $scope.register = function() {
        let coordinates = getCoordinates();
        console.log($scope.login, $scope.pass, $scope.company);
        if (!$scope.login || !$scope.pass || !$scope.company)
            return alert('Введены не все данные для регистрации');
        if (!coordinates)
            return alert('Выберите место нахождения вашего магазина');
        $scope.status = 'Registering...';
        console.log(typeof coordinates);
        $http.post(nearstore_api+'/register', {
            username: $scope.login,
            password: $scope.pass,
            company: $scope.company,
            coordinates: coordinates,
            yaAccount: $scope.yaAccount
        }).then(auth_complete);
    };
}]);