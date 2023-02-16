import { Argument } from "./Argument";
import { Base } from "./Base";

class CustomType extends Base {
	public argument: string = new Argument({default: "default", type: "string"}) as any;
}

describe('Base', () => {
    beforeEach(() => {});

    describe('init', () => {
		it('eval argument - OK', async () => {
			let o = new CustomType();

			o.init({argument: "text"});
			expect(o.argument).toBe("text");
		});

		it('eval default argument - OK', async () => {
			let o = new CustomType();

			o.init({});
			expect(o.argument).toBe("default");
		});

		it('eval argument - ERROR contains field name', async () => {
			let o = new CustomType();

			try {
				o.init({argument: 42});
				expect(true).toBeFalsy();
			} catch (e) {
				expect(e instanceof Error).toBe(true);
				expect(e.message).toBe(`argument must be type of string`);
			}
		});
    });
});
