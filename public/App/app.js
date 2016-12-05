var commonModule = angular.module('common', []);
var mainModule = angular.module('main', ['common', 'ngRoute', 'ngTouch', 'ui.bootstrap']);

commonModule.factory('viewModelHelper', function ($http, $q, $window, $location) { return MyApp.viewModelHelper($http, $q, $window, $location); });

mainModule.controller("TimeCtrl", function ($scope, $timeout) {
    //alert("HI");
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000; //ms
    var tick = function () {
        $scope.clock = Date.now(); // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }
    // Start the timer
    $timeout(tick, $scope.tickInterval);
});


//TODO: move to own js file
//SiteNotiifcation View 
//mainModule.controller('siteNotificationCtrl', function ($scope, viewModelHelper) {
//    $scope.init = function (token) {
//        $scope.token = token;
//        // initialize();
//    }


//    //var initialize = function () {
//    //    console.log("Angular ready...");
//    //    $scope.updatePointer();
//    //    $scope.updateQuickDoku();
//    //}

//});

mainModule.directive('myDownload', function ($compile) {
    return {
        restrict: 'E',
        scope: { getUrlData: '&getData' },
        link: function (scope, elm, attrs) {
            var url = window.URL.createObjectURL(scope.getUrlData());
            //alert("Hi!");
            elm.append($compile(
                '<a class="btn" download="bescheid.docx"' +
                    'href="' + url + '">' +
                    'Download' +
                    '</a>'
            )(scope));
        }
    };
});

mainModule.directive('confirmationNeeded', function () {
    return {
        priority: 1,
        terminal: true,
        link: function (scope, element, attr) {
            var msg = attr.confirmationNeeded || "Are you sure?";
            var clickAction = attr.ngClick;
            element.bind('click', function () {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction);
                }
            });
        }
    };
});

mainModule.directive('myDelete', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            //console.warn(event.which);
            //46 === DEL; 8 === BACKSPACE
            if (event.which === 46 || event.which === 8) {
                scope.$apply(function (){
                    scope.$eval(attrs.myDelete);
                });

                event.preventDefault();
            }
        });
    };
});

(function (myApp) {
    "use strict";
    var viewModelHelper = function ($http, $q, $window, $location) {

        var self = this;

        self.modelIsValid = true;
        self.modelErrors = [];

        self.resetModelErrors = function () {
            self.modelErrors = [];
            self.modelIsValid = true;
        }

        //http-GET
        self.apiGet = function (uri, data, success, failure, always) {
            self.modelIsValid = true;
            //4 IsAjaxRequest in MVC
            $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            $http.get(MyApp.rootPath + uri, data)
                .then(function (result) {
                    //alert("res");
                    success(result);
                    if (always != null)
                        always();
                }, function (result) {
                    if (failure != null) {
                        failure(result);
                    }
                    else {
                        var errorMessage = result.status + ':' + result.statusText;
                        if (result.data != null && result.data.Message != null)
                            errorMessage += ' - ' + result.data.Message;
                        self.modelErrors = [errorMessage];
                        self.modelIsValid = false;
                    }
                    if (always != null)
                        always();
                });
        }

        //with anti-forgery token
        self.apiSecGet = function (uri, data, token, success, failure, always) {
            //alert(token);
            console.log("apiSecGet");
            console.log(token);
            $http.defaults.headers.common["RequestVerificationToken"] = token;
            self.apiGet(uri, data, success, failure, always);
        }

        //http-POST
        self.apiPost = function (uri, data, success, failure, always) {
            self.modelIsValid = true;
            //4 IsAjaxRequest in MVC
            $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            $http.defaults.headers.common["Content-Type"] = "application/json";
            $http.post(MyApp.rootPath + uri, data)
                .then(function (result) {
                    success(result);
                    if (always != null)
                        always();
                }, function (result) {
                    if (failure != null) {
                        failure(result);
                    }
                    else {
                        var errorMessage = result.status + ':' + result.statusText;
                        if (result.data != null && result.data.Message != null)
                            errorMessage += ' - ' + result.data.Message;
                        self.modelErrors = [errorMessage];
                        self.modelIsValid = false;
                    }
                    if (always != null)
                        always();
                });
        }

        //with anti-forgery token
        self.apiSecPost = function (uri, data, token, success, failure, always) {
            //alert(token);
            console.log("apiSecPost");
            console.log(token);
            $http.defaults.headers.common["RequestVerificationToken"] = token;
            self.apiPost(uri, data, success, failure, always);
        }

        self.goBack = function () {
            $window.history.back();
        }

        self.navigateTo = function (path) {
            $location.path(MyApp.rootPath + path);
        }

        self.refreshPage = function (path) {
            $window.location.href = MyApp.rootPath + path;
        }

        self.clone = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        self.alert = function (message) {
            alert(message);
        }

        self.notify = function (message) {
            $.notify(message, {
                globalPosition: 'bottom right',
                className: 'info', //success
                //style: 'bootstrap',
                autoHideDelay: 4000,
                showAnimation: 'fadeIn',
                showDuration: 400,
                hideAnimation: 'fadeOut',
                hideDuration: 200,
                style: 'customStyle'
            });
        }

        self.notifySuccessSingle = function (message) {
            $.notify(message,
                {
                    position: "right",
                    className: "success"
                });
        }

        self.notifySuccess = function (item, message) {
            $("#" + item).notify(message,
                {
                    position: "right",
                    className: "success"
                });
        }

        self.notifySuccessBottom = function (item, message) {
            $("#" + item).notify(message,
                {
                    position: "bottom",
                    className: "success"
                });
        }

        self.notifyErrorSingle = function (message) {
            $.notify(message,
                {
                    position: "top right",
                    className: "error"
                });
        }

        self.notifyError = function (item, message) {
            $("#" + item).notify(message,
                {
                    position: "right",
                    className: "error"
                });
        }

        self.linkModelFunc = function (url) {
            alert(url);
            console.log('link model function');
            $window.open(url);
        }

        $.fn.serializeObject = function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                //alert(this.name + ";" + this.value);
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        //self.TEST = function() {
        //    return "Hi!!!";
        //}

        self.b64ToBlob = function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        return this;
    };
    myApp.viewModelHelper = viewModelHelper;
}(window.MyApp));