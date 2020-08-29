// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Chai {
    interface Assertion {
        beenCalled: Assertion;
        beenCalledWith(...args: unknown[]): Assertion;
        beenLastCalledWith(...args: unknown[]): Assertion;
        beenNthCalledWith(nthCall: number, ...args: unknown[]): Assertion;
        beenCalledTimes(times: number): Assertion;

        returned: Assertion;
        returnedTimes(count: number): Assertion;
        returnedWith(expected: unknown): Assertion;
        lastReturnedWith(expected: unknown): Assertion;
        nthReturnedWith(nthCall: number, expected: unknown): Assertion;
    }
}
