# route-match

NPM package that can be used to match and generate url paths agains predefined patterns. Can be used when applying routing in javascript client-side and backend applications. Uses ECMA6 javascript standard.

## Installation

```bash
npm install --save route-match
```

## Usage

### Generating URLs

```javascript
import { Route, RouteCollection, UrlMatcher } from 'url-matcher';

var myRouteCollection = new RouteCollection([
    new Route('user_detail', '/user/:id(\\d+)')
]);

var myUrlGenerator = new UrlGenerator(myRouteCollection);

console.log(myUrlGenerator.generate('user_detail', { id: 10 })); // result: /user/10
```

**Remarks:**

* when you supply more parameters then the route pattern requires, the extra parameters are added to the generated url as query parameters
* when you supply parameters that do not match the requirements an error will be thrown

### Matching urls against patterns

```javascript
import { Route, RouteCollection, UrlMatcher } from 'url-matcher';

var myRouteCollection = new RouteCollection([
    new Route('user_detail', '/user/:id(\\d+)')
]);

var myUrlMatcher = new UrlMatcher(myRouteCollection);

console.log(myUrlGenerator.match('/user/10'); // result: instance of RouteMatch containing route name, payload and parameters 
```

**Remarks:**

* When the supplied url contains query parameters, they will also be available in the eventual RouteMatch object
* When no route is matched, `null` is returned

## Running unit tests

```bash
npm test
```
