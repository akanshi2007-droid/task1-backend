const express = require('express');
const itemsRouter = require('./routes/items');
const app = express();
const PORT = 5000;
app.use(express.json());
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
app.use(logger);
app.use('/items', itemsRouter);
app.get('/', (req, res) => res.send('Server is alive!'));
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});