"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
var Request = express_1.Request;
var Response = express_1.Response;
var product_1 = require("../controllers/product");
var review_1 = require("../controllers/review");
var auth_1 = require("../middleware/auth");
router.get('/', product_1.getAllProducts);
console.log('adding test route')
router.get('/test', function(req: typeof Request, res: typeof Response) { res.json({ message: 'Test route works' }); });
router.get('/:id', product_1.getProduct);
router.post('/', auth_1.authMiddleware, product_1.createProduct);
router.put('/:id', auth_1.authMiddleware, product_1.updateProduct);
router.delete('/:id', auth_1.authMiddleware, product_1.deleteProduct);
// Reviews
router.post('/:id/reviews', auth_1.authMiddleware, review_1.addReview);
router.get('/:id/reviews', review_1.getReviews);
router.delete('/:id/reviews/:reviewId', auth_1.authMiddleware, review_1.deleteReview);
export default router; 