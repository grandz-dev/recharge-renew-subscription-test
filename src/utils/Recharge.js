import axios from "axios";
import {RECHARGE_API_KEY, RECHARGE_WEBHOOKS} from "../constants/config.js";

class Recharge {
    constructor() {
        this.http = new axios.create({
            baseURL: 'https://api.rechargeapps.com/',
            headers: {
                'X-Recharge-Version': '2021-11',
                'X-Recharge-Access-Token': RECHARGE_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.charges = [];
    }

    async getWebhooks() {
        console.log('Get webhooks')
        try {
            const result = await this.http({
                method: "GET",
                url: 'webhooks',
            });

            return result.data.webhooks;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getSubscription(id) {
        console.log('Get subscription', id)
        try {
            const result = await this.http({
                method: "GET",
                url: `subscriptions/${id}`,
            });

            return result.data?.subscription;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async createWebhook(topic, address) {
        console.log('Create webhook', topic, address);
        try {
            const result = await this.http({
                method: "POST",
                url: 'webhooks',
                data: {
                    address: `${address}`,
                    topic
                }
            });

            return result.data;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async checkAndCreateWebhooks() {
        console.log('Check and create webhooks');
        const webhooks = await this.getWebhooks();

        if (Array.isArray(webhooks)) {
            const existingWebhooks = webhooks.map(item => item.topic);
            const missingWebhooks = Object.keys(RECHARGE_WEBHOOKS).filter(item => !existingWebhooks.includes(item));

            await Promise.all(missingWebhooks.map(async (item) => {
                await this.createWebhook(item, RECHARGE_WEBHOOKS[item]);
            }))
        }
        console.log('Webhooks created')
    }

    async processCharge(id) {
        console.log('Process webhook', id);
        try {
            const result = await this.http({
                method: "POST",
                url: `charges/${id}/process`
            });

            return result.data?.charge;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async changeSubscriptionNextDate(id, date) {
        console.log('changeSubscriptionNextDate', id, date);
        try {
            const result = await this.http({
                method: "POST",
                url: `subscriptions/${id}/set_next_charge_date`,
                data: {
                    date
                }
            });

            return result.data?.subscription;
        } catch (err) {
            console.log('changeSubscriptionNextDate ERROR');
            console.log(err);
            return false;
        }
    }
}

const recharge = new Recharge();

export default recharge;