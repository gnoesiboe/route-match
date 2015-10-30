import { assert } from 'chai';
import * as library from './../index.js';
import InvalidRouteCollectionError from './../lib/error/InvalidRouteCollectionError.js';
import InvalidRouteError from './../lib/error/InvalidRouteError.js';

describe('RouteCollection', function () {
    describe('Instantiation', function () {

        it('Throws an Error when instantiated with a non-array routes collection', function () {
            var nonArrayValues = [1, 'test', {}, /[a-z]+/];

            for (let i = 0, l = nonArrayValues.length; i < l; i++) {
                try {
                    var test = new library.RouteCollection(nonArrayValues[i]);

                    assert.notOk(`No Error was thrown when providing the value: ${nonArrayValues[i].toString()}`);
                } catch (error) {
                    assert.ok(error instanceof InvalidRouteCollectionError);
                }
            }
        });

        it('Throws an Error when instantiated with an array that does contain non-route instances', function () {
            var arrayWithNonAcceptedValue = [ 'non accepted value' ];

            try {
                new library.RouteCollection(arrayWithNonAcceptedValue);

                assert.notOk(`No Error was trown when providing the value: ${arrayWithNonAcceptedValue.toString()}`);
            } catch (error) {
                assert.ok(error instanceof InvalidRouteError);
            }
        });

        it('Allows instantiation with an array with routes', function () {
            var instance = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            assert.ok(instance instanceof library.RouteCollection, 'Could not instantiate with valid route collection');
        });
    });

    describe('Counting routes', function () {
        it('Returns the valid number of routes in the collection when there are no items in it', function () {
            var myRouteCollection = new library.RouteCollection();

            assert.ok(myRouteCollection.count() === 0);
        });

        it('Returns the valid number of routes in the collection with items in it', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            assert.ok(myRouteCollection.count() === 1);
        });
    });

    describe('Retrieving routes from the collection', function () {
        it('Allows me to retrieve my routes from the collection by name', function () {
            var myRoute = new library.Route('some_route', '/some-path');

            var myRouteCollection = new library.RouteCollection([myRoute]);

            assert.ok(myRouteCollection.findByName('some_route') === myRoute);
        });

        it('Returns a supplied default value when the route was not found', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            var defaultValue = 'default value';

            assert.ok(myRouteCollection.findByName('a_non_existant_route', defaultValue) === defaultValue);
        });

        it('Returns null when the route was not found and no default value was supplied', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            assert.ok(myRouteCollection.findByName('a_non_existant_route') === null);
        });

        it('Allows me to retrieve routes from the collection using a callback function', function () {
            var otherRoute = new library.Route('some_other_route', '/some-other-path');

            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path'),
                otherRoute
            ]);

            var found = myRouteCollection.find(function (route) {
                return route.name.match(/other/) !== null;
            });

            assert.ok(found === otherRoute);
        });
    });

    describe('Removing routes from the collection', function () {
        it('Allows me to remove a route from the collection', function () {
            var myRoute = new library.Route('some_route', '/some-path');

            var myRouteCollection = new library.RouteCollection([
                myRoute
            ]);

            assert.ok(myRouteCollection.count() === 1);

            myRouteCollection.remove(myRoute);

            assert.ok(myRouteCollection.count() === 0);
        });

        it('Allows me to remove a route from the collection by name', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            assert.ok(myRouteCollection.count() === 1);

            myRouteCollection.removeByName('some_route');

            assert.ok(myRouteCollection.count() === 0);
        });

        it('Allows me to remove all routes from the collection at once', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            assert.ok(myRouteCollection.count() === 1);

            myRouteCollection.clear();

            assert.ok(myRouteCollection.count() === 0);
        });
    });

    describe('Adding routes to an existing collection', function () {
        it('Has more routes in it when a new route was added', function () {
            var myRouteCollection = new library.RouteCollection([]);

            myRouteCollection.add(new library.Route('some_route', '/some-path'));

            assert.ok(myRouteCollection.count() === 1);
        });
    })
});

/*describe('UrlGenerator', function () {
    describe('Instantiation', function () {

        it('Throws an Error when instantiated without route collection', function () {
            try {
                new UrlGenerator();

                assert.ok(false, 'UrlGenerator could be instantiated without route collection');
            } catch (error) {
                assert.ok(error instanceof Error);
            }
        });
    });
});*/
