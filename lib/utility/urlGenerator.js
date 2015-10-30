import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import RouteCollection from './../collection/routeCollection.js';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class UrlGenerator {

    /**
     * @param {RouteCollection} routeCollection
     */
    constructor(routeCollection) {
        if (typeof routeCollection === 'undefined' || !routeCollection instanceof RouteCollection) {
            throw new Error('Please supply an valid RouteCollection');
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

        var routeParams = [];
        pathToRegexp(route.pattern, routeParams);

        // copy suppliedRouteParams to make sure that we do not alter the object supplied by the client
        // in the process of generating the url
        var suppliedRouteParams = _.extend({}, params);

        var path = route.pattern;

        for (let i = 0, l = routeParams.length; i < l; i++) {
            let routeParam = routeParams[i];

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
            }
        }

        // @todo add extra parameters as query string to url

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
        throw new Error(
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
            throw new Error(`No route found with name: '${name}'`);
        }

        return route;
    }
}

export default UrlGenerator;
