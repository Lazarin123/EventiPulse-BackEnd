import { db } from '../config/db.js';
import { endpointsTable, deliveriesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export class WebhookService {
  static async registerEndpoint(url: string, description: string) {
    const secret = crypto.randomBytes(32).toString('hex');
    const [endpoint] = await db.insert(endpointsTable).values({
      url,
      secret,
      description,
    }).returning();
    return endpoint;
  }

  static async triggerEvent(eventData: any) {
    const endpoints = await db.select().from(endpointsTable);
    
    const results = [];

    for (const endpoint of endpoints) {
      // Cria registro de entrega pendente
      const [delivery] = await db.insert(deliveriesTable).values({
        endpointId: endpoint.id,
        eventPayload: eventData,
        status: 'PENDING',
      }).returning();

      // Executa o disparo assíncrono (simulando worker de entrega)
      this.dispatchWebhook(delivery.id, endpoint.url, endpoint.secret, eventData);
      results.push(delivery.id);
    }

    return results;
  }

  private static async dispatchWebhook(deliveryId: string, url: string, secret: string, payload: any) {
    const payloadString = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');

    let attempts = 0;
    let success = false;
    let responseCode = null;

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-EventPulse-Signature': signature,
          },
          body: payloadString,
        });

        responseCode = response.status;
        if (response.ok) {
          success = true;
        }
      } catch (error) {
        responseCode = 500;
      }

      if (!success) {
        await new Promise((res) => setTimeout(res, attempts * 2000)); // Backoff exponencial simples
      }
    }

    await db.update(deliveriesTable).set({
      status: success ? 'SUCCESS' : 'FAILED',
      attempts,
      responseCode,
      lastAttemptAt: new Date(),
    }).where(eq(deliveriesTable.id, deliveryId));
  }
}
