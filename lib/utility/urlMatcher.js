import pathToRegexp from 'path-to-regexp';
import RouteMatch from './../model/routeMatch.js';
import RouteCollection from './../collection/routeCollection.js';
import InvalidRouteCollectionError from './../error/InvalidRouteCollectionError.js';
import _ from 'lodash';
import queryString from 'querystring';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class UrlMatcher {

    /**
     * @param {RouteCollection} routeCollection
     */
    constructor(routeCollection) {
        this._setRouteCollection(routeCollection);
    }

    /**
     * @param {RouteCollection} routeCollection
     *
     * @private
     */
    _setRouteCollection(routeCollection) {
        if (!_.isObject(routeCollection) || !routeCollection instanceof RouteCollection) {
            throw new InvalidRouteCollectionError('Expecting an instance of RouteCollection');
        }

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

        var queryStringSplit = path.split('?');

        path = queryStringSplit[0];

        var queryParams = typeof queryStringSplit[1] !== 'undefined'
                ? queryString.parse(queryStringSplit[1])
                : {};

        for (let i = 0, l = allRoutes.length; i < l; i++) {
            let route = allRoutes[i],
                match = this._matchRouteAgainstPath(route, path, queryParams);

            if (match !== null) {
                routeMatch = match;

                break;
            }
        }

        return routeMatch;
    }

    /**
     * @param {String} route
     * @param {String} path
     * @param {Object} queryParams
     *
     * @returns {RouteMatch|null}
     *
     * @private
     */
    _matchRouteAgainstPath(route, path, queryParams) {
        var parameterInfo = [],
            regex = pathToRegexp(route.pattern, parameterInfo);

        var match = path.match(regex);

        if (match === null) {
            return null;
        }

        return new RouteMatch(
            route.name,
            this._extractParamsFromMatchAndParameterInfo(match, parameterInfo, queryParams),
            route.payload
        );
    }

    /**
     * @param {Array} match
     * @param {Array} parameterInfo
     * @param {Object} queryParams
     *
     * @return {Object}
     *
     * @private
     */
    _extractParamsFromMatchAndParameterInfo(match, parameterInfo, queryParams) {
        var paramMatches = match.splice(1),
            out = {};

        for (var i = 0, l = parameterInfo.length; i < l; i++) {
            var parameter = parameterInfo[i];

            out[parameter.name] = paramMatches[i];
        }

        _.merge(out, queryParams);

        return out;
    }
}

export default UrlMatcher;
