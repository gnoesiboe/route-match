import pathToRegexp from 'path-to-regexp';
import RouteMatch from './../model/routeMatch.js';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class UrlMatcher {

    /**
     * @param {RouteCollection} routeCollection
     */
    constructor(routeCollection) {
        this._routeCollection = routeCollection;
    }

    /**
     * @param {String} path
     *
     * @return {Object}
     *
     * @see https://github.com/component/path-to-regexp
     */
    match(path) {
        var routeMatch = null,
            allRoutes = this._routeCollection.all();

        for (let i = 0, l = allRoutes.length; i < l; i++) {
            let route = allRoutes[i];

            let match = this._matchRouteAgainstPath(route, path);

            if (match !== null) {
                routeMatch = match;

                break;
            }
        }

        return routeMatch;
    }

    /**
     * @param route
     * @param path
     *
     * @returns {RouteMatch|null}
     *
     * @private
     */
    _matchRouteAgainstPath(route, path) {
        var parameterInfo = [],
            regex = pathToRegexp(route.pattern, parameterInfo);

        var match = path.match(regex);

        if (match === null) {
            return null;
        }

        return new RouteMatch(
            route.name,
            this._extractParamsFromMatchAndParameterInfo(match, parameterInfo)
        );
    }

    /**
     * @param {Array} match
     * @param {Array} parameterInfo
     *
     * @return {Object}
     *
     * @private
     */
    _extractParamsFromMatchAndParameterInfo(match, parameterInfo) {
        var paramMatches = match.splice(1),
            out = {};

        for (var i = 0, l = parameterInfo.length; i < l; i++) {
            var parameter = parameterInfo[i];

            out[parameter.name] = paramMatches[i];
        }

        return out;
    }
}

export default UrlMatcher;
