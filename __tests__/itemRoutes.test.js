//__tests__/itemRoutes.test.js
const request = require('supertest');
const app = require('../src/app');
let { items } = require('../src/fakeDb/fakeDb');

let item = { name: "silly", price: 200 }

beforeEach(async () => {
    items.push(item)
});

afterEach(async () => {
    items = []
});

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const response = await request(app).get(`/items`);
        const { items } = response.body;
        expect(response.statusCode).toBe(200);
        expect(items).toHaveLength(6);
    });
});

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const response = await request(app).get(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual(item);
    });

    test("Responds with 404 if can't find item", async function () {
        const response = await request(app).get(`/items/0`);
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /items", function () {
    test("Creates a new item", async function () {
        const response = await request(app)
            .post(`/items`)
            .send({
                name: "Taco",
                price: 0
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toHaveProperty("name");
        expect(response.body.item).toHaveProperty("price");
        expect(response.body.item.name).toEqual("Taco");
        expect(response.body.item.price).toEqual(0);
    });
});

describe("PATCH /items/:name", function () {
    test("Updates a single item", async function () {
        const response = await request(app)
            .patch(`/items/${item.name}`)
            .send({
                name: "Troll"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual({
            name: "Troll"
        });
    });

    test("Responds with 404 if can't find item", async function () {
        const response = await request(app).patch(`/items/0`);
        expect(response.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function () {
    test("Deletes a single a item", async function () {
        const response = await request(app)
            .delete(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });
});
