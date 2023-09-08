import express from "express";
import * as rechargeController from './controllers/recharge.controller.js';
import recharge from "./utils/Recharge.js";
import bodyParser from "body-parser";

const app = express()

app.use(bodyParser.json());

app.get('/webhooks', async (req, res) => {
    const webhooks = await recharge.getWebhooks();

    res.json({
        webhooks
    })
});

app.post('/webhook/charge-created', rechargeController.handleChargeCreated);

export default app;