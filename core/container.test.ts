import 'reflect-metadata';
import { beforeEach, describe, expect, it } from "vitest";
import { Container } from "./container";
import { Injectable } from "./@Injectbale";

describe("Container Tests", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
    });

    it("should resolve a class without dependencies", () => {
        class A {}
        const instanceA = container.get(A);
        expect(instanceA).toBeInstanceOf(A);
    });

    it("should resolve a class with dependencies", () => {
        class B {}

        @Injectable()
        class C {
            constructor(public b: B) {}
        }
        const instanceC = container.get(C);
        expect(instanceC).toBeInstanceOf(C);
        expect(instanceC.b).toBeInstanceOf(B);
    });

    it("should resolve nested dependencies", () => {
        class D {}

        @Injectable()
        class E {
            constructor(public d: D) {}
        }

        @Injectable()
        class F {
            constructor(public e: E) {}
        }

        const instanceF = container.get(F)  ;
        expect(instanceF).toBeInstanceOf(F);
        expect(instanceF.e).toBeInstanceOf(E);
        expect(instanceF.e.d).toBeInstanceOf(D);
    })

    it("should return the same instance for singleton classes", () => {
        @Injectable()
        class G {}

        const instanceG1 = container.get(G);
        const instanceG2 = container.get(G);

        expect(instanceG1).toBe(instanceG2);
    });

    it("should return undefined for unregistered dependencies", () => {
        class H {
            constructor(public unknownDep: any) {}
        }

        const instanceH = container.get(H);

        expect(instanceH.unknownDep).toBe(undefined);
    });

    it("should resolve classes with multiple dependencies", () => {
        class I {}
        class J {}

        @Injectable()
        class K {
            constructor(public i: I, public j: J) {}
        }

        const instanceK = container.get(K);
        expect(instanceK).toBeInstanceOf(K);
        expect(instanceK.i).toBeInstanceOf(I);
        expect(instanceK.j).toBeInstanceOf(J);
    });
})