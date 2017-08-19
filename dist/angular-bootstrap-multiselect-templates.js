angular.module('btorfs.multiselect.templates', ['multiselect.html']);

angular.module("multiselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("multiselect.html",
    "<div class=\"btn-group\" style=\"width: 100%\">\n" +
    "    <button type=\"button\" class=\"form-control btn btn-default btn-block dropdown-toggle\" ng-click=\"toggleDropdown()\" ng-disabled=\"disabled\" ng-class=\"{'strong': selectedOptions.length > 0}\">\n" +
    "    {{getButtonText()}}&nbsp;\n" +
    "    <i class='fa fa-angle-down'></i>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-form\"\n" +
    "        ng-style=\"{display: open ? 'block' : 'none'}\" style=\"width: 100%; overflow-x: auto\">\n" +
    "        <li ng-show=\"showSelectAll\">\n" +
    "            <a ng-click=\"selectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\"></span> Select All\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"showUnselectAll\">\n" +
    "            <a ng-click=\"unselectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span> Unselect All\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"(showSelectAll || showUnselectAll)\"\n" +
    "            class=\"divider\">\n" +
    "        </li>\n" +
    "        <li ng-show=\"!isReachedLimit() && showSearch\">\n" +
    "            <div class=\"dropdown-header\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" style=\"width: 100%;\"\n" +
    "                ng-model=\"searchFilter\" placeholder=\"חפש...\" ng-change=\"updateOptions()\"/>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li ng-show=\"!isReachedLimit() && showSearch\" class=\"divider search-divider\"></li>\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in selectedOptions\" class=\"active\">\n" +
    "            <a class=\"item-selected\">\n" +
    "                {{getDisplay(option)}}\n" +
    "                <span class=\"fa fa-times-circle\" ng-click=\"toggleItem(option); $event.stopPropagation()\"></span>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"!isReachedLimit() && selectedOptions.length > 0\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in unselectedOptions | filter: filterFunc() | filter:search() | limitTo: searchLimit\"\n" +
    "            ng-if=\"!isSelected(option)\"\n" +
    "            ng-hide=\"isReachedLimit()\">\n" +
    "            <a class=\"item-unselected\" href=\"\" ng-click=\"toggleItem(option); $event.stopPropagation()\">\n" +
    "                {{getDisplay(option)}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"divider\" ng-show=\"selectionLimit > 1\"></li>\n" +
    "        <li role=\"presentation\" ng-show=\"selectionLimit > 1\">\n" +
    "            <a>{{selectedOptions.length || 0}} / {{selectionLimit}} נבחרו</a>\n" +
    "        </li>\n" +
    "       <li class=\"divider\" ng-if=\"selectedOptions.length > 0\"></li>\n" +
    "       <li role=\"presentation\" class=\"select-btn\" ng-click=\"toggleDropdown()\" ng-if=\"selectedOptions.length > 0\">\n" +
    "          <button class=\"btn btn-block btn-blue\">בחר</button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
