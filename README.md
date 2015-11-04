# route-match

NPM package that can be used to match and generate url paths agains predefined patterns. Can be used when applying routing in javascript client-side and backend applications. Uses ECMA6 javascript standard.

## Installation

```bash
npm install --save route-match
```

## Usage

When using a client that does not support ECMA6, please use a javascript compiler like [Babel](http://babeljs.io/) to compile the code to a readable format.

### Generating URLs

```javascript
import { Route, RouteCollection, PathGenerator } from 'route-match';

var myRouteCollection = new RouteCollection([
    new Route('user_detail', '/user/:id(\\d+)')
]);

var myPathGenerator = new PathGenerator(myRouteCollection);

console.log(myPathGenerator.generate('user_detail', { id: 10 })); // result: /user/10
```

**Remarks:**

* when you supply more parameters then the route pattern requires, the extra parameters are added to the generated url as query parameters
* when you supply parameters that do not match the requirements an error will be thrown
* Feel free to use non-ECMA6 syntax

### Matching urls against patterns

```javascript
import { Route, RouteCollection, PathMatcher } from 'route-match';

var myRouteCollection = new RouteCollection([
    new Route('user_detail', '/user/:id(\\d+)')
]);

var myPathMatcher = new PathMatcher(myRouteCollection);

console.log(myPathGenerator.match('/user/10'); // result: instance of RouteMatch containing route name, payload and parameters 
```

**Remarks:**

* When the supplied url contains query parameters, they will also be available in the eventual RouteMatch object
* When no route is matched, `null` is returned
* Feel free to use non-ECMA6 syntax

## Running unit tests

```bash
npm test
```

## Compiling ECMA6 code to 'regular' javascript

```bash
npm run compile
```
