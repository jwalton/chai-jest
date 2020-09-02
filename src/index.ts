import { Assertion } from 'chai';
import expect from 'expect';
import './chaiExtensions';

function getReturnCount(mock: jest.Mock) {
    return mock.mock.results.filter((r) => r && r.type === 'return').length;
}

function getCallCount(mock: jest.Mock) {
    return mock.mock.calls.length;
}

function wrapJestExpect(
    self: Chai.AssertionStatic,
    fn: () => void,
    failMessage: string,
    notFailMessage: string,
    expected?: unknown,
    actual?: unknown,
    showDiff?: boolean
) {
    let success = true;
    try {
        fn();
    } catch (err) {
        success = false;
    }
    self.assert(success, failMessage, notFailMessage, expected, actual, showDiff);
}

const chaiJest: Chai.ChaiPlugin = (chai) => {
    function assertIsMock(mock: any): mock is jest.Mock {
        const isMock =
            typeof mock === 'function' &&
            'mock' in mock &&
            typeof mock.mock === 'object' &&
            Array.isArray(mock.mock.calls) &&
            Array.isArray(mock.mock.results);

        new Assertion(isMock, 'must pass in a mock').to.be.true;
        return true;
    }

    chai.Assertion.addProperty('beenCalled', function () {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        const failMessage = `expected mock to have been called\n\n` +
            `Expected number of calls: >= 1\n` +
            `Received number of calls:    0`;
        const notFailMessage = `expected mock to not have been called\n\n` +
            `Expected number of calls: 0\n` +
            `Received number of calls: ${getCallCount(mock)}`;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveBeenCalled(),
            failMessage,
            notFailMessage
        );
    });

    chai.Assertion.addMethod('beenCalledWith', function (...args: unknown[]) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveBeenCalledWith(...args),
            `expected mock to have been called with arguments ${args.join(', ')}`,
            `expected mock to not have been called with arguments ${args.join(', ')}`,
            args
        );
    });

    chai.Assertion.addMethod('beenLastCalledWith', function (...args: unknown[]) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveBeenLastCalledWith(...args),
            `expected mock to have been last called with arguments ${args.join(', ')}`,
            `expected mock to not have been last called with arguments ${args.join(', ')}`,
            args,
            mock.mock.calls[mock.mock.calls.length - 1]
        );
    });

    chai.Assertion.addMethod('beenNthCalledWith', function (nthCall: number, ...args: unknown[]) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveBeenNthCalledWith(nthCall, ...args),
            `expected mock call #${nthCall} to have been called with arguments ${args.join(', ')}`,
            `expected mock call #${nthCall} to not have been called with arguments ${args.join(
                ', '
            )}`,
            args,
            mock.mock.calls[nthCall - 1]
        );
    });

    chai.Assertion.addMethod('beenCalledTimes', function (times: number) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveBeenCalledTimes(times),
            `expected mock to have been called ${times} times`,
            `expected mock to not have been called ${times} times`,
            times,
            mock.mock.calls.length
        );
    });

    chai.Assertion.addProperty('returned', function () {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;


        wrapJestExpect(
            this,
            () => expect(mock).toHaveReturned(),
            `expected mock to have returned`,
            `expected mock to not have returned`,
        );
    });

    chai.Assertion.addMethod('returnedTimes', function (times: number) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveReturnedTimes(times),
            `expected mock to have been return ${times} times`,
            `expected mock to not have been return ${times} times`,
            times,
            getReturnCount(mock)
        );
    });

    chai.Assertion.addMethod('returnedWith', function (expected: unknown) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        wrapJestExpect(
            this,
            () => expect(mock).toHaveReturnedWith(expected),
            `expected mock to have returned with ${expected}`,
            `expected mock to not have returned with ${expected}`,
            expected
        );
    });

    chai.Assertion.addMethod('lastReturnedWith', function (expected: unknown) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        const { results } = mock.mock;
        const lastResult = results[results.length - 1];

        wrapJestExpect(
            this,
            () => expect(mock).toHaveLastReturnedWith(expected),
            `expected mock's last call to return ${expected}`,
            `expected mock's last call to not return ${expected}`,
            expected,
            lastResult.value
        );
    });

    chai.Assertion.addMethod('nthReturnedWith', function (nthCall: number, expected: unknown) {
        assertIsMock(this._obj);
        const mock = this._obj as jest.Mock;

        const { results } = mock.mock;
        const result = results[nthCall - 1];

        wrapJestExpect(
            this,
            () => expect(mock).toHaveNthReturnedWith(nthCall, expected),
            `expected mock call #${nthCall} to return ${expected}`,
            `expected mock call #${nthCall} to not return ${expected}`,
            expected,
            result.value
        );
    });
};

export default chaiJest;
