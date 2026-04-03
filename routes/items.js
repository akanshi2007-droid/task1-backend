const express = require('express');
const router = express.Router();
const { readData, writeData, generateId } = require('../utils/helpers');
// GET all items + search + filter
router.get('/', (req, res) => {
    const items = readData();
    const { search, type } = req.query;
    if (search) {
        const filtered = items.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
        return res.json({
            success: true,
            data: filtered
        });
    }
    if (type) {
        const filtered = items.filter(item => item.type === type);
        return res.json({
            success: true,
            data: filtered
        });
    }
    res.json({
        success: true,
        data: items
    });
});
router.post('/', (req, res) => {
    const { title, description, type } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            success: false,
            error: "Title and description required"
        });
    }
    const items = readData();
    const newItem = {
        id: generateId(),
        title,
        description,
        type: type || "lost",
        createdAt: new Date()
    };
    items.push(newItem);
    writeData(items);
    res.status(201).json({
        success: true,
        data: newItem
    });
});
router.delete('/:id', (req, res) => {
    const items = readData();
    const id = req.params.id;
    const filteredItems = items.filter(item => item.id !== id);
    if (items.length === filteredItems.length) {
        return res.status(404).json({
            success: false,
            error: "Item not found"
        });
    }
    writeData(filteredItems);
    res.json({
        success: true,
        message: "Item deleted successfully"
    });
});
router.put('/:id', (req, res) => {
    const items = readData();
    const id = req.params.id;
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: "Item not found"
        });
    }
    const { title, description, type } = req.body;
    if (title) items[index].title = title;
    if (description) items[index].description = description;
    if (type) items[index].type = type;
    writeData(items);
    res.json({
        success: true,
        data: items[index]
    });
});
module.exports = router;