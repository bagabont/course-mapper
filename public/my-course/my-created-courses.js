angular.module('MyCreatedCourses', [''])
    /*.filter('unique', function () {

        return function (items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    })*/
    .controller('CourseListCreatedController', function($scope, $http) {
        $scope.headerTitle = "Course Name";
        $http.get('/api/my-course').success(function (data) {
            $scope.courseCreated = data.courses.created;
            $scope.courseCreatedLength = data.courses.created.length;
        });

        $http.get('/api/my-course/created-resources').success(function (data) {
            $scope.courseCreatedResources = data.resources;

        });

        $http.get('/api/my-course/newsfeed').success(function (data) {
            $scope.newsfeedData  = data.newsfeed;
        });

        //filtering scope newsfeed
        $scope.isPdfAnno = function (action) {
            return action.actionSubject == 'pdf annotation';
        };
        $scope.isVideoAnno = function (action) {
            return action.actionSubject == 'video annotation';
        };
        $scope.isDiscussion = function (action) {
            return action.actionSubject == 'discussion';
        };
        $scope.isLink = function (action) {
            return action.actionSubject == 'link';
        };
        $scope.isAdded = function (action) {
            return action.actionType == 'added';
        };
        $scope.isDeleted = function (action) {
            return action.actionType == 'deleted';
        };

        //filtering scope resources
        $scope.isPdf = function (action) {
            return action.type == 'pdf';
        };
        $scope.isVideo = function (action) {
            return action.type != 'pdf';
        };
    });