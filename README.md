# chai-jest

[![NPM version](https://badge.fury.io/js/chai-jest.svg)](https://npmjs.org/package/chai-jest)
![Build Status](https://github.com/jwalton/chai-jest/workflows/GitHub%20CI/badge.svg)

## Description

Adds functions for testing Jest mocks to chai.

If you're using `chai` with jest, but you still want access to the mock-related
functions on jest's `expect` such as `toHaveBeenCalled()`, then this is for you.

## Usage

```ts
import chai from 'chai';
import chaiJest from 'chai-jest';

chai.use(chaiJest);
const { expect } = chai;

describe('My test suite', () => {
    it('should test a jest mock', () => {
        const mock = jest.fn(() => true);

        mock();

        expect(mock).to.have.beenCalled;
        expect(mock).to.have.returnedWith(true);
    });
});
```

## Assertions

- beenCalled
- beenCalledWith(...args: unknown[])
- beenLastCalledWith(...args: unknown[])
- beenNthCalledWith(nthCall: number, ...args: unknown[])
- beenCalledTimes(times: number)
- returned
- returnedTimes(count: number)
- returnedWith(expected: unknown)
- lastReturnedWith(expected: unknown)
- nthReturnedWith(nthCall: number, expected: unknown)

Copyright 2020 Jason Walton
