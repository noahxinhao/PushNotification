angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform, $http) {
        var vm = $scope.vm = {};
        vm.AppRegister = function () {
            var config = null;
            if (ionic.Platform.isAndroid()) {
                config = {
                    "senderID": "YOUR_GCM_PROJECT_ID" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
                };
            }else if (ionic.Platform.isIOS()) {
                config = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true"
                }
            }

            $cordovaPush.register(config).then(function (result) {
                console.log("Register success " + result);

                $cordovaToast.showShortCenter('注册成功'+JSON.stringify(result));
                $scope.registerDisabled = true;
                if (ionic.Platform.isIOS()) {
                    $scope.regId = result;
                    //vm.storeDeviceToken("ios");
                }
            }, function (err) {
                console.log("Register error " + err)
            });
        };

        //注册APP收到消息执行事件
        $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            console.log(JSON.stringify([notification]));
            if (ionic.Platform.isAndroid()) {
                vm.handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                vm.handleIOS(notification);
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.alert));
                })
            }
        });

        vm.handleAndroid = function (notification) {
            console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
            if (notification.event == "registered") {
                $scope.regId = notification.regid;
                //vm.storeDeviceToken("android");
            }
            else if (notification.event == "message") {
                $cordovaDialogs.alert(notification.message, "Push Notification Received");
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.message));
                })
            }
            else if (notification.event == "error")
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
        };

        // IOS Notification Received Handler
        vm.handleIOS = function (notification) {
            if (notification.foreground == "1") {
                if (notification.sound) {
                    var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                    mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
                }

                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

                if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                        console.log("Set badge success " + result)
                    }, function (err) {
                        console.log("Set badge error " + err)
                    });
                }
            } else {
                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
                } else {
                    $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
                }
            }
        };

        //项目启动后自动执行register
        ionPlatform.ready.then(function (device) {
            vm.AppRegister();
        });
    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
