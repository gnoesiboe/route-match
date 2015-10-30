/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class Route {

    /**
     * @param {String} name
     * @param {String} pattern
     * @param {Object} payload
     */
    constructor(name, pattern, payload = {}) {
        this._name = name;
        this._pattern = pattern;
        this._payload = payload;
    }

    /**
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {String}
     */
    get pattern() {
        return this._pattern;
    }

    /**
     * @returns {Object}
     */
    get payload() {
        return this._payload;
    }
}

export default Route;
