"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestById = exports.getAllRequests = exports.createRequest = void 0;
const CustomDesignRequest_1 = __importDefault(require("../models/CustomDesignRequest"));
const createRequest = async (req, res) => {
    try {
        const request = await CustomDesignRequest_1.default.create(req.body);
        res.status(201).json(request);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createRequest = createRequest;
const getAllRequests = async (req, res) => {
    try {
        const requests = await CustomDesignRequest_1.default.find();
        res.json(requests);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllRequests = getAllRequests;
const getRequestById = async (req, res) => {
    try {
        const request = await CustomDesignRequest_1.default.findById(req.params.id);
        if (!request)
            return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRequestById = getRequestById;
