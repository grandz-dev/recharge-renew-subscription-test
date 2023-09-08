import 'dotenv/config'
import {PORT} from "./constants/config.js";
import app from "./app.js";
import recharge from "./utils/Recharge.js";

app.listen(PORT, async () => {
    await recharge.checkAndCreateWebhooks();
    console.log(`Server listening on port ${PORT}`)
})