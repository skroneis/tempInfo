mainModule.controller("stoneController", function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;

    var initialize = function () {
        console.log("initialize");
        $scope.getInfos();
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    $scope.getInfos = function () {
        //alert("getInfos");
        console.log("getInfos");
        $scope.isLoading = true;
        //$http.defaults.headers.common["RequestVerificationToken"] = $scope.token;
        console.log("-----------------------------");
        console.log(MyApp.rootPath);
        return $http.get(MyApp.rootPath + 'api/getData', null).then(function (response) {
            //console.log(response.data);
            $scope.infos = response.data;
            $scope.isLoading = false;
        },
            function errorCallback(response) {
                console.log("ERROR");
                // bootbox.alert("ERROR");            
                console.log(response.data);
            });
    };

    setInterval(function () {
        console.log("get....");
        $scope.getInfos();
    }, 1000 * 5) //5 secongs...
});