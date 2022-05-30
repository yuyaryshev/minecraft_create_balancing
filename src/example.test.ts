import { hello } from "./hello.js";
import { expect } from "chai";

describe(`example.test.ts`, () => {
    it(`example.test.ts`, () => {
        expect(hello()).to.deep.equal("ytslib_policy package 'minecraft_create_balancing' started successfully!");
    });
});
