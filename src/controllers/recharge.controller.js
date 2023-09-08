import recharge from "../utils/Recharge.js";
export async function handleChargeCreated(req, res) {
    try {
        console.log('handleChargeCreated');
        console.log(req.body);

        const charge = req.body.charge;

        const subscriptionId = charge.line_items[0].subscription_id;
        const subscription = await recharge.getSubscription(subscriptionId)

        if (subscription) {
            console.log('Subscription exist');

            const date = new Date(subscription.created_at);

            const currentDate = new Date();

            currentDate.setHours(0, 0, 0, 0);

            if (date.getTime() < currentDate.getTime()) {
                const processResult = await recharge.processCharge(charge.id);

                if (processResult) {
                    date.setDate(date.getDate() + subscription.charge_interval_frequency+8);
                    const formattedDate = date.toISOString().split('T')[0];

                    await recharge.changeSubscriptionNextDate(subscription.id, formattedDate)
                }
            }
        }

    } catch (err) {
        console.log('handleChargeCreated ERROR');
        console.log(err);
    }

    return res.status(200);
}