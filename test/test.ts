import chai from 'chai';
import chaiJest from '../src';

chai.use(chaiJest);
const { expect } = chai;

describe('My test suite', () => {
    // Setup some test functions.
    const neverCalled = jest.fn((_a: number) => true);

    const calledOnce = jest.fn((_a: number) => true);
    calledOnce(1);

    const calledThreeTimes = jest.fn((_a: number) => true);
    calledThreeTimes(1);
    calledThreeTimes(2);
    calledThreeTimes(3);

    const errored = jest.fn((_a: number) => {
        throw new Error('boom');
    });
    try {
        errored(7);
    } catch {
        /* ignore */
    }

    const sometimesErrored = jest.fn((a: number) => {
        if (a === 1) {
            throw new Error('boom');
        }
    });
    sometimesErrored(0);
    try {
        sometimesErrored(1);
    } catch {
        /* ignore */
    }
    sometimesErrored(2);

    it('should test a jest mock', () => {
        const mock = jest.fn(() => true);

        mock();

        expect(mock).to.have.beenCalled;
        expect(mock).to.have.returned;
        expect(mock).to.have.returnedWith(true);
    });

    it('should error if the object is not a mock', () => {
        expect(() => expect(7).to.have.beenCalled).to.throw('must pass in a mock');
        expect(() => expect(7).to.not.have.beenCalled).to.throw('must pass in a mock');
    });

    it('should error', () => {
        const mock = jest.fn(() => true);

        expect(() => expect(mock).to.have.beenCalled).to.throw();
        expect(() => expect(mock).to.have.returned).to.throw();
        expect(() => expect(mock).to.have.returnedWith(false)).to.throw();
    });

    describe('beenCalled', () => {
        it('should work for a function that has not been called', () => {
            expect(neverCalled).to.not.have.beenCalled;
            expect(() => expect(neverCalled).to.have.beenCalled).to.throw(
                'expected mock to have been called'
            );
        });

        it('should work for a function that has been called', () => {
            expect(calledOnce).to.have.beenCalled;
            expect(() => expect(calledOnce).to.not.have.beenCalled).to.throw(
                'expected mock to not have been called'
            );
        });

        it('should work for a function that has been called muiltiple times', () => {
            expect(calledThreeTimes).to.have.beenCalled;
            expect(() => expect(calledThreeTimes).to.not.have.beenCalled).to.throw(
                'expected mock to not have been called'
            );
        });

        it('should work for a function that returns an error', () => {
            expect(errored).to.have.beenCalled;
            expect(() => expect(errored).to.not.have.beenCalled).to.throw(
                'expected mock to not have been called'
            );
        });

        it('should work for a function that sometimes returns an error', () => {
            expect(sometimesErrored).to.have.beenCalled;
            expect(() => expect(sometimesErrored).to.not.have.beenCalled).to.throw(
                'expected mock to not have been called'
            );
        });
    });

    describe('beenCalledWith', () => {
        it('should work for a function that has not been called', () => {
            expect(neverCalled).to.not.have.beenCalledWith('a');
            expect(() => expect(neverCalled).to.have.beenCalledWith('a')).to.throw(
                'expected mock to have been called with arguments a'
            );
        });

        it('should work for a function that has been called', () => {
            expect(calledOnce).to.have.beenCalledWith(1);
            expect(calledOnce).to.not.have.beenCalledWith('a');
            expect(() => expect(calledOnce).to.have.beenCalledWith('a')).to.throw(
                'expected mock to have been called with arguments a'
            );
            expect(() => expect(calledOnce).to.not.have.beenCalledWith(1)).to.throw(
                'expected mock to not have been called with arguments 1'
            );
        });
    });

    describe('beenLastCalledWith', () => {
        it('should work for a function that has not been called', () => {
            expect(neverCalled).to.not.have.beenLastCalledWith('a');
            expect(() => expect(neverCalled).to.have.beenLastCalledWith('a')).to.throw(
                'expected mock to have been last called with arguments a'
            );
        });

        it('should work for a function that has been called', () => {
            expect(calledOnce).to.have.beenLastCalledWith(1);
            expect(calledOnce).to.not.have.beenLastCalledWith('a');
            expect(() => expect(calledOnce).to.have.beenLastCalledWith('a')).to.throw(
                'expected mock to have been last called with arguments a'
            );
            expect(() => expect(calledOnce).to.not.have.beenLastCalledWith(1)).to.throw(
                'expected mock to not have been last called with arguments 1'
            );
        });
    });

    describe('beenNthCalledWith', () => {
        it('should work for a function that has not been called', () => {
            expect(neverCalled).to.not.have.beenNthCalledWith(2, 'a');
            expect(() => expect(neverCalled).to.have.beenNthCalledWith(2, 'a')).to.throw(
                'expected mock call #2 to have been called with arguments a'
            );
        });

        it('should work for a function that has been called', () => {
            expect(calledOnce).to.have.beenNthCalledWith(1, 1);
            expect(calledOnce).to.not.have.beenNthCalledWith(1, 'a');
            expect(() => expect(calledOnce).to.have.beenNthCalledWith(1, 'a')).to.throw(
                'expected mock call #1 to have been called with arguments a'
            );
            expect(() => expect(calledOnce).to.not.have.beenNthCalledWith(1, 1)).to.throw(
                'expected mock call #1 to not have been called with arguments 1'
            );
        });
    });

    it('should test arguments', () => {
        const mock = jest.fn((_a: string, _b: string) => true);

        mock('a', 'b');
        mock('c', 'd');
        mock('e', 'f');

        expect(mock).to.have.beenCalledWith('a', 'b');
        expect(mock).to.have.beenNthCalledWith(2, 'c', 'd');
        expect(mock).to.have.beenLastCalledWith('e', 'f');
        expect(mock).to.have.returnedWith(true);
    });

    it('should work when negated', () => {
        const mock = jest.fn((_a: string, _b: string) => true);

        mock('a', 'b');

        expect(mock).to.not.have.beenCalledWith('q', 'r');
    });

    it('should test call count', () => {
        const mock = jest.fn((_a: string, _b: string) => true);

        mock('a', 'b');
        mock('c', 'd');
        mock('e', 'f');

        expect(mock).to.have.beenCalledTimes(3);
        expect(mock).to.not.have.beenCalledTimes(2);

        expect(() => expect(mock).to.have.beenCalledTimes(2)).to.throw(
            'expected mock to have been called 2 times'
        );
    });

    it('should test returns', () => {
        let count = 0;
        const mock = jest.fn(() => count++);

        mock();
        mock();
        mock();

        expect(mock).to.have.returned;
        expect(mock).to.have.returnedTimes(3);
        expect(mock).to.have.returnedWith(1);
        expect(mock).to.have.nthReturnedWith(2, 1);
        expect(mock).to.not.have.nthReturnedWith(2, 4);
        expect(mock).to.have.lastReturnedWith(2);

        expect(() => expect(mock).to.not.have.returned).to.throw();
        expect(() => expect(mock).to.have.returnedTimes(1)).to.throw();
        expect(() => expect(mock).to.have.returnedWith(8)).to.throw();
        expect(() => expect(mock).to.have.nthReturnedWith(1, 4)).to.throw();
        expect(() => expect(mock).to.not.have.nthReturnedWith(2, 1)).to.throw();
        expect(() => expect(mock).to.have.lastReturnedWith(1)).to.throw();
    });
});
