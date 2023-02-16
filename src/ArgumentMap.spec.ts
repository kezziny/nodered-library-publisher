import { Argument, ArgumentMap } from "./Argument";

describe('ArgumentMap', () => {
    beforeEach(() => {});

	describe('constructor', () => {
		it('schema - OK', async () => {
		});

		it('arguments - OK', async () => {
		});
    });

    describe('eval', () => {
        describe('type', () => {
            it('OK', async () => {
                let arg = new ArgumentMap({key: {type: "text"}});
				expect(arg.eval({key: "text"})).toMatchObject({key: "text"});
            });

			it('ERROR', async () => {
                let arg = new ArgumentMap({key: {type: "text"}});

				try {
					arg.eval(42);
					expect(true).toBeFalsy();
				} catch (e) {
					expect(e instanceof Error).toBe(true);
					expect(e.message).toBe(`Data should be type of map`);
				}
            });
        });

		describe('field validation', () => {
			it('ERROR', async () => {
                let arg = new ArgumentMap({key: {type: "text"}});

				try {
					arg.eval({key: 42});
					expect(true).toBeFalsy();
				} catch (e) {
					expect(e instanceof Error).toBe(true);
					expect(e.message).toBe(`Field 'key': key must be type of string`);
				}
            });
        });
    });
});
