import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import RouteCollection from './../collection/routeCollection.js';
import InvalidRouteCollectionError from './../error/InvalidRouteCollectionError.js';
import RouteMissingError from './../error/RouteMissingError.js';
import InvalidParameterError from './../error/InvalidParameterError.js';
import queryString from 'query-string';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class UrlGenerator {

    /**
     * @param {RouteCollection} routeCollection
     */
    constructor(routeCollection) {
        if (!_.isObject(routeCollection) || !routeCollection instanceof RouteCollection) {
            throw new InvalidRouteCollectionError('Please supply a valid RouteCollection');
        }

        this._routeCollection = routeCollection;
    }

    /**
     * @param {String} name
     * @param {Object} params
     *
     * @return {String}
     */
    generate(name, params = {}) {
        var route = this._extractRouteWithNameOrThrow(name);

        var requiredRouteParams = [];
        pathToRegexp(route.pattern, requiredRouteParams);

        // copy suppliedRouteParams to make sure that we do not alter the object supplied by the client
        // in the process of generating the url
        var suppliedRouteParams = _.extend({}, params);

        var path = route.pattern;

        for (let i = 0, l = requiredRouteParams.length; i < l; i++) {
            let routeParam = requiredRouteParams[i];

            if (typeof suppliedRouteParams[routeParam.name] === 'undefined') {
                if (routeParam.optional === false) {
                    this._throwMissingRequiredRouteParameterError(routeParam, name);
                }

                // optional parameter was not supplied
                suppliedRouteParams[routeParam.name] = '';
            } else {
                // parameter was supplied

                var suppliedRouteParamValue = this._ensureIsString(suppliedRouteParams[routeParam.name]);

                if (suppliedRouteParamValue.match(routeParam.pattern) === null) {
                    this._throwInvalidRouteParameterError(routeParam, name);
                }

                // apply parameter replacement on path
                var pattern = new RegExp(':' + routeParam.name + '[^/]*');

                path = path.replace(pattern, suppliedRouteParamValue);

                // remove param to be able to see which extra params are supplied at the end
                delete suppliedRouteParams[routeParam.name];
            }
        }

        // the left over route params are added as query params
        if (Object.keys(suppliedRouteParams).length > 0) {
            path += '?' + queryString.stringify(suppliedRouteParams);
        }

        return path;
    }

    /**
     * @param {Object} requiredParam
     * @param {String} routeName
     *
     * @private
     */
    _throwMissingRequiredRouteParameterError(requiredParam, routeName) {
        throw new Error(`Missing required parameter '${requiredParam.name}' to generate route '${routeName}'`);
    }

    /**
     * @param {Object} requiredParam
     * @param {String} routeName
     *
     * @private
     */
    _throwInvalidRouteParameterError(requiredParam, routeName) {
        throw new InvalidParameterError(
            `Supplied parameter '${requiredParam.name}' does not match required pattern '${requiredParam.pattern}'
            when generating route '${routeName}'`
        );
    }

    /**
     * @param {*} value
     * @returns {String}
     *
     * @private
     */
    _ensureIsString(value) {
        return _.isString(value) ? value : value.toString();
    }

    /**
     * @param {String} name
     * @returns {Route|*}
     *
     * @private
     */
    _extractRouteWithNameOrThrow(name) {
        var route = this._routeCollection.findByName(name, null);

        if (route === null) {
            throw new RouteMissingError(`No route found with name: '${name}'`);
        }

        return route;
    }
}

export default UrlGenerator;
