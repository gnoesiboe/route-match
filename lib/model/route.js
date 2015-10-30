/**
 * @author Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
class Route {

    /**
     * @param {String} name
     * @param {String} pattern
     */
    constructor(name, pattern) {
        this._name = name;
        this._pattern = pattern;
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
}

export default Route;
