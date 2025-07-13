"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var product_1 = require("../controllers/product");
var review_1 = require("../controllers/review");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.get('/api/products', product_1.getAllProducts);
router.get('/api/products/:id', product_1.getProduct);
router.post('/api/products', auth_1.authMiddleware, product_1.createProduct);
router.put('/api/products/:id', auth_1.authMiddleware, product_1.updateProduct);
router.delete('/api/products/:id', auth_1.authMiddleware, product_1.deleteProduct);
// Reviews
router.post('/api/products/:id/reviews', auth_1.authMiddleware, review_1.addReview);
router.get('/api/products/:id/reviews', review_1.getReviews);
router.delete('/api/products/:id/reviews/:reviewId', auth_1.authMiddleware, review_1.deleteReview);
exports.default = router;
