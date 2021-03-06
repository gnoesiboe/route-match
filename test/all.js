import { assert } from 'chai';
import * as library from './../index.js';
import InvalidRouteCollectionError from './../build/error/InvalidRouteCollectionError.js';
import InvalidRouteError from './../build/error/InvalidRouteError.js';
import RouteMissingError from './../build/error/RouteMissingError.js';
import InvalidParameterError from './../build/error/InvalidParameterError.js';
import RouteMatch from './../build/model/routeMatch.js';

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
            var arrayWithNonAcceptedValue = ['non accepted value'];

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

        it('Allows me to retrieve all routes from a collection at once', function () {
            var myRoute = new library.Route('some_route', '/some-path');

            var myRouteCollection = new library.RouteCollection([
                myRoute
            ]);

            assert.ok(myRouteCollection.count() === 1);

            var anArrayWithAllRoutes = myRouteCollection.all();

            assert.ok(anArrayWithAllRoutes.indexOf(myRoute) !== -1);
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
    });

    describe('Loping through the routes in the collection', function () {
        it('Allows you to loop through all items', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            var count = 0;

            myRouteCollection.each(function (route) {
                assert.ok(route instanceof library.Route);

                count++;
            });

            assert.ok(myRouteCollection.count() === count);
        });
    });
});


describe('PathMatcher', function () {
    describe('Instantiation', function () {
        it('Throws an Error when instantiated without route collection', function () {
            try {
                new library.PathMatcher();

                assert.notOk('PathGenerator could be instantiated without route collection');
            } catch (error) {
                assert.ok(error instanceof InvalidRouteCollectionError);
            }
        });

        it('Instantiates when providing a valid instance of Route Collection', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            assert.ok(myPathMatcher instanceof library.PathMatcher);
        });
    });

    describe('Matching urls', function () {
        it('Returns null when no route matches', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            assert.ok(myPathMatcher.match('/some-other-route') === null);
        });

        it('Returns a RouteMatch instance when a route matches', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/some-path')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            assert.ok(myPathMatcher.match('/some-path') instanceof RouteMatch);
        });

        it('Allows you to to define route parameters', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/user/:id')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            var match = myPathMatcher.match('/user/10');

            assert.ok(match instanceof RouteMatch);
            assert.ok(typeof match.params['id'] !== 'undefined');
            assert.ok(parseInt(match.params['id']) === 10);
        });

        it('Allows you to specify a regex against route parameters', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/user/:id(\\d+)')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            assert.ok(myPathMatcher.match('/user/12') instanceof RouteMatch);
            assert.ok(myPathMatcher.match('/user/test') === null);
        });

        it('Supports query parameters', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('some_route', '/user/:id(\\d+)')
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            var match = myPathMatcher.match('/user/12?test=10&test2=water');

            assert.ok(match instanceof RouteMatch);

            assert.ok(typeof match.params['test'] !== 'undefined');
            assert.ok(match.params['test'] === '10');

            assert.ok(typeof match.params['test2'] !== 'undefined');
            assert.ok(match.params['test2'] === 'water');
        });
    });

    describe('supplying route playloads', function () {
        it('supplies the route\'s payload, when the route is matched', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('home', '/', {
                    _controller: 'home',
                    _action: 'index'
                })
            ]);

            var myPathMatcher = new library.PathMatcher(myRouteCollection);

            var match = myPathMatcher.match('/');

            assert.ok(typeof match.routePayload['_controller'] !== 'undefined');
            assert.ok(match.routePayload._controller === 'home');

            assert.ok(typeof match.routePayload['_action'] !== 'undefined');
            assert.ok(match.routePayload._action === 'index');
        })
    })
});

describe('PathGenerator', function () {
    describe('Instantiation', function () {
        it('Throws an error when instantiated without a route collection', function () {
            try {
                new library.PathGenerator();

                assert.notOk('Should not get to this point');
            } catch (error) {
                assert.ok(error instanceof InvalidRouteCollectionError);
            }
        });

        it('Allows instantiation with a route collection', function () {
            var myPathGenerator = new library.PathGenerator(new library.RouteCollection());

            assert.ok(myPathGenerator instanceof library.PathGenerator);
        });
    });

    describe('Generating urls', function () {
        it('throws an error when you try to generate an url for an non-existant route', function () {
            var myRouteCollection = new library.RouteCollection([]);

            var myPathGenerator = new library.PathGenerator(myRouteCollection);

            try {
                myPathGenerator.generate('non_existant_route');

                assert.notOk('Should not get to this point');
            } catch (error) {
                assert.ok(error instanceof RouteMissingError);
            }
        });

        it('Generates an url without parameters', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('home', '/')
            ]);

            var myPathGenerator = new library.PathGenerator(myRouteCollection);

            assert.ok(myPathGenerator.generate('home') === '/');
        });

        it('Generates an url with parameters', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('user_detail', '/user/:id')
            ]);

            var myPathGenerator = new library.PathGenerator(myRouteCollection);

            var generatedPath = myPathGenerator.generate('user_detail', {
                id: 10
            });

            assert.ok(generatedPath === '/user/10');
        });

        it('Validates if the supplied parameters match the required pattern', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('user_detail', '/user/:id(\\d+)')
            ]);

            var myPathGenerator = new library.PathGenerator(myRouteCollection);

            try {
                myPathGenerator.generate('user_detail', {
                    id: 'not_allowed_value'
                });
            } catch (error) {
                assert.ok(error instanceof InvalidParameterError);
            }
        });

        it('Adds extra parameters as query parameters to the url', function () {
            var myRouteCollection = new library.RouteCollection([
                new library.Route('home', '/')
            ]);

            var myPathGenerator = new library.PathGenerator(myRouteCollection);

            var generatedUrl = myPathGenerator.generate('home', {
                test: 'other'
            });

            assert.ok(generatedUrl === '/?test=other');
        });
    });
});
