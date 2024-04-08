import { after, describe } from "node:test";
import MoviesController from "./movies.controller";
import 'dotenv/config';

jest.setTimeout(10000);

describe("MoviesController", () => {

    let controller: MoviesController;
    beforeAll(() => {
        controller = new MoviesController();
    })

    afterEach(async () => {
        await controller.clearCache();
    })


    it("Fetches from API properly", async () => {
        const query = "once";
        const page = 2;

        const result = await controller.getMovies(query, page);
        expect(result).toBeDefined();
        expect(result.items).toBeDefined
        expect(result.items.length).toBeGreaterThan(0);
        expect(result.page).toBe(page);
        expect(result.totalPages).toBeGreaterThan(0);
        expect(result.totalResults).toBeGreaterThan(0);
        expect(result.hitCounter).toBe(0);
        expect(result.fromCache).toBe(false);

    })

    it("Fetches from cache when same request goes several times in a row and hitCount is correct", async () => {
        const query = "love";
        const page = 3;

        const firstResult = await controller.getMovies(query, page);
        expect(firstResult).toBeDefined();
        expect(firstResult.fromCache).toBe(false);

        const secondResult = await controller.getMovies(query, page);
        expect(secondResult).toBeDefined();
        expect(secondResult.fromCache).toBe(true);
        expect(secondResult.hitCounter).toBe(1);
        expect(JSON.stringify(secondResult.items)).toEqual(JSON.stringify(firstResult.items));

        const thirdResult = await controller.getMovies(query, page);
        expect(thirdResult).toBeDefined();
        expect(thirdResult.fromCache).toBe(true);
        expect(thirdResult.hitCounter).toBe(2);
        expect(JSON.stringify(thirdResult.items)).toEqual(JSON.stringify(firstResult.items));
    })

    it("Pagination works correctly with fetching from API and caches", async () => {
        const query = "life";

        const firstPage = 2;
        const firstResult = await controller.getMovies(query, firstPage);
        expect(firstResult.page).toBe(firstPage);
        expect(firstResult.fromCache).toBe(false);

        const repetitiveFirstResult = await controller.getMovies(query, firstPage);
        expect(repetitiveFirstResult.page).toBe(firstPage);
        expect(repetitiveFirstResult.fromCache).toBe(true);
        expect(repetitiveFirstResult.hitCounter).toBe(1);
        expect(JSON.stringify(repetitiveFirstResult.items)).toEqual(JSON.stringify(firstResult.items));

        const secondPage = 3;
        const secondResult = await controller.getMovies(query, secondPage);
        expect(secondResult.page).toBe(secondPage);
        expect(secondResult.fromCache).toBe(false);
        expect(secondResult.hitCounter).toBe(0);

        const repetitiveSecondResult = await controller.getMovies(query, secondPage);
        expect(repetitiveSecondResult.page).toBe(secondPage);
        expect(repetitiveSecondResult.fromCache).toBe(true);
        expect(repetitiveSecondResult.hitCounter).toBe(1);
        expect(JSON.stringify(repetitiveSecondResult.items)).toEqual(JSON.stringify(secondResult.items));

    })
    it("Cache TTL does not extend after repetitive requests", async () => {

        const query = "when";
        const page = 1;

        const firstResult = await controller.getMovies(query, page);
        expect(firstResult).toBeDefined();
        expect(firstResult.fromCache).toBe(false);

        const secondResult = await controller.getMovies(query, page);
        expect(secondResult).toBeDefined();
        expect(secondResult.fromCache).toBe(true);
        expect(secondResult.hitCounter).toBe(1);
        expect(JSON.stringify(secondResult.items)).toEqual(JSON.stringify(firstResult.items));

        const thirdResult = await controller.getMovies(query, page);
        expect(thirdResult).toBeDefined();
        expect(thirdResult.hitCounter).toBe(2);
        expect(thirdResult.cachedAt).toEqual(secondResult.cachedAt);
    })


})