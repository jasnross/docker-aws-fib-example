"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var keys_1 = require("./keys");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var pg_1 = require("pg");
var redis = require("redis");
var keys = keys_1.getKeys();
var app = express();
app.use(cors());
app.use(bodyParser.json());
var pgClient = new pg_1.Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});
pgClient.on('error', function () { return console.log('Lost PG connection'); });
pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(function (err) { return console.log(err); });
var redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: function () { return 1000; },
});
var redisPublisher = redisClient.duplicate();
app.get('/', function (_req, res) {
    res.send('Hi');
});
app.get('/values/all', function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
    var values;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pgClient.query('SELECT * FROM values')];
            case 1:
                values = _a.sent();
                res.send(values.rows);
                return [2 /*return*/];
        }
    });
}); });
app.get('/values/current', function (_req, res) {
    redisClient.hgetall('values', function (_err, values) {
        res.send(values);
    });
});
app.post('/values', function (req, res) {
    var index = req.body.value;
    var indexNumber = parseInt(index);
    if (indexNumber > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [indexNumber]);
    res.send({ working: true });
});
app.listen(5000, function () {
    console.log('Listening');
});
