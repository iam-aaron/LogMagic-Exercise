"use strict";
/* Do not modify this file */
Object.defineProperty(exports, "__esModule", { value: true });
var orderHandler_1 = require("../../orderHandler");
describe("Orders Packing Test Cases", function () {
    var containerSpecs = [
        {
            containerType: "Cardboard A",
            dimensions: {
                unit: "centimeter",
                length: 30,
                width: 30,
                height: 30,
            },
        },
        {
            containerType: "Cardboard B",
            dimensions: {
                unit: "centimeter",
                length: 10,
                width: 20,
                height: 20,
            },
        },
    ];
    var orderHandler = new orderHandler_1.OrderHandler({ containerSpecs: containerSpecs });
    test("Given a small order, pack it into a single container", function () {
        var orderRequest = {
            id: "ORDER-001",
            products: [
                {
                    id: "PRODUCT-001",
                    name: "GOOD FORTUNE COOKIES",
                    orderedQuantity: 9,
                    unitPrice: 13.4,
                    dimensions: {
                        unit: "centimeter",
                        length: 10,
                        width: 10,
                        height: 30,
                    },
                },
            ],
        };
        var expectedShipmentRecord = {
            orderId: "ORDER-001",
            totalVolume: {
                unit: "cubic centimeter",
                value: 27000,
            },
            containers: expect.arrayContaining([
                {
                    containerType: "Cardboard A",
                    containingProducts: expect.arrayContaining([
                        {
                            id: "PRODUCT-001",
                            quantity: 9,
                        },
                    ]),
                },
            ]),
        };
        expect(orderHandler.packOrder(orderRequest)).toEqual(expectedShipmentRecord);
    });
    test("Given a large order, pack it using multiple containers, without exceeding maximum capacity of any containers", function () {
        var orderRequest = {
            id: "ORDER-002",
            products: [
                {
                    id: "PRODUCT-002",
                    name: "BAD FORTUNE COOKIES",
                    orderedQuantity: 10,
                    unitPrice: 13.4,
                    dimensions: {
                        unit: "centimeter",
                        length: 10,
                        width: 10,
                        height: 30,
                    },
                },
            ],
        };
        var expectedShipmentRecord = {
            orderId: "ORDER-002",
            totalVolume: {
                unit: "cubic centimeter",
                value: expect.any(Number),
            },
            containers: expect.arrayContaining([
                {
                    containerType: "Cardboard A",
                    containingProducts: expect.arrayContaining([
                        {
                            id: "PRODUCT-002",
                            quantity: expect.any(Number),
                        },
                    ]),
                },
            ]),
        };
        var shipmentRecord = orderHandler.packOrder(orderRequest);
        var totalProductQuantity = 0;
        shipmentRecord.containers.forEach(function (container) {
            container.containingProducts.forEach(function (product) {
                expect(product.quantity).toBeLessThanOrEqual(9);
                totalProductQuantity += product.quantity;
            });
        });
        expect(totalProductQuantity).toEqual(10);
        expect(shipmentRecord.containers.length).toBeGreaterThan(1);
        expect(shipmentRecord).toEqual(expectedShipmentRecord);
    });
    test("Given an order that cannot fit into any containers, throw an error", function () {
        var orderRequest = {
            id: "ORDER-003",
            products: [
                {
                    id: "PRODUCT-001",
                    name: "GOOD FORTUNE COOKIES",
                    orderedQuantity: 1,
                    unitPrice: 13.4,
                    dimensions: {
                        unit: "centimeter",
                        length: 10,
                        width: 10,
                        height: 30,
                    },
                },
                {
                    id: "PRODUCT-003",
                    name: "GIANT FORTUNE COOKIES",
                    orderedQuantity: 1,
                    unitPrice: 99.95,
                    dimensions: {
                        unit: "centimeter",
                        length: 30,
                        width: 30,
                        height: 50,
                    },
                },
            ],
        };
        expect(function () { return orderHandler.packOrder(orderRequest); }).toThrowError();
    });
    test("Given an order that packs into multiple containers, calculate the total volume of all containers used", function () {
        var orderRequest = {
            id: "ORDER-004",
            products: [
                {
                    id: "PRODUCT-004",
                    name: "ALMOST-GREAT FORTUNE COOKIES",
                    orderedQuantity: 2,
                    unitPrice: 13.4,
                    dimensions: {
                        unit: "centimeter",
                        length: 30,
                        width: 30,
                        height: 25,
                    },
                },
            ],
        };
        var expectedShipmentRecord = {
            orderId: "ORDER-004",
            totalVolume: {
                unit: "cubic centimeter",
                value: 54000,
            },
            containers: [
                {
                    containerType: "Cardboard A",
                    containingProducts: [
                        {
                            id: "PRODUCT-004",
                            quantity: 1,
                        },
                    ],
                },
                {
                    containerType: "Cardboard A",
                    containingProducts: [
                        {
                            id: "PRODUCT-004",
                            quantity: 1,
                        },
                    ],
                },
            ],
        };
        expect(orderHandler.packOrder(orderRequest)).toEqual(expectedShipmentRecord);
    });
});
