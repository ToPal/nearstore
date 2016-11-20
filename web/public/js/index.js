"use strict";

var nearstore_api = 'http://api.nearstore.ru';

angular.module('nsApp', ['ngCookies'])
.controller('rtController', ['$scope', '$cookies', '$http', '$interval',
                            function($scope, $cookies, $http, $interval) {
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
    $scope.orders = [];
    $scope.goods = {};

    $scope.getGoods = function() {
        if (!$scope.uid){
            return;
        }
        $http.get(nearstore_api + '/getGoods', {params: {
            companyID: $scope.uid
        }}).then((res) => {
            if (res.data.error) {
                $scope.status = 'error occured!';
                console.log(res.data.error);
                return;
            }
            let data = res.data.result;
            data.forEach(good => {
                $scope.goods[good._id] = good;
            });
        });
    };
    $scope.getGoods();

    $scope.getOrders = function() {
        if (!$scope.login || !$scope.pass || !$scope.uid) {
            return;
        }
        $http.get(nearstore_api + '/getOrders', {params: {
            username: $scope.login,
            password: $scope.pass,
        }}).then((res) => {
            if (res.data.error) {
                $scope.status = 'error occured!';
                console.log(res.data.error);
                return;
            }
            let data = res.data.result;
            while ($scope.orders.length > 0) $scope.orders.pop();
            data.forEach(order => {
                order.goods = order.goods.map(good => {
                    let _good = $scope.goods[good];
                    if (_good) return `₽${_good.price} ${_good.name} (${_good.desc})`;
                    else return `No data for ${good}`;
                });
                $scope.orders.push(order);
            });
        });
    };
    $interval($scope.getOrders, 1000);
    $interval($scope.getGoods, 5000);
    $scope.acceptOrder = function (order) {
        $http.get(nearstore_api + '/accomplishOrder', {params: {
            orderID: order._id,
            username: $scope.login,
            password: $scope.pass,
        }}).then((res) => {
            if (res.data.error) {
                $scope.status = 'error occured!';
                console.log(res.data.error);
                return;
            }
            $scope.getOrders();
        });
    }
}]);