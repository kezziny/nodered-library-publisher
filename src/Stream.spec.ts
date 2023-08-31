const each = require("jest-each").default;
import { Stream } from './Stream';

describe('Publisher', () => {
    let source: Stream<string> = null;
    let result: string = null;

    beforeEach(() => {
        source = new Stream<string>();
    });

    it('publish', async () => {
        source.subscribe(i => result = i);

        source.publish("ok");

        expect(source.value).toBe("ok");
        expect(result).toBe("ok");
    });

    it('publish empty', async () => {
        source.onEmpty(() => result = "ok");

        source.publish("prev");
        expect(source.value).toBe("prev");

        source.publish(undefined);

        expect(source.value).toBe(undefined);
        expect(result).toBe("ok");
    });

    it('publish error', async () => {
        source.onError(i => result = "error");

        source.publish("prev");
        expect(source.value).toBe("prev");

        source.publish(new Error());

        expect(source.value).toBe("prev");
        expect(result).toBe("error");
    });

    describe('switchIfEmpty', () => {
        each([
            ["const", false],
            ["function", true]
          ]).describe("argument - %s", (_, isFunction) => {
            let publisher = null;

            beforeEach(() => {
                if (isFunction) {
                    publisher = source.switchIfEmpty(() => "switched");
                } else {
                    publisher = source.switchIfEmpty("switched");
                }
            })
    
            it('publish on parent', async () => {
                publisher.subscribe(i => result = i);

                source.publish("ok");

                expect(publisher.value).toBe("ok");
                expect(result).toBe("ok");
            });
    
            it('publish empty on parent', async () => {
                publisher.subscribe(i => result = i);

                source.publish(undefined);

                expect(publisher.value).toBe("switched");
                expect(result).toBe("switched");
            });
    
            it('publish error on parent', async () => {
                publisher.onError(_ => result = "error");

                source.publish(new Error());

                expect(publisher.value).toBe(undefined);
                expect(result).toBe("error");
            });
          })
    });
});