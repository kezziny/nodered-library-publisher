import { Argument } from "./Argument";

class CustomType{}

describe('Argument', () => {
    beforeEach(() => {});

    describe('eval', () => {
        describe('required', () => {
            it('required: true - OK', async () => {
                let arg = new Argument({required: true});
				expect(arg.eval("data")).toBe("data");
            });

			it('required: true - NULL', async () => {
                let arg = new Argument({required: true});

				try {
					arg.eval(null);
					expect(true).toBeFalsy();
				} catch (e) {
					expect(e instanceof Error).toBe(true);
					expect(e.message).toBe(`Data is required`);
				}
            });

			it('required: true - UNDEFINED', async () => {
                let arg = new Argument({required: true});

				try {
					arg.eval(undefined);
					expect(true).toBeFalsy();
				} catch (e) {
					expect(e instanceof Error).toBe(true);
					expect(e.message).toBe(`Data is required`);
				}
            });

			it('required: false - OK', async () => {
                let arg = new Argument({required: false});
				expect(arg.eval(null)).toBeNull();
            });
        });

		describe('default', () => {
            it('default: exists - OK', async () => {
                let arg = new Argument({default: "default"});
				expect(arg.eval(undefined)).toBe("default");
            });

			it('default: exists + required: true - OK', async () => {
                let arg = new Argument({default: "default", required: true});
				expect(arg.eval(undefined)).toBe("default");
            });

			it('default: exists + data exists - OK', async () => {
                let arg = new Argument({default: "default"});
				expect(arg.eval("data")).toBe("data");
            });
        });

		describe('type', () => {
			// TODO: required: false, eval undefined

            it('type: "text" - OK', async () => {
                let arg = new Argument({type: "text"});
				expect(arg.eval("text")).toBe("text");
            });

			it('type: "text" - ERROR', async () => {
                let arg = new Argument({type: "text"});
				try {
					arg.eval(42);
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data must be type of string");
				}
            });

			it('type: "number" - OK', async () => {
                let arg = new Argument({type: "number"});
				expect(arg.eval(42)).toBe(42);
            });

			it('type: "number" - ERROR', async () => {
                let arg = new Argument({type: "number"});
				try {
					arg.eval("text");
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data must be type of number");
				}
            });

			it('type: "boolean" - OK', async () => {
                let arg = new Argument({type: "boolean"});
				expect(arg.eval(true)).toBe(true);
            });

			it('type: "boolean" - ERROR', async () => {
                let arg = new Argument({type: "boolean"});
				try {
					arg.eval(42);
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data must be type of boolean");
				}
            });

			it('type: CustomType - OK', async () => {
                let arg = new Argument({type: CustomType});
				let customInput = new CustomType();
				expect(arg.eval(customInput)).toBe(customInput);
            });

			it('type: CustomType - ERROR', async () => {
                let arg = new Argument({type: CustomType});
				try {
					arg.eval(42);
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data must be instance of CustomType");
				}
            });

			it('type: enum - OK', async () => {
                let arg = new Argument({type: "a|b"});
				let customInput = new CustomType();
				expect(arg.eval("a")).toBe("a");
            });

			it('type: enum - ERROR', async () => {
                let arg = new Argument({type: "a|b"});
				try {
					arg.eval("other");
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data (other) must be type of string and one of the following options: a,b");
				}
            });

			it('type: enum - ERROR NOT TEXT', async () => {
                let arg = new Argument({type: "a|b"});
				try {
					arg.eval(42);
					expect(true).toBeFalsy();
				} catch(e) {
					expect(e instanceof Error).toBeTruthy();
					expect(e.message).toBe("Data (42) must be type of string and one of the following options: a,b");
				}
            });
        });
    });
});
