import process from "process";

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const RECHARGE_API_KEY = process.env.RECHARGE_API_KEY;

const RECHARGE_WEBHOOKS_ADDRESS = `${HOST}/webhook`;

export const RECHARGE_WEBHOOKS = {
    'charge/created': `${RECHARGE_WEBHOOKS_ADDRESS}/charge-created`,
}
