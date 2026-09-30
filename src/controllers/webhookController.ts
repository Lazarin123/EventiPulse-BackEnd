import { Request, Response } from 'express';
import { WebhookService } from '../services/webhookService.js';

export class WebhookController {
  static async createEndpoint(req: Request, res: Response) {
    try {
      const { url, description } = req.body;
      if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

      const endpoint = await WebhookService.registerEndpoint(url, description);
      return res.status(201).json(endpoint);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao registrar endpoint' });
    }
  }

  static async trigger(req: Request, res: Response) {
    try {
      const eventData = req.body;
      if (!eventData) return res.status(400).json({ error: 'Payload do evento é obrigatório' });

      const deliveryIds = await WebhookService.triggerEvent(eventData);
      return res.status(202).json({ message: 'Eventos enfileirados para despacho', deliveryIds });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao disparar evento' });
    }
  }
}
