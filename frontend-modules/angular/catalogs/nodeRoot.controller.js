app.controller('NodeRootController', function ($scope, $rootScope, $filter, $http, $location,
                                               $routeParams, $timeout, ActionBarService, authService,
                                               courseService, treeNodeService, Page, toastr) {
    $scope.treeNode = null;
    $scope.course = null;
    $scope.nodeId = $routeParams.nodeId;
    $scope.courseId = $routeParams.courseId;

    $scope.isNodeOwner = false;
    $scope.isAdmin = false;
    $scope.isManager = false;
    $scope.isOwner = false;
    $scope.isEnrolled = false;
    $scope.videoFile = false;
    $scope.pdfFile = false;

    $scope.currentTab = "";
    $scope.currentPdfPage = 1;
    $scope.defaultPath = "";
    $scope.includeActionBar = "";
    $scope.currentNodeAction = {};

    $scope.manageActionBar = function () {
        if (($scope.currentTab == 'video' || $scope.currentTab == 'pdf') && $scope.treeNode) {
            if ($scope.treeNode.createdBy == $rootScope.user._id) {

                ActionBarService.extraActionsMenu = [];
                ActionBarService.extraActionsMenu.push({
                    clickAction: $scope.deleteNode,
                    clickParams: $scope.treeNode._id,
                    title: '<i class="ionicons ion-close"></i> &nbsp;DELETE',
                    aTitle: 'DELETE THIS NODE AND ITS CONTENTS'
                });
            }
        }
    };

    $scope.changeTab = function () {
        var q = $location.search();

        if (!q.tab) {
            jQuery('li.video').removeClass('active');
            jQuery('li.pdf').removeClass('active');

            if ($scope.videoFile && $scope.pdfFile) {
                jQuery('li.video').addClass('active');
            } else if ($scope.pdfFile) {
                jQuery('li.pdf').addClass('active');
            } else {
                jQuery('li.video').addClass('active');
            }
        }

        if ($scope.videoFile || ($scope.videoFile && $scope.pdfFile)) {
            $scope.defaultPath = 'video';
        } else if ($scope.pdfFile) {
            $scope.defaultPath = 'pdf';
        }

        $scope.currentTab = $scope.defaultPath;
        if (q.tab) {
            $scope.currentTab = q.tab;
        }

        $scope.include = '/treeNode/tab/' + $scope.currentTab;
        $scope.includeActionBar = '/treeNode/actionBar/' + $scope.currentTab;

        $rootScope.$broadcast('onNodeTabChange', $scope.currentTab);

        $scope.manageActionBar();
    };

    $scope.initNode = function () {
        courseService.init(
            $scope.courseId,

            function (course) {
                $scope.course = course;

                treeNodeService.init($scope.nodeId,
                    function (treeNode) {
                        $scope.treeNode = treeNode;
                        $scope.videoFile = treeNodeService.videoFile;
                        $scope.pdfFile = treeNodeService.pdfFile;

                        $scope.setCapabilities();

                        Page.setTitleWithPrefix($scope.course.name + ' > Map > ' + $scope.treeNode.name);

                        if ($scope.treeNode.createdBy == $rootScope.user._id) {
                            $scope.isNodeOwner = true;
                            $scope.setEditMode();
                        }

                        $scope.changeTab();

                        $timeout(function () {
                            $scope.$broadcast('onAfterInitTreeNode', $scope.treeNode);
                        });
                    },
                    function (err) {
                        toastr.error(err);
                    }
                );
            },

            function (res) {
                $scope.errors = res.errors;
                toastr.error('Failed getting course');
            },

            true
        );
    };

    $scope.setEditMode = function () {
        $scope.currentNodeAction.mode = "edit";
        $scope.currentNodeAction.type = "contentNode";
        $scope.currentNodeAction.typeText = "Content Node";
        $scope.currentNodeAction.parent = $scope.treeNode;
        $scope.nodeModaltitle = "Edit " + $scope.currentNodeAction.typeText;
        $rootScope.$broadcast('onAfterSetMode', $scope.course, $scope.treeNode);
    };

    $scope.setCapabilities = function () {
        $scope.isEnrolled = courseService.isEnrolled();
        $scope.isManager = courseService.isManager(authService.user);
        $scope.isAdmin = authService.isAdmin();
        $scope.isOwner = authService.user._id == $scope.course.createdBy._id;
    };


    $scope.$on('onAfterEditContentNode', function (event, oldTreeNode) {
        window.location.reload();
    });

    /**
     * ping server on our latest page read
     */
    $scope.$on('onPdfPageChange', function (event, params) {
        $http.get('/slide-viewer/read/' + $scope.courseId + '/' + $scope.nodeId + '/' + $scope.pdfFile._id + '/' + params[0] + '/' + params[1]);

        /*var q = $location.search();
         if (!q.tab) {
         if ($scope.currentTab == 'pdf' && params[0] > 1) {
         $location.search({'tab': 'pdf'});
         }
         }*/

        if (params[0] && params[0] != 1)
            $scope.currentPdfPage = params[0];
    });

    $scope.$on('$routeUpdate', function () {
        var q = $location.search();

        if (q.tab) {
            if ($scope.currentTab && $scope.currentTab != q.tab) {
                $scope.changeTab();
            }
        }
        else
            $scope.changeTab();
    });

    /**
     * initiate course when user hast tried to log in
     */
    $scope.$watch(function () {
        return authService.isLoggedIn;
    }, function () {
        if (authService.hasTriedToLogin && !$scope.course) {
            $scope.initNode();
        }
    });
});
