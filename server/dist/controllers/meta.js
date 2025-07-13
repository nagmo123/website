"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomTypes = exports.getMaterials = exports.getColors = exports.getCategories = void 0;
const getCategories = (req, res) => {
    res.json([
        'All',
        'Botanical',
        'Tropical',
        'Traditional',
        'Whimsical',
        'Luxury',
        'Modern',
    ]);
};
exports.getCategories = getCategories;
const getColors = (req, res) => {
    res.json([
        'Green',
        'Blue',
        'Coral',
        'Pink',
        'Gold',
        'Black',
        'White',
        'Cream',
        'Burgundy',
        'Turquoise',
    ]);
};
exports.getColors = getColors;
const getMaterials = (req, res) => {
    res.json([
        'Non-woven',
        'Vinyl',
        'Paper',
        'Silk',
        'Textured',
        'Metallic',
    ]);
};
exports.getMaterials = getMaterials;
const getRoomTypes = (req, res) => {
    res.json([
        'Living Room',
        'Bedroom',
        'Dining Room',
        'Kids Room',
        'Bathroom',
        'Study',
        'Office',
        'Entry Hall',
        'Nursery',
        'Playroom',
        'All Rooms',
    ]);
};
exports.getRoomTypes = getRoomTypes;
