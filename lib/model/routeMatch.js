import InvalidRouteError from './../error/InvalidRouteError.js';
import Route from './../model/route.js';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class RouteMatch {

    /**
     * @param {String} route
     * @param {Object} params
     * @param {Object} routePayload
     */
    constructor(route, params = {}, routePayload = {}) {
        this._route = route;
        this._params = params;
        this._routePayload = routePayload;
    }

    /**
     * @return {Object}
     */
    get routePayload() {
        return this._routePayload;
    }

    /**
     * @returns {String}
     */
    get route() {
        return this._route;
    }

    /**
     * @returns {Object}
     */
    get params() {
        return this._params;
    }

    /**
     * @param {String} key
     * @param {*} defaultValue
     *
     * @returns {*}
     */
    get(key, defaultValue = null) {
        return typeof this._params[key] !== 'undefined' ? this._params['key'] : defaultValue;
    }
}

export default RouteMatch;
