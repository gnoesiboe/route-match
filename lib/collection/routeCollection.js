/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class RouteCollection
{

    /**
     * @param {Array} routes
     */
    constructor(routes = []) {
        this._routes = routes;
    }

    /**
     * @param {Route} route
     *
     * @returns {RouteCollection}
     */
    add(route) {
        this._routes.push(route);

        return this;
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
