import { assert } from 'chai';
import UrlGenerator from './../lib/utility/urlGenerator.js';

describe('UrlGenerator', function () {
    describe('Instantiation', function () {

        it('Throws an Error when instantiated without route collection', function () {
            try {
                new UrlGenerator();

                assert.ok(false, 'UrlGenerator could be instantiated without route collection');
            } catch (error) {
                assert.ok(error instanceof Error, 'Something is thrown but not an instance of Error');
            }
        });
    })
});
