# url-matcher

NPM package that can be used to match and generate url paths agains predefined patterns. To be used when applying routing in javascript.

## Installation

```bash
npm install --save url-matcher
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

### Matching urls against patterns

```javascript
import { Route, RouteCollection, UrlMatcher } from 'url-matcher';

var myRouteCollection = new RouteCollection([
    new Route('user_detail', '/user/:id(\\d+)')
]);

var myUrlMatcher = new UrlMatcher(myRouteCollection);

console.log(myUrlGenerator.match('/user/10'); // result: instance of RouteMatch containing route name, payload and parameters 
```

## Running unit tests

```bash
npm test
```
