(function () {
    'use strict';

    var multiselect = angular.module('btorfs.multiselect', ['btorfs.multiselect.templates']);

    multiselect.getRecursiveProperty = function (object, path) {
        return path.split('.').reduce(function (object, x) {
            if (object) {
                return object[x];
            } else {
                return null;
            }
        }, object)
    };

    multiselect.getRecursiveProperty = function (object, path) {
        return path.split('.').reduce(function (object, x) {
            if (object) {
                return object[x];
            } else {
                return null;
            }
        }, object);
    };

    multiselect.directive('multiselect', ['$filter', '$document', '$log', '$rootScope', function ($filter, $document, $log, $rootScope) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                displayProp: '@',
                idProp: '@',
                searchLimit: '=?',
                selectionLimit: '=?',
                showSelectAll: '=?',
                showUnselectAll: '=?',
                showSearch: '=?',
                searchFilter: '=?',
                selectNamePl: '=',
                selectListen: '=',
                filterFunc: "&?",
                disabled: '=?ngDisabled'
            },
            require: 'ngModel',
            templateUrl: 'multiselect.html',
            link: function ($scope, $element, $attrs, $ngModelCtrl) {
                $scope.selectionLimit = $scope.selectionLimit || 0;
                $scope.searchLimit = $scope.searchLimit || 25;

                $scope.searchFilter = '';

                if (typeof $attrs.disabled != 'undefined') {
                    $scope.disabled = true;
                }

                if ($scope.selectListen) {
                    $rootScope.$on($scope.selectListen + '.update', handler);
                }

                $scope.toggleDropdown = function () {
                    $scope.open = !$scope.open;
                };

                var closeHandler = function (event) {
                    if (!$element[0].contains(event.target)) {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                    }
                };

                $document.on('click', closeHandler);

                var updateSelectionLists = function () {
                    if (!$ngModelCtrl.$viewValue) {
                        if ($scope.selectedOptions) {
                            $scope.selectedOptions = [];
                        }
                        $scope.unselectedOptions = angular.copy($scope.resolvedOptions);
                    } else {
                        $scope.selectedOptions = $scope.resolvedOptions.filter(function (el) {
                            var id = $scope.getId(el);
                            for (var i = 0; i < $ngModelCtrl.$viewValue.length; i++) {
                                var selectedId = $scope.getId($ngModelCtrl.$viewValue[i]);
                                if (id === selectedId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        $scope.unselectedOptions = $scope.resolvedOptions.filter(function (el) {
                            return $scope.selectedOptions.indexOf(el) < 0;
                        });
                    }
                };

                $ngModelCtrl.$render = function () {
                    updateSelectionLists();
                };

                $ngModelCtrl.$viewChangeListeners.push(function () {
                    updateSelectionLists();
                });

                $ngModelCtrl.$isEmpty = function (value) {
                    if (value) {
                        return (value.length === 0);
                    } else {
                        return true;
                    }
                };

                var watcher = $scope.$watch('selectedOptions', function () {
                    $ngModelCtrl.$setViewValue(angular.copy($scope.selectedOptions));
                }, true);

                $scope.$on('$destroy', function () {
                    $document.off('click', closeHandler);
                    if (watcher) {
                        watcher(); // Clean watcher
                    }
                });

                $scope.getButtonText = function () {
                    if ($scope.selectedOptions && $scope.selectedOptions.length === 1) {
                        return $scope.getDisplay($scope.selectedOptions[0]);
                    }
                    if ($scope.selectedOptions && $scope.selectedOptions.length > 1) {
                        var totalSelected;
                        totalSelected = angular.isDefined($scope.selectedOptions) ? $scope.selectedOptions.length : 0;
                        if (totalSelected === 0) {
                            return 'כל ה' + $scope.selectNamePl + ' נבחרו';
                        } else {
                            return totalSelected + ' ' + $scope.selectNamePl + ' ' + 'נבחרו';
                        }
                    } else {
                        return 'כל ה' + $scope.selectNamePl + ' נבחרו';
                    }
                };

                $scope.selectAll = function () {
                    $scope.selectedOptions = $scope.resolvedOptions;
                    $scope.unselectedOptions = [];
                };

                $scope.unselectAll = function () {
                    $scope.selectedOptions = [];
                    $scope.unselectedOptions = $scope.resolvedOptions;
                };

                $scope.toggleItem = function (item) {
                    $scope.searchFilter = '';
                    if (typeof $scope.selectedOptions === 'undefined') {
                        $scope.selectedOptions = [];
                    }
                    var selectedIndex = $scope.selectedOptions.indexOf(item);
                    var currentlySelected = (selectedIndex !== -1);
                    if (currentlySelected) {
                        $scope.unselectedOptions.push($scope.selectedOptions[selectedIndex]);
                        $scope.selectedOptions.splice(selectedIndex, 1);
                    } else if (!currentlySelected && ($scope.selectionLimit === 0 || $scope.selectedOptions.length < $scope.selectionLimit)) {
                        var unselectedIndex = $scope.unselectedOptions.indexOf(item);
                        $scope.unselectedOptions.splice(unselectedIndex, 1);
                        $scope.selectedOptions.push(item);
                    }

                    $rootScope.$broadcast($attrs.ngModel + '.update');
                };

                $scope.getId = function (item) {
                    if (angular.isString(item)) {
                        return item;
                    } else if (angular.isObject(item)) {
                        if ($scope.idProp) {
                            return multiselect.getRecursiveProperty(item, $scope.idProp);
                        } else {
                            $log.error('Multiselect: when using objects as model, a idProp value is mandatory.');
                            return '';
                        }
                    } else {
                        return item;
                    }
                };

                $scope.getDisplay = function (item) {
                    if (angular.isString(item)) {
                        return item;
                    } else if (angular.isObject(item)) {
                        if ($scope.displayProp) {
                            return multiselect.getRecursiveProperty(item, $scope.displayProp);
                        } else {
                            $log.error('Multiselect: when using objects as model, a displayProp value is mandatory.');
                            return '';
                        }
                    } else {
                        return item;
                    }
                };

                $scope.isSelected = function (item) {
                    if (!$scope.selectedOptions) {
                        return false;
                    }
                    var itemId = $scope.getId(item);
                    for (var i = 0; i < $scope.selectedOptions.length; i++) {
                        var selectedElement = $scope.selectedOptions[i];
                        if ($scope.getId(selectedElement) === itemId) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.updateOptions = function () {
                    if (typeof $scope.options === 'function') {
                        $scope.options().then(function (resolvedOptions) {
                            $scope.resolvedOptions = resolvedOptions;
                            updateSelectionLists();
                        });
                    }
                };

                // This search function is optimized to take into account the search limit.
                // Using angular limitTo filter is not efficient for big lists, because it still runs the search for
                // all elements, even if the limit is reached
                $scope.search = function () {
                    var counter = 0;
                    return function (item) {
                        if (counter > $scope.searchLimit) {
                            return false;
                        }
                        var displayName = $scope.getDisplay(item);
                        if (displayName) {
                            var result = displayName.toLowerCase().indexOf($scope.searchFilter.toLowerCase()) > -1;
                            if (result) {
                                counter++;
                            }
                            return result;
                        }
                    }
                };

                $scope.isReachedLimit = function () {
                    return $scope.selectionLimit && $scope.selectedOptions && $scope.selectedOptions.length >= $scope.selectionLimit;
                };

                $scope.resolvedOptions = [];
                if (typeof $scope.options !== 'function') {
                    $scope.resolvedOptions = $scope.options;
                } else {
                    $scope.updateOptions();
                }

                function handler() {
                    removeSelection();
                }

                function removeSelection() {
                    $scope.selectedOptions = [];
                }
            }
        };
    }]);

}());
