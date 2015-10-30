import _ from 'lodash';
import Route from './../model/route.js';
import InvalidRouteCollectionError from './../error/InvalidRouteCollectionError.js';
import InvalidRouteError from './../error/InvalidRouteError.js';

/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class RouteCollection
{

    /**
     * @param {Array} routes
     */
    constructor(routes = []) {
        this.setRoutes(routes);
    }

    /**
     * @param {Array} routes
     */
    setRoutes(routes) {
        if (!_.isArray(routes)) {
            throw new InvalidRouteCollectionError('Please provide an array with Route instances');
        }

        this.clear();

        for (let i = 0, l = routes.length; i < l; i++) {
            this.add(routes[i]);
        }
    }

    /**
     * Clears the collection
     */
    clear() {
        this._routes = [];
    }

    /**
     * @param {Route} route
     *
     * @returns {RouteCollection}
     */
    add(route) {
        this._validateIsRouteInstance(route);

        this._routes.push(route);

        return this;
    }

    /**
     * @param {Route} route
     *
     * @returns {RouteCollection}
     */
    remove(route) {
        this._validateIsRouteInstance(route);

        var foundAtIndex = this._routes.indexOf(route);

        if (foundAtIndex > -1) {
            this._routes.splice(foundAtIndex, 1);
        }

        return this;
    }

    /**
     * @param {Route} route
     *
     * @private
     */
    _validateIsRouteInstance(route) {
        if (!_.isObject(route) || !route instanceof Route) {
            throw new InvalidRouteError('Please provide an instances of Route');
        }
    }

    /**
     * @param {Function} callback
     * @param {*} defaultValue
     *
     * @returns {Route|*}
     */
    find(callback, defaultValue = null) {
        for (let i = 0, l = this._routes.length; i < l; i++) {
            if (callback(this._routes[i])) {
                return this._routes[i];
            }
        }

        return defaultValue;
    }

    /**
     * @param {String} name
     * @param {*} defaultValue
     *
     * @returns {Route|*}
     */
    findByName(name, defaultValue =  null) {
        return this.find(
            function (route) {
                return route.name === name;
            },
            defaultValue
        );
    }

    /**
     * @returns {Number}
     */
    count() {
        return this._routes.length;
    }

    /**
     * @returns {Array}
     */
    all() {
        return this._routes;
    }

    each(callback) {
        for (let i = 0, l = this._routes.length; i < l; i++) {
            callback(this._routes[i]);
        }
    }
}

export default RouteCollection;
