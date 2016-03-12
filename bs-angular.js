/**
 * Created by ron on 09/03/16.
 */

(function() {
    "use strict";
    angular.module('bsAngular', ['ngSanitize']);
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .controller('formCtrl', ['$scope', formCtrl]);

    function formCtrl($scope) {
        $scope.send = function(form) {
            alert(form.$triggerValidation());
        };
    }
})();
(function() {
    "use strict";
    angular
        .module('bsAngular')
        .run(['$rootScope', '$bsCollapse', '$bsModals', '$bsTable', '$q', '$filter', '$bsAlerts', bsAngularRun]);

    function bsAngularRun($rootScope, $bsCollapse, $bsModals, $bsTable, $q, $filter, $bsAlerts) {
        $rootScope.send = function() {
            $rootScope.formTest.$setSubmitted();
        };
        $rootScope.showMessage = function() {
            var type = parseInt(Math.random() * 10);
            if (type < 3) {
                $bsAlerts.success('Message');
            } else if (type < 6) {
                $bsAlerts.danger('Message');
            } else {
                $bsAlerts.warning('Message');
            }
        };
        $rootScope.$bsCollapse = $bsCollapse;
        $rootScope.$bsModals = $bsModals;
        $rootScope.checkTest = true;
        $rootScope.crumbs = [
            {
                title: 'Item 1',
                icon: 'glyphicon glyphicon-home',
                href: 'home'
            },
            {
                title: 'Item 2',
                icon: 'glyphicon glyphicon-remove',
                href: 'home'
            },                         {
                title: 'Item 3',
                icon: 'glyphicon glyphicon-check',
                href: 'home'
            }
        ];
        $rootScope.tableData = [];
        for (var i = 1; i <= 100; i++) {
            $rootScope.tableData.push({
                id: i,
                title: 'Item ' + i
            });
        }
        $rootScope.navbar = [
            {
                title: 'Item 1',
                icon: 'glyphicon glyphicon-home',
                ngClick: function(data) { alert(data); },
                side: 'left',
                active: true,
                header: true
            },
            {
                title: 'Item 2',
                href: 'href2',
                side: 'right',
                active: false,
                items: [
                    {
                        title: 'Sub Item 1',
                        href: 'subhref1',
                        active: false
                    }
                ]
            },
            {
                title: 'Item 3',
                href: 'href3',
                side: 'left',
                active: false
            }
        ];
        $rootScope.table = new $bsTable();
        $rootScope.table.getData = function($params) {
            var data;
            if ($params.sortBy) {
                data = $filter('orderBy')($rootScope.tableData, $params.sortOrder > 0 ? $params.sortBy : '-' + $params.sortBy);
            } else {
                data = $rootScope.tableData;
            }
            data = data.slice(($params.page - 1) * $params.perPage, $params.page * $params.perPage);
            return $q.resolve({
                items: data,
                total: $rootScope.tableData.length
            });
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .constant('bsContexts', [bsContexts]);

    function bsContexts() {
        return {
            DEFAULT: 'default',
            PRIMARY: 'primary',
            SUCCESS: 'success',
            INFO: 'info',
            WARNING: 'warning',
            DANGER: 'danger'
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .service('$bsEventsManager', ['$rootScope', bsEventsManager]);

    function bsEventsManager($rootScope) {

        /**
         * Trigger an event through the root scope to make it propagate through the application
         *
         * @param event The event name
         * @param data Extra data passed as the second argument to the event
         */
        this.trigger = function(event, data) {
            $rootScope.$broadcast(event, data);
        };

        /**
         * Listen to a jQuery event on an element and attach the callback to it
         *
         * @param element The DOM element
         * @param event The event name
         * @param callback The callback function to be triggered when the event raises
         */
        this.listen = function(element, event, callback) {
            angular.element(element).on(event, callback);
        };

        /**
         * Remove a jQuery event listener from an element
         *
         * @param element The DOM element
         * @param event The event name
         */
        this.unlisten = function(element, event) {
            angular.element(element).off(event);
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsTip', ['$bsEventsManager', bsTip]);

    function bsTip($bsEventsManager) {
        return {
            restrict: 'A',
            scope: {
                bsTip: '<?',
                bsTipPlacement: '<?'
            },
            link: bsTooltipLink
        };

        function bsTooltipLink(scope, elem, attr) {

            /**
             * Init optional bindings to default values
             */
            if (!scope.bsTipPlacement) {
                scope.bsTipPlacement = 'top';
            }

            /**
             * Initialize directive
             */
            initTooltip();
            initEvents();

            /**
             * Attach watches to reinitialize the jQuery plugin on changes
             */
            scope.$watch('bsTip', function(newValue) {
                if (newValue !== undefined) {
                    initTooltip();
                }
            });
            scope.$watch('bsTipPlacement', function(newValue) {
                if (newValue !== undefined) {
                    initTooltip();
                }
            });

            /**
             * Initialize tooltip jQuery plugin
             */
            function initTooltip() {
                angular.element(elem).tooltip({
                    title: scope.bsTip,
                    placement: scope.bsTipPlacement
                });
            }

            /**
             * Initialize events listeners
             */
            function initEvents() {
                $bsEventsManager.listen(elem, 'show.bs.tooltip', function(e) {
                    $bsEventsManager.trigger('$bsTipShow', e);
                });
                $bsEventsManager.listen(elem, 'shown.bs.tooltip', function(e) {
                    $bsEventsManager.trigger('$bsTipShown', e);
                });
                $bsEventsManager.listen(elem, 'hide.bs.tooltip', function(e) {
                    $bsEventsManager.trigger('$bsTipHide', e);
                });
                $bsEventsManager.listen(elem, 'hidden.bs.tooltip', function(e) {
                    $bsEventsManager.trigger('$bsTipHidden', e);
                });
                $bsEventsManager.listen(elem, 'inserted.bs.tooltip', function(e) {
                    $bsEventsManager.trigger('$bsTipInserted', e);
                });
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsCollapse', ['$bsEventsManager', bsCollapse]);

    function bsCollapse($bsEventsManager) {
        return {
            restrict: 'A',
            compile: bsCollapseCompile
        };

        function bsCollapseCompile(elem, attr) {
            /**
             * Options object
             *
             * @type {{parent: (bsCollapse|boolean)}}
             */
            var options = {
                parent: attr.bsCollapse || false,
                toggle: false
            };

            /**
             * Initialize jQuery plugin
             */
            angular.element(elem).addClass('collapse');
            angular.element(elem).collapse(options);

            /**
             * Initialize events listeners
             */
            $bsEventsManager.listen(elem, 'show.bs.collapse', function(e) {
                $bsEventsManager.trigger('$bsCollapseShow', e);
            });
            $bsEventsManager.listen(elem, 'shown.bs.collapse', function(e) {
                $bsEventsManager.trigger('$bsCollapseShown', e);
            });
            $bsEventsManager.listen(elem, 'hide.bs.collapse', function(e) {
                $bsEventsManager.trigger('$bsCollapseHide', e);
            });
            $bsEventsManager.listen(elem, 'hidden.bs.collapse', function(e) {
                $bsEventsManager.trigger('$bsCollapseHidden', e);
            });
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .service('$bsCollapse', [bsCollapseService]);

    function bsCollapseService() {

        /**
         * Show collapsed element
         *
         * @param id The element ID
         */
        this.show = function(id) {
            collapse(id, 'show');
        };

        /**
         * Hide open collapsed element
         *
         * @param id The element ID
         */
        this.hide = function(id) {
            collapse(id, 'hide');
        };

        /**
         * Toggle collapse element
         *
         * @param id The element ID
         */
        this.toggle = function(id) {
            collapse(id, 'toggle');
        };

        /**
         * Run collapse element method
         *
         * @param id The element ID
         * @param method The method name
         */
        function collapse(id, method) {
            angular.element('#' + id).collapse(method);
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .service('$bsModals', ['$bsEventsManager', bsModals]);

    function bsModals($bsEventsManager) {

        /**
         * Show the modal
         *
         * @param id The modal ID
         * @param autofocus The ID of the element to focus on once the modal is shown
         */
        this.setAutoFocus = function(id, autofocus) {
            $bsEventsManager.listen(angular.element('#' + id), 'shown.bs.modal', function() {
                angular.element('#' + autofocus).focus();
            });
        };

        /**
         * Show the modal
         *
         * @param id The modal ID
         * @param autofocus Optional - The ID of the element to focus on once the modal is shown
         */
        this.show = function(id, autofocus) {
            if (autofocus !== undefined) {
                $bsEventsManager.listen(angular.element('#' + id), 'shown.bs.modal', function() {
                    angular.element('#' + autofocus).focus();
                });
            }
            modal(id, 'show');
        };

        /**
         * Hide the modal
         *
         * @param id The modal ID
         */
        this.hide = function(id) {
            modal(id, 'hide');
        };

        /**
         * Readjusts the modal's positioning to counter a scrollbar in case one should appear
         *
         * @param id The modal ID
         */
        this.updateHeight = function(id) {
            modal(id, 'handleUpdate');
        };

        /**
         * Run modal element method
         *
         * @param id The modal ID
         * @param method The method name
         */
        function modal(id, method) {
            angular.element('#' + id).modal(method);
        }
    }

})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsModal', [bsModal]);

    function bsModal() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                header: '<?',
                closeButton: '<?',
                closeEsc: '<?',
                modalStatic: '<?',
                background: '<?'
            },
            template: '<div class="modal fade" data-keyboard="{{closeEsc}}" data-backdrop="{{background}}" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div ng-if="header" class="modal-header"><button ng-if="closeButton" type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">{{header}}</h4></div><div ng-transclude></div></div></div></div>',
            link: bsModalLink
        };
        function bsModalLink(scope, elem, attr) {
            if (scope.closeButton === undefined) {
                scope.closeButton = true;
            }
            if (scope.closeEsc === undefined) {
                scope.closeEsc = true;
            }
            if (scope.background === undefined) {
                scope.background = true;
            }
            if (scope.modalStatic) {
                scope.background = 'static';
            }
        }

    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsModalBody', [bsModalBody]);

    function bsModalBody() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="modal-body" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsModalFooter', [bsModalFooter]);

    function bsModalFooter() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="modal-footer" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsButton', [bsButton]);
    
    function bsButton() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                ctx: '<?',
                size: '<?',
                link: '<?'
            },
            template: '<button class="btn btn-{{ctx}} btn-{{size}}" ng-transclude></button>',
            link: bsButtonLink
        };
        function bsButtonLink(scope, elem, attr) {
            if (scope.ctx === undefined) {
                scope.ctx = 'default';
            }
            if (scope.link) {
                scope.ctx = 'link';
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsGlyph', [bsGlyph]);

    function bsGlyph() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                icon: '<?'
            },
            template: '<span class="glyphicon glyphicon-{{icon}}"></span>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsAlert', [bsAlert]);

    function bsAlert() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                ctx: '<',
                dismissible: '<?'
            },
            template: '<div class="alert alert-{{ctx}}" ng-class="{\'alert-dismissible fade in\': dismissible}"><button ng-if="dismissible" type="button" class="close" data-dismiss="alert">&times;</button><div ng-transclude></div></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsProgress', [bsProgress]);

    function bsProgress() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                value: '<',
                animate: '<?',
                striped: '<?',
                ctx: '<?'
            },
            template: '<div class="progress"><div class="progress-bar progress-bar-{{ctx}}" ng-class="{\'progress-bar-striped\': striped, \'active\': striped && animate}" ng-style="{width: value + \'%\'}"></div></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsPagination', [bsPagination]);

    function bsPagination() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                pages: '=',
                page: '=',
                maxPages: '<',
                pageChange: '&',
                size: '<?'
            },
            template: '<nav><ul class="pagination pagination-{{size}} m-0" ng-if="hasPages"><li ng-class="{\'disabled\': page == 1}"><a ng-click="first()">&laquo;</a></li><li ng-class="{\'disabled\': page == 1}"><a ng-click="prev()">&lsaquo;</a></li><li ng-repeat="p in pagesList" ng-class="{\'active\': p == page}"><a ng-click="change(p)">{{p}}</a></li><li ng-class="{\'disabled\': page == pages}"><a ng-click="next()">&rsaquo;</a></li><li ng-class="{\'disabled\': page == pages}"><a ng-click="last()">&raquo;</a></li></ul></nav>',
            controller: bsPaginationCtrl,
            link: bsPaginationLink
        };
        function bsPaginationLink(scope, elem, attr) {
            scope.$watch('pages', function() {
                if (scope.maxPages > scope.pages) {
                    scope.maxPages = scope.pages;
                }
                scope.buildPages();
            });
            scope.$watch('maxPages', function() {
                if (scope.maxPages > scope.pages) {
                    scope.maxPages = scope.pages;
                }
                scope.buildPages();
            });
            if (scope.page === undefined || scope.page < 1) {
                scope.page = 1;
            }
        }
        function bsPaginationCtrl($scope) {

            $scope.pagesList = [];

            $scope.first = function() {
                $scope.change(1);
            };

            $scope.last = function() {
                $scope.change($scope.pages);
            };

            $scope.prev = function() {
                $scope.change($scope.page - 1);
            };

            $scope.next = function() {
                $scope.change($scope.page + 1);
            };

            $scope.change = function(page) {
                if (page == $scope.page) return;
                if (page >= 1 && page <= $scope.pages) {
                    $scope.page = page;
                    if ($scope.pageChange !== undefined) {
                        $scope.pageChange({page: $scope.page});
                    }
                    $scope.buildPages();
                }
            };

            $scope.buildPages = function() {
                if ($scope.pages == 0) {
                    $scope.pagesList = [];
                } else if ($scope.maxPages >= $scope.pages) {
                    $scope.pagesList = range(1, $scope.pages);
                } else {
                    if ($scope.page == $scope.pages) {
                        $scope.pagesList = range($scope.pages - $scope.maxPages + 1, $scope.pages);
                    } else if ($scope.page == 1) {
                        $scope.pagesList = range(1, $scope.maxPages);
                    } else {
                        var beforePages, afterPages;
                        beforePages = afterPages = Math.floor($scope.maxPages / 2);
                        if ($scope.maxPages % 2) {
                            afterPages--;
                        }
                        if ($scope.page <= beforePages) {
                            $scope.pagesList = range(1, $scope.maxPages);
                        } else if ($scope.page >= $scope.pages - afterPages) {
                            $scope.pagesList = range($scope.pages - $scope.maxPages + 1, $scope.pages);
                        } else {
                            $scope.pagesList = range($scope.page - beforePages, $scope.page + afterPages + 1);
                        }
                    }

                }
                $scope.hasPages = ($scope.pagesList.length > 0);
                $scope.hasMore = ($scope.pages > $scope.maxPages);
                if ($scope.pageChange !== undefined) {
                    $scope.pageChange({page: $scope.page});
                }
            };

            function range(start, end) {
                var items = [];
                for (var i = start; i <= end; i++) {
                    items.push(i);
                }
                return items;
            }

        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsNavbar', [bsNavbar]);

    function bsNavbar() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                navItems: '<',
                clickData: '<?',
                brand: '<?',
                brandLink: '<?',
                logo: '<?',
                responsive: '<?',
                inverse: '<?',
                fixed: '<?'
            },
            template: '<nav class="navbar navbar-{{$navbarClass}} navbar-fixed-{{fixed}}"><div class="container-fluid"><div ng-if="brand || logo" class="navbar-header"><button ng-if="responsive" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#{{$id}}"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" ng-href="{{brandLink}}"><img ng-if="logo" ng-src="{{logo}}"><span ng-bind-html="brand"></span></a></div><div class="collapse navbar-collapse" id="{{$id}}"><ul class="nav navbar-nav"><li ng-repeat="item in navItems | filter:{side: \'left\'} track by $index" ng-class="{\'active\': item.active, \'dropdown\': item.items.length > 0}"><a ng-if="!item.items || item.items.length == 0" ng-href="{{item.href}}" ng-click="executeClick(item)"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span></a><a ng-if="item.items && item.items.length > 0" href="#" class="dropdown-toggle" data-toggle="dropdown"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span>&nbsp;<span class="caret"></span></a><ul ng-if="item.items && item.items.length > 0" class="dropdown-menu"><li ng-repeat="subItem in item.items track by $index" ng-class="{\'active\': subItem.active}"><a ng-href="{{subItem.href}}" ng-click="executeClick(subItem)"><span ng-if="subItem.icon"><i class="{{subItem.icon}}"></i>&nbsp;</span><span ng-bind-html="subItem.title"></span></a></li></ul></li></ul><ul class="nav navbar-nav navbar-right"><li ng-repeat="item in navItems | filter:{side: \'right\'} track by $index" ng-class="{\'active\': item.active, \'dropdown\': item.items.length > 0}"><a ng-if="!item.items || item.items.length == 0" ng-href="{{item.href}}" ng-click="executeClick(item)"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span></a><a ng-if="item.items && item.items.length > 0" href="#" class="dropdown-toggle" data-toggle="dropdown"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span>&nbsp;<span class="caret"></span></a><ul ng-if="item.items && item.items.length > 0" class="dropdown-menu"><li ng-repeat="subItem in item.items track by $index" ng-class="{\'active\': subItem.active}"><a ng-href="{{subItem.href}}"  ng-click="executeClick(subItem)"><span ng-if="subItem.icon"><i class="{{subItem.icon}}"></i>&nbsp;</span><span ng-bind-html="subItem.title"></span></a></li></ul></li></ul></div></div></nav>',
            controller: bsNavbarCtrl,
            link: bsNavbarLink
        };

        function bsNavbarLink(scope, elem, attr) {
            angular.forEach(scope.navItems, function(item) {
                if (item.side === undefined) {
                    item.side = 'left';
                }
            });
            scope.$watch('inverse', function(inverse) {
                scope.$navbarClass = inverse ? 'inverse' : 'default';
            });
            scope.$watch('fixed', function(fixed) {
                var navbarHeight = angular.element(elem).outerHeight();
                if (fixed == 'top' || fixed == 'bottom') {
                    angular.element('body').css('padding-' + fixed, navbarHeight + 'px');
                }
            });
            scope.$id = attr.id;
        }

        function bsNavbarCtrl($scope) {

            /**
             * Call the ngClick function of the item and pass in the click data
             *
             * @param item The navigation item
             */
            $scope.executeClick = function(item) {
                if (item.ngClick !== undefined && typeof item.ngClick == 'function') {
                    item.ngClick($scope.clickData);
                }
            };

        }

    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsBreadcrumb', [bsBreadcrumb]);

    function bsBreadcrumb() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                crumbs: '<?'
            },
            template: '<ol class="breadcrumb"><li ng-repeat="crumb in crumbs track by $index" ng-class="{\'active\': $last}"><span ng-if="$last"><span ng-if="crumb.icon"><i class="{{crumb.icon}}"></i>&nbsp;</span><span ng-bind-html="crumb.title"></span></span><a ng-if="!$last" ng-href="{{crumb.href}}"><span ng-if="crumb.icon"><i class="{{crumb.icon}}"></i>&nbsp;</span><span ng-bind-html="crumb.title"></span></a></li></ol>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsButtonDropdown', [bsButtonDropdown]);

    function bsButtonDropdown() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                items: '<',
                ctx: '<?',
                side: '<?',
                clickData: '<?'
            },
            template: '<div class="btn-group"><button type="button" class="btn btn-{{ctx}} dropdown-toggle" data-toggle="dropdown"><span ng-transclude></span></button><ul class="dropdown-menu dropdown-menu-{{side}}"><li ng-repeat="item in items track by $index" ng-class="{\'dropdown-header\': item.header, \'dropdown-divider\': item.divider, \'disabled\': item.disabled}"><a ng-if="!item.header && !item.divider" ng-href="{{item.href}}" ng-click="executeClick(item)"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span></a><span ng-if="item.header"><span ng-if="item.icon"><i class="{{item.icon}}"></i>&nbsp;</span><span ng-bind-html="item.title"></span></span></li></ul></div>',
            controller: bsButtonDropdownCtrl,
            link: bsButtonDropdownLink
        };
        function bsButtonDropdownLink(scope, elem, attr) {
            if (scope.ctx === undefined) {
                scope.ctx = 'default';
            }
            scope.$watch('side', function(side) {
                if (side == 'left' || side == 'right') {
                    scope.side = side;
                } else {
                    scope.side = 'left';
                }
            })
        }
        function bsButtonDropdownCtrl($scope) {
            $scope.executeClick = function(item) {
                if (item.ngClick !== undefined && typeof item.ngClick == 'function') {
                    item.ngClick($scope.clickData);
                }
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsButtonGroup', [bsButtonGroup]);

    function bsButtonGroup() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                size: '<?'
            },
            template: '<div class="btn-group btn-group-{{size}}" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsButtonToolbar', [bsButtonToolbar]);

    function bsButtonToolbar() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="btn-toolbar" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsCheckbox', [bsCheckbox]);

    function bsCheckbox() {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                label: '<?',
                ngModel: '=',
                ngTrueValue: '@?',
                ngFalseValue: '@?',
                ngChange: '&',
                disabled: '<?',
                inline: '<?'
                },
            template: '<div class="checkbox" ng-class="{\'disabled\': disabled, \'checkbox-inline\': inline}"><label><input type="checkbox" ng-model="ngModel" ng-change=$ngChange()" ng-disabled="disabled">{{label}}</label></div>',
            controller: bsCheckboxCtrl,
            compile: bsCheckboxCompile
        };
        function bsCheckboxCompile(elem, attr) {
            if (attr.ngTrueValue !== undefined) {
                angular.element(elem).find('[type=checkbox]').attr('ng-true-value', attr.ngTrueValue);
            }
            if (attr.ngFalseValue !== undefined) {
                angular.element(elem).find('[type=checkbox]').attr('ng-false-value', attr.ngFalseValue);
            }
        }
        function bsCheckboxCtrl($scope) {
            $scope.$ngChange = function() {
                if ($scope.ngChange !== undefined) {
                    $scope.ngChange();
                }
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsRadio', [bsRadio]);

    function bsRadio() {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                label: '<?',
                ngModel: '=',
                ngValue: '<?',
                ngChange: '&',
                disabled: '<?',
                inline: '<?'
            },
            template: '<div class="radio" ng-class="{\'disabled\': disabled, \'radio-inline\': inline}"><label><input type="radio" ng-model="ngModel" ng-value="ngValue" ng-change=$ngChange()" ng-disabled="disabled">{{label}}</label></div>',
            controller: bsRadioCtrl
        };
        function bsRadioCtrl($scope) {
            $scope.$ngChange = function() {
                if ($scope.ngChange !== undefined) {
                    $scope.ngChange();
                }
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsFormGroup', [bsFormGroup]);

    function bsFormGroup() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                label: '<?',
                help: '<?'
            },
            template: '<div class="form-group"><label ng-if="label">{{label}}</label><span ng-transclude></span><span ng-if="help" class="help-block">{{help}}</span></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsFormGroupFeedback', [bsFormGroupFeedback]);

    function bsFormGroupFeedback() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                label: '<?',
                help: '<?',
                model: '<',
                onlyError: '<?'
            },
            template: '<div class="form-group" ng-class="{\'has-success\': !onlyError && model.$dirty && model.$valid, \'has-error\': model.$dirty && model.$invalid,}"><label ng-if="label">{{label}}</label><span ng-transclude></span><span ng-if="help" class="help-block">{{help}}</span></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsInput', [bsInput]);

    function bsInput() {
        return {
            restrict: 'A',
            compile: bsInputCompile
        };
        function bsInputCompile(elem, attr) {
            angular.element(elem).addClass('form-control');
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsInputGroup', [bsInputGroup]);
    
    function bsInputGroup() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                addonLeft: '<?',
                addonRight: '<?'
            },
            template: '<div class="input-group"><span ng-if="addonLeft" class="input-group-addon" ng-bind-html="addonLeft"></span><span ng-transclude></span><span ng-if="addonRight" class="input-group-addon" ng-bind-html="addonRight"></span></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsInputGroupButton', [bsInputGroupButton]);

    function bsInputGroupButton() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="input-group-btn" ng-transclude></span>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsLabel', [bsLabel]);

    function bsLabel() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                ctx: '<?'
            },
            template: '<span class="label label-{{ctx}}" ng-transclude></span>',
            link: bsLabelLink
        };

        function bsLabelLink(scope, elem, attr) {
            if (scope.ctx === undefined) {
                scope.ctx = 'default';
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsBadge', [bsBadge]);

    function bsBadge() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="badge" ng-transclude></span>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsPageHeader', [bsPageHeader]);

    function bsPageHeader() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '<',
                subTitle: '<?'
            },
            template: '<div class="page-heading"><h1>{{title}}<span ng-if="subTitle">&nbsp;<small>{{subTitle}}</small></span></h1></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsPanel', [bsPanel]);

    function bsPanel() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                ctx: '<?',
                header: '<?',
                icon: '<?'
            },
            template: '<div class="panel panel-{{ctx}}"><div ng-if="header || icon" class="panel-heading"><span><span ng-if="icon"><i class="{{icon}}"></i>&nbsp;</span>{{header}}</span></div><div ng-transclude></div></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsPanelBody', [bsPanelBody]);

    function bsPanelBody() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="panel-body" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsPanelFooter', [bsPanelFooter]);

    function bsPanelFooter() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="panel-footer" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .factory('$bsTable', ['$bsEventsManager', '$q', '$filter', bsTableDef]);

    function bsTableDef($bsEventsManager, $q, $filter) {

        return tableDef;

        function tableDef() {

            var self = this;

            self.$toggle = false;
            self.$hasSelected = false;
            self.$total = 0;
            self.$data = [];
            self.$loading = false;
            self.$autoReload = true;
            self.$params = {
                page: 1,
                pages: 0,
                perPage: 10,
                sortBy: undefined,
                sortOrder: 1
            };
            self.$settings = {
                responseItemsField: 'items',
                responseTotalField: 'total',
                responseHttp: false,
                scrollable: false
            };

            self.getData = getData;
            self.reload = reload;
            self.select = select;
            self.selectAll = selectAll;
            self.deselect = deselect;
            self.deselectAll = deselectAll;
            self.toggle = toggle;
            self.toggleAll = toggleAll;
            self.page = page;
            self.perPage = perPage;
            self.sort = sort;
            self.getSelected = getSelected;

            function getData() {
                return $q.resolve({items: [], total: 0});
            }

            function reload() {

                self.$loading = true;
                $bsEventsManager.trigger('$bsTableLoadStart', self.$params);

                self.getData(self.$params).then(_success, _fail);

                function _success(responseData) {
                    self.$loading = false;
                    $bsEventsManager.trigger('$bsTableLoadSuccess', self.$params, responseData);
                    if (self.$settings.responseHttp && responseData.data !== undefined) {
                        responseData = responseData.data;
                    }
                    self.$data = responseData[self.$settings.responseItemsField] || [];
                    self.$total = parseInt(responseData[self.$settings.responseTotalField] || 0);
                    self.$params.pages = Math.ceil(self.$total / self.$params.perPage);
                    if (self.$params.page > self.$params.pages) {
                        self.$params.page = self.$params.pages;
                    }
                }
                function _fail(responseData) {
                    self.$loading = false;
                    $bsEventsManager.trigger('$bsTableLoadError', self.$params, responseData);
                    self.$data = [];
                    self.$total = 0;
                    self.$params.pages = 0;
                }
            }

            function getSelected() {
                return $filter('filter')(self.$data, {$$selected: true});
            }

            function select(row) {
                row.$$selected = true;
                $bsEventsManager.trigger('$bsTableRowSelected', row);
                self.$toggle = self.getSelected().length == self.$data.length;
                self.$hasSelected = true;
            }

            function selectAll() {
                angular.forEach(self.$data, function(row) {
                    row.$$selected = true;
                });
                $bsEventsManager.trigger('$bsTableAllSelected');
                self.$toggle = true;
                self.$hasSelected = true;
            }

            function deselect(row) {
                row.$$selected = false;
                $bsEventsManager.trigger('$bsTableRowDeselected', row);
                self.$toggle = false;
                self.$hasSelected = self.getSelected().length > 0;
            }

            function deselectAll() {
                angular.forEach(self.$data, function(row) {
                    row.$$selected = false;
                });
                $bsEventsManager.trigger('$bsTableAllDeselected');
                self.$toggle = false;
                self.$hasSelected = false;
            }

            function toggle(row, to) {
                if (to === undefined) {
                    row.$$selected = !row.$$selected;
                } else {
                    row.$$selected = to;
                }
                if (row.$$selected) {
                    self.select(row);
                } else {
                    self.deselect(row);
                }
            }

            function toggleAll(to) {
                if (to === undefined) {
                    self.$toggle = !self.$toggle;
                } else {
                    self.$toggle = to;
                }
                if (self.$toggle) {
                    self.selectAll();
                } else {
                    self.deselectAll();
                }
            }

            function sort(field) {
                if (self.$params.sortBy == field) {
                    self.$params.sortOrder *= -1;
                } else {
                    self.$params.sortBy = field;
                    self.$params.sortOrder = 1;
                }
                if (self.$autoReload) {
                    self.reload();
                }
            }

            function page(page) {
                self.$params.page = page;
                if (self.$autoReload) {
                    self.reload();
                }
            }

            function perPage(perPage) {
                self.$params.perPage = perPage;
                if (self.$autoReload) {
                    self.reload();
                }
            }

        }
    }

})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsTable', [bsTable]);

    function bsTable() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                $table: '=table'
            },
            template: '<div></div>',
            link: bsTableLink,
            controller: ['$scope', bsTableCtrl]
        };
        function bsTableLink(scope, elem, attr, ctrl, $transclude) {
            $transclude(scope, function(clone) {
                angular.element(elem).append(clone);
            });
            scope.$table.reload();
            angular.element(elem).addClass('bs-table');
        }
        function bsTableCtrl($scope) {
            this.getTable = function() {
                return $scope.$table;
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsTableSort', ['$compile', bsTableSort]);

    function bsTableSort($compile) {
        return {
            restrict: 'A',
            require: '^^bsTable',
            replace: true,
            scope: {
                bsTableSort: '@'
            },
            compile: bsTableSortCompile
        };
        function bsTableSortLink(scope, elem, attr, ctrl) {
            scope.$table = ctrl.getTable();
        }
        function bsTableSortCompile(elem, attr) {
            angular.element(elem).append('<i class="pull-right" ng-if="$table.$params.sortBy == \'' + attr.bsTableSort + '\'"><span ng-if="$table.$params.sortOrder == 1" class="glyphicon glyphicon-menu-up"></span><span ng-if="$table.$params.sortOrder == -1"  class="glyphicon glyphicon-menu-down"></span></i>');
            return bsTableSortLink;
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .constant('$bsAlertsConfig', {
            allowHtml: false,
            showIcon: true,
            duration: 5000,
            autoDismiss: true,
            maxAlerts: 4
        });
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .service('$bsAlerts', ['$bsAlertsConfig', '$bsEventsManager', '$timeout', '$filter', bsAlerts]);

    function bsAlerts($bsAlertsConfig, $bsEventsManager, $timeout, $filter) {

        var alerts = [];

        this.success = success;
        this.warning = warning;
        this.info = info;
        this.danger = danger;
        this.custom = alert;
        this.dismiss = dismissAlert;
        this.$alerts = function() { return alerts; };
        this.$maxAlerts = $bsAlertsConfig.maxAlerts;

        function success(message) {
            alert('success', message, 'glyphicon glyphicon-ok-sign');
        }

        function warning(message) {
            alert('warning', message, 'glyphicon glyphicon-exclamation-sign');
        }

        function danger(message) {
            alert('danger', message, 'glyphicon glyphicon-remove-sign');
        }

        function info(message) {
            alert('info', message, 'glyphicon glyphicon-info-sign');
        }

        function alert(type, message, icon, options) {
            var alert = createAlert(type, message, icon, options);
            alert.$timeout = $timeout(function() {
                removeAlert(alert);
            }, alert.duration);
            $bsEventsManager.trigger('$bsAlertPoped', alert);
            alerts.push(alert);
        }

        function createAlert(type, message, icon, options) {
            if (options !== undefined) {
                options = angular.extend({}, $bsAlertsConfig, options);
            } else {
                options = $bsAlertsConfig;
            }
            return {
                id: getId(),
                type: type,
                message: message,
                icon: icon,
                $timeout: null,
                duration: options.duration,
                autoDismiss: options.autoDismiss,
                allowHtml: options.allowHtml,
                showIcon: options.showIcon
            };
        }

        function removeAlert(alert) {
            alerts.splice(alerts.indexOf(alert), 1);
            $bsEventsManager.trigger('$bsAlertRemoved', alert);
        }

        function dismissAlert(alert) {
            $timeout.cancel(alert.$timeout);
            $bsEventsManager.trigger('$bsAlertDismissed', alert);
            removeAlert(alert);
        }

        function getId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        function getById(id) {
            var alert = $filter('filter')(alerts, {id: id});
            if (alert instanceof Array && alert.length == 1) {
                return alert[0];
            } else {
                return null;
            }
        }
    }

})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsAlertsContainer', ['$bsAlerts', bsAlertsContainer]);
    
    function bsAlertsContainer($bsAlerts) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            template: '<div class="bs-alerts-container"><bs-alert ng-repeat="alert in $service.$alerts() | limitTo: $service.$maxAlerts track by $index" ctx="alert.type" dismissible="false" ng-click="$service.dismiss(alert)"><span ng-if="alert.icon"><i class="{{alert.icon}}"></i>&nbsp;</span><span ng-if="alert.allowHtml" ng-bind-html="alert.message"></span><span ng-if="!alert.allowHtml">{{alert.message}}</span></bs-alert></div>',
            link: bsAlertsContainerLink
        };
        function bsAlertsContainerLink(scope, elem, attr) {
            scope.$service = $bsAlerts;
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsSelectNumeric', [bsSelectNumeric]);

    function bsSelectNumeric() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: bsSelectNumericLink
        };
        function bsSelectNumericLink(scope, elem, attr, ngModel) {
            ngModel.$parsers.push(function(val) {
                return val ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function(val) {
                return val ? '' + val : null;
            });
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsRow', [bsRow]);

    function bsRow() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="row" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsContainer', [bsContainer]);

    function bsContainer() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                fluid: '<?'
            },
            template: '<div ng-class="{\'container\': !fluid, \'container-fluid\': fluid}" ng-transclude></div>'
        };
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsCol', [bsCol]);

    function bsCol() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                xs: '<?',
                sm: '<?',
                md: '<?',
                lg: '<?',
                offXs: '<?',
                offSm: '<?',
                offMd: '<?',
                offLg: '<?',
            },
            template: '<div class="col-xs-{{xs}} col-sm-{{sm}} col-md-{{md}} col-lg-{{lg}} col-xs-offset-{{offXs}} col-sm-offset-{{offSm}} col-md-offset-{{offMd}} col-lg-offset-{{offLg}}" ng-transclude></div>',
            link: bsColLink
        };

        function bsColLink(scope) {
            if (scope.xs === undefined) {
                scope.xs = 12;
            }
            if (scope.sm === undefined) {
                scope.sm = 12;
            }
            if (scope.md === undefined) {
                scope.md = 12;
            }
            if (scope.lg === undefined) {
                scope.lg = 12;
            }
        }
    }
})();

(function() {
    "use strict";
    angular
        .module('bsAngular')
        .directive('bsFormValidation', [bsFormValidation]);

    function bsFormValidation() {
        return {
            restrict: 'A',
            require: 'form',
            link: bsFormValidationLink
        };

        function bsFormValidationLink(scope, elem, attr, formCtrl) {
            var form = scope[attr.name];
            formCtrl.$triggerValidation = function() {
                angular.forEach(form, function(field, name) {
                    if (typeof name === 'string' && !name.match('^[\$]')) {
                        if (field.$pristine) {
                            field.$setDirty();
                        }
                    }
                });
                return form.$valid;
            };
        }

    }
})();