"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var customDesign_1 = require("../controllers/customDesign");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.post('/api/custom-design', customDesign_1.createRequest); // public
router.get('/api/custom-design', auth_1.authMiddleware, auth_1.adminMiddleware, customDesign_1.getAllRequests); // admin
router.get('/api/custom-design/:id', auth_1.authMiddleware, auth_1.adminMiddleware, customDesign_1.getRequestById); // admin
exports.default = router;
