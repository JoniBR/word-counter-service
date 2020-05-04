"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var WordCounterService_1 = __importDefault(require("./WordCounterService"));
var constants_1 = require("./constants");
var app = express_1.default();
var wordCounterService = new WordCounterService_1.default();
app.set(constants_1.SERVICE_NAME, wordCounterService);
app.use('/', routes_1.default);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});
