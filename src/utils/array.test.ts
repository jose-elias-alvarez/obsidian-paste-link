import { moveElementDown, moveElementUp } from "./array";

describe("moveElementUp", () => {
    it("moves element up (into previous position)", () => {
        const array = [1, 2, 3];
        moveElementUp(array, 1);
        expect(array).toEqual([2, 1, 3]);
    });

    it("does nothing if element is at top", () => {
        const array = [1, 2, 3];
        moveElementUp(array, 0);
        expect(array).toEqual([1, 2, 3]);
    });
});

describe("moveElementDown", () => {
    it("moves element down (into next position)", () => {
        const array = [1, 2, 3];
        moveElementDown(array, 1);
        expect(array).toEqual([1, 3, 2]);
    });

    it("does nothing if element is at bottom", () => {
        const array = [1, 2, 3];
        moveElementDown(array, 2);
        expect(array).toEqual([1, 2, 3]);
    });
});
