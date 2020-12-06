"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHandler = void 0;
var OrderHandler = /** @class */ (function () {
    function OrderHandler(parameters) {
        this.parameters = parameters;
    }
    OrderHandler.prototype.packOrder = function (orderRequest) {
        var generatedShipmentDetails = {
            orderId: "",
            totalVolume: {
                unit: "",
                value: 0,
            },
            containers: [],
        };
        var unit = "";
        var dim;
        var contChecker = null;
        var sumVolume = 0;
        for (var _i = 0, _a = orderRequest.products; _i < _a.length; _i++) {
            var product = _a[_i];
            unit = product.dimensions.unit;
            dim = [product.dimensions.length, product.dimensions.width, product.dimensions.height];
            generatedShipmentDetails.orderId = orderRequest.id;
            sumVolume = sumVolume + this.calculateTotalProductVolume(product.orderedQuantity, dim);
            try {
                generatedShipmentDetails.containers = this.sortItems(contChecker, 0, product.id, product.dimensions.unit, product.orderedQuantity, dim);
            }
            catch (e) {
                console.log('[SORTING PROBLEM]', e);
            }
            contChecker = generatedShipmentDetails.containers;
        }
        generatedShipmentDetails.totalVolume.unit = "cubic " + unit;
        generatedShipmentDetails.totalVolume.value = sumVolume;
        return generatedShipmentDetails;
    };
    OrderHandler.prototype.bestBox = function (unit, totalPackageVolume) {
        var bestBox = '';
        var boxOptionVolume = 0;
        var volumeGap = null;
        for (var _i = 0, _a = this.parameters.containerSpecs; _i < _a.length; _i++) {
            var boxOptionType = _a[_i];
            if (!boxOptionType.dimensions.unit.match(unit)) {
                throw new Error("There's a mismatch in our unit of measure, please check your parameters");
            }
            boxOptionVolume = boxOptionType.dimensions.length * boxOptionType.dimensions.width * boxOptionType.dimensions.height;
            if (totalPackageVolume <= boxOptionVolume && (volumeGap === null || volumeGap >= (boxOptionVolume - totalPackageVolume))) { //for choosing the best fit
                volumeGap = boxOptionVolume - totalPackageVolume;
                bestBox = boxOptionType.containerType;
            }
        }
        return (volumeGap === null ? null : bestBox);
    };
    OrderHandler.prototype.sortItems = function (cont, rem, prodID, unit, itemCount, dim) {
        var totalPackageVolume = 0;
        var container = [{
                containerType: '',
                containingProducts: [{
                        id: '',
                        quantity: 0
                    }]
            }];
        var box = null;
        var remainingItem = rem;
        while (itemCount > 0 && box === null) {
            totalPackageVolume = this.calculateTotalProductVolume(itemCount, dim);
            box = this.bestBox(unit, totalPackageVolume);
            if (box === null) {
                itemCount = itemCount - 1;
                remainingItem = remainingItem + 1;
                if (itemCount === 0) {
                    throw new Error("Your item is too big for our available boxes");
                }
            }
        }
        if (box !== null) {
            if (cont !== null) {
                cont.push({ 'containerType': box, 'containingProducts': [{ 'id': prodID, 'quantity': itemCount }] });
            }
            else {
                container.pop();
                container.push({ 'containerType': box, 'containingProducts': [{ 'id': prodID, 'quantity': itemCount }] });
            }
        }
        if (remainingItem > 0) {
            if (cont === null) {
                cont = container;
            }
            return this.sortItems(cont, 0, prodID, unit, remainingItem, dim);
        }
        else {
            if (cont === null) {
                cont = container;
            }
            return cont;
        }
    };
    OrderHandler.prototype.calculateTotalProductVolume = function (itemCount, dimension) {
        var perPackageVolume = dimension.reduce(function (productDimension, currentDimension) {
            return productDimension * currentDimension;
        }, 1);
        var totalPackageVolume = perPackageVolume * itemCount;
        return totalPackageVolume;
    };
    return OrderHandler;
}());
exports.OrderHandler = OrderHandler;
