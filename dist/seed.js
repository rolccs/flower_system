"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, admin, categories, _i, categories_1, category, customers, _a, customers_1, customer, rosasCategory, tulipanesCategory, girasolesCategory, liriosCategory, orquideasCategory, clavelesCategory, products, _b, products_1, product;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, bcrypt_1.hash)("admin123", 10)];
                case 1:
                    adminPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "admin@lecheymiel.com" },
                            update: {},
                            create: {
                                email: "admin@lecheymiel.com",
                                name: "Administrador",
                                password: adminPassword,
                                role: "admin",
                                permissions: "all,users,inventory,orders,invoices",
                            },
                        })];
                case 2:
                    admin = _c.sent();
                    console.log({ admin: admin });
                    categories = [
                        { name: "Rosas", description: "Diferentes variedades de rosas" },
                        { name: "Tulipanes", description: "Tulipanes importados" },
                        { name: "Girasoles", description: "Girasoles de diferentes tamaños" },
                        { name: "Lirios", description: "Lirios de diferentes colores" },
                        { name: "Orquídeas", description: "Orquídeas exóticas" },
                        { name: "Claveles", description: "Claveles de diferentes colores" },
                        { name: "Margaritas", description: "Margaritas frescas" },
                        { name: "Gerberas", description: "Gerberas coloridas" },
                        { name: "Crisantemos", description: "Crisantemos de temporada" },
                        { name: "Follaje", description: "Follaje decorativo" },
                    ];
                    _i = 0, categories_1 = categories;
                    _c.label = 3;
                case 3:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 6];
                    category = categories_1[_i];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { name: category.name },
                            update: {},
                            create: category,
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("Categories created");
                    customers = [
                        {
                            name: "María González",
                            firstName: "María",
                            lastName: "González",
                            email: "maria@example.com",
                            phone: "555-1234",
                            address: "Calle Principal 123",
                            city: "Miami",
                            state: "FL",
                            zipCode: "33101",
                            type: "Individual",
                            purchaseHistory: JSON.stringify([]),
                            subscriptionDetails: JSON.stringify({}),
                        },
                        {
                            name: "Empresas Flores S.A.",
                            email: "info@empresasflores.com",
                            phone: "555-5678",
                            address: "Av. Comercial 456",
                            city: "Miami Beach",
                            state: "FL",
                            zipCode: "33139",
                            type: "Empresa",
                            purchaseHistory: JSON.stringify([]),
                            subscriptionDetails: JSON.stringify({}),
                        },
                        {
                            name: "Juan Pérez",
                            firstName: "Juan",
                            lastName: "Pérez",
                            email: "juan@example.com",
                            phone: "555-9876",
                            address: "Calle Secundaria 789",
                            city: "Coral Gables",
                            state: "FL",
                            zipCode: "33134",
                            type: "Individual",
                            purchaseHistory: JSON.stringify([]),
                            subscriptionDetails: JSON.stringify({}),
                        },
                        {
                            name: "Hotel Magnolia",
                            email: "reservas@hotelmagnolia.com",
                            phone: "555-4321",
                            address: "101 Cedar Blvd",
                            city: "Brickell",
                            state: "FL",
                            zipCode: "33131",
                            type: "Empresa",
                            purchaseHistory: JSON.stringify([]),
                            subscriptionDetails: JSON.stringify({}),
                        },
                        {
                            name: "Decoraciones Primavera",
                            email: "info@decoracionesprimavera.com",
                            phone: "555-8765",
                            address: "202 Elm St",
                            city: "Doral",
                            state: "FL",
                            zipCode: "33122",
                            type: "Empresa",
                            purchaseHistory: JSON.stringify([]),
                            subscriptionDetails: JSON.stringify({}),
                        },
                    ];
                    _a = 0, customers_1 = customers;
                    _c.label = 7;
                case 7:
                    if (!(_a < customers_1.length)) return [3 /*break*/, 10];
                    customer = customers_1[_a];
                    return [4 /*yield*/, prisma.customer.upsert({
                            where: { email: customer.email },
                            update: {},
                            create: customer,
                        })];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log("Customers created");
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Rosas" } })];
                case 11:
                    rosasCategory = _c.sent();
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Tulipanes" } })];
                case 12:
                    tulipanesCategory = _c.sent();
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Girasoles" } })];
                case 13:
                    girasolesCategory = _c.sent();
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Lirios" } })];
                case 14:
                    liriosCategory = _c.sent();
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Orquídeas" } })];
                case 15:
                    orquideasCategory = _c.sent();
                    return [4 /*yield*/, prisma.category.findFirst({ where: { name: "Claveles" } })
                        // Create products
                    ];
                case 16:
                    clavelesCategory = _c.sent();
                    if (!(rosasCategory &&
                        tulipanesCategory &&
                        girasolesCategory &&
                        liriosCategory &&
                        orquideasCategory &&
                        clavelesCategory)) return [3 /*break*/, 21];
                    products = [
                        {
                            name: "Rosas Rojas",
                            description: "Rosas rojas de alta calidad, perfectas para ocasiones románticas.",
                            sku: "ROSA-001",
                            barcode: "1234567890123",
                            price: 12.0,
                            price50cm: 12.0,
                            price60cm: 14.0,
                            price70cm: 16.0,
                            stock: 150,
                            minStock: 20,
                            color: "Rojo",
                            categoryId: rosasCategory.id,
                        },
                        {
                            name: "Rosas Blancas",
                            description: "Rosas blancas elegantes para bodas y eventos especiales.",
                            sku: "ROSA-002",
                            barcode: "1234567890124",
                            price: 12.0,
                            price50cm: 12.0,
                            price60cm: 14.0,
                            price70cm: 16.0,
                            stock: 120,
                            minStock: 20,
                            color: "Blanco",
                            categoryId: rosasCategory.id,
                        },
                        {
                            name: "Rosas Rosadas",
                            description: "Rosas rosadas para expresar gratitud y aprecio.",
                            sku: "ROSA-003",
                            barcode: "1234567890125",
                            price: 12.0,
                            price50cm: 12.0,
                            price60cm: 14.0,
                            price70cm: 16.0,
                            stock: 100,
                            minStock: 20,
                            color: "Rosa",
                            categoryId: rosasCategory.id,
                        },
                        {
                            name: "Tulipanes Amarillos",
                            description: "Tulipanes amarillos importados, ideales para regalar.",
                            sku: "TUL-001",
                            barcode: "2234567890123",
                            price: 15.0,
                            price50cm: 15.0,
                            price60cm: 18.0,
                            price70cm: 20.0,
                            stock: 80,
                            minStock: 10,
                            color: "Amarillo",
                            categoryId: tulipanesCategory.id,
                        },
                        {
                            name: "Tulipanes Rojos",
                            description: "Tulipanes rojos importados, símbolo de amor perfecto.",
                            sku: "TUL-002",
                            barcode: "2234567890124",
                            price: 15.0,
                            price50cm: 15.0,
                            price60cm: 18.0,
                            price70cm: 20.0,
                            stock: 65,
                            minStock: 10,
                            color: "Rojo",
                            categoryId: tulipanesCategory.id,
                        },
                        {
                            name: "Girasoles",
                            description: "Girasoles de gran tamaño, ideales para decoración.",
                            sku: "GIR-001",
                            barcode: "3234567890123",
                            price: 10.0,
                            price50cm: 10.0,
                            price60cm: 12.0,
                            price70cm: 14.0,
                            stock: 50,
                            minStock: 10,
                            color: "Amarillo",
                            categoryId: girasolesCategory.id,
                        },
                        {
                            name: "Lirios Blancos",
                            description: "Lirios blancos elegantes para eventos especiales.",
                            sku: "LIR-001",
                            barcode: "4234567890123",
                            price: 14.0,
                            price50cm: 14.0,
                            price60cm: 16.0,
                            price70cm: 18.0,
                            stock: 120,
                            minStock: 15,
                            color: "Blanco",
                            categoryId: liriosCategory.id,
                        },
                        {
                            name: "Lirios Rosados",
                            description: "Lirios rosados para ocasiones especiales.",
                            sku: "LIR-002",
                            barcode: "4234567890124",
                            price: 14.0,
                            price50cm: 14.0,
                            price60cm: 16.0,
                            price70cm: 18.0,
                            stock: 90,
                            minStock: 15,
                            color: "Rosa",
                            categoryId: liriosCategory.id,
                        },
                        {
                            name: "Orquídeas Púrpura",
                            description: "Orquídeas exóticas de larga duración.",
                            sku: "ORQ-001",
                            barcode: "5234567890123",
                            price: 25.0,
                            price50cm: 25.0,
                            price60cm: 30.0,
                            price70cm: 35.0,
                            stock: 40,
                            minStock: 15,
                            color: "Púrpura",
                            categoryId: orquideasCategory.id,
                        },
                        {
                            name: "Orquídeas Blancas",
                            description: "Orquídeas blancas elegantes para bodas.",
                            sku: "ORQ-002",
                            barcode: "5234567890124",
                            price: 25.0,
                            price50cm: 25.0,
                            price60cm: 30.0,
                            price70cm: 35.0,
                            stock: 35,
                            minStock: 15,
                            color: "Blanco",
                            categoryId: orquideasCategory.id,
                        },
                        {
                            name: "Clavel Blanco",
                            description: "Clavel estándar de gran tamaño y pétalos firmes",
                            sku: "CLAV-001",
                            barcode: "6234567890123",
                            price: 7.0,
                            price50cm: 7.0,
                            price60cm: 9.0,
                            price70cm: 11.0,
                            stock: 65,
                            minStock: 10,
                            color: "Blanco",
                            categoryId: clavelesCategory.id,
                        },
                        {
                            name: "Clavel Rojo",
                            description: "Clavel rojo intenso, ideal para arreglos florales",
                            sku: "CLAV-002",
                            barcode: "6234567890124",
                            price: 7.0,
                            price50cm: 7.0,
                            price60cm: 9.0,
                            price70cm: 11.0,
                            stock: 70,
                            minStock: 10,
                            color: "Rojo",
                            categoryId: clavelesCategory.id,
                        },
                    ];
                    _b = 0, products_1 = products;
                    _c.label = 17;
                case 17:
                    if (!(_b < products_1.length)) return [3 /*break*/, 20];
                    product = products_1[_b];
                    return [4 /*yield*/, prisma.product.upsert({
                            where: { sku: product.sku },
                            update: {},
                            create: product,
                        })];
                case 18:
                    _c.sent();
                    _c.label = 19;
                case 19:
                    _b++;
                    return [3 /*break*/, 17];
                case 20:
                    console.log("Products created");
                    _c.label = 21;
                case 21: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
