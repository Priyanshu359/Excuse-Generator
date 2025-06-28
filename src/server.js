const app = require('../config/app');
const { PORT } = require('../config/env');
const db = require('../config/db');
app.listen(PORT, async () => {
    try { 
        await db.getConnection();
        console.log("DB is connected successfully");
    }
    catch (err) {
        console.error("DB connection failed: ", err.message);
    }
    console.log("Server is running on port", PORT);
}); 