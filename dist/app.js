"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const database_1 = __importDefault(require("./db/database"));
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
(0, database_1.default)();
app.use(express_1.default.json());
app.use("/", index_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=app.js.map