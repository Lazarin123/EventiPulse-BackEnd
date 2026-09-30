import { Router } from 'express';
import { WebhookController } from '../controllers/webhookController.js';

const router = Router();

router.post('/endpoints', WebhookController.createEndpoint);
router.post('/events', WebhookController.trigger);

export default router;
