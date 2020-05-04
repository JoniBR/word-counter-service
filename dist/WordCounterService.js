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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("./utils/redis"));
var dataLoaders_1 = require("./utils/dataLoaders");
var peek = require('buffer-peek-stream').promise;
var WordCounterService = /** @class */ (function () {
    function WordCounterService() {
        this.redis = new redis_1.default();
    }
    WordCounterService.prototype.isStringUrl = function (str) {
        var urlPrefixes = ['http://', 'https://', 'www.'];
        for (var _i = 0, urlPrefixes_1 = urlPrefixes; _i < urlPrefixes_1.length; _i++) {
            var prefix = urlPrefixes_1[_i];
            if (str.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    };
    WordCounterService.prototype.isStringFilePath = function (str) {
        return str.startsWith('/');
    };
    WordCounterService.prototype.getWordCount = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.redis.getWordCount(word)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WordCounterService.prototype.countWords = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            var source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSourceStream(stream)];
                    case 1:
                        source = _a.sent();
                        this.countWordsFromStream(source);
                        return [2 /*return*/];
                }
            });
        });
    };
    WordCounterService.prototype.getSourceStream = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, buffer, outputStream, text;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, peek(stream, 65536)];
                    case 1:
                        _a = _b.sent(), buffer = _a[0], outputStream = _a[1];
                        text = buffer.toString('utf-8');
                        if (!this.isStringFilePath(text)) return [3 /*break*/, 3];
                        return [4 /*yield*/, dataLoaders_1.fileLoader(text)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        if (!this.isStringUrl(text)) return [3 /*break*/, 5];
                        return [4 /*yield*/, dataLoaders_1.urlLoader(text)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [2 /*return*/, outputStream];
                }
            });
        });
    };
    WordCounterService.prototype.countWordsFromStream = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var prevWord = '';
                            var finished = false;
                            stream.on('data', function (chunk) { return __awaiter(_this, void 0, void 0, function () {
                                var text, words, i, word;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            text = Buffer.from(chunk).toString('utf-8');
                                            if (!(prevWord && /\s/.test(text.charAt(0)))) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.redis.increaseWordCount(prevWord)];
                                        case 1:
                                            _a.sent();
                                            prevWord = '';
                                            _a.label = 2;
                                        case 2:
                                            words = text.split(/\s+/)
                                                .map(function (word) { return word.replace(/[^A-Za-z,'-]/g, '').toLowerCase(); })
                                                .filter(function (word) { return word; });
                                            console.log(words);
                                            i = 0;
                                            _a.label = 3;
                                        case 3:
                                            if (!(i < words.length)) return [3 /*break*/, 6];
                                            word = words[i];
                                            if (i === 0 && prevWord) {
                                                word = prevWord + word;
                                                prevWord = '';
                                            }
                                            else if (i === words.length - 1 && !/\s/.test(text.charAt(text.length - 1))) {
                                                prevWord = word;
                                                stream.emit('done');
                                                return [3 /*break*/, 6];
                                            }
                                            return [4 /*yield*/, this.redis.increaseWordCount(word)];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            i++;
                                            return [3 /*break*/, 3];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); });
                            stream.on('end', function () {
                                finished = true;
                                resolve();
                            });
                            /** this handles the edge case that the last
                             * word in the text is written to prevWord but isn't used in the next iteration*/
                            stream.on('done', function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(finished && prevWord)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.redis.increaseWordCount(prevWord)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            stream.on('error', function (err) {
                                reject(err);
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return WordCounterService;
}());
exports.default = WordCounterService;
