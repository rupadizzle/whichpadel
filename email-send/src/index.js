import { WorkerEntrypoint } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';
import { payload } from './send.js';

export class Sender extends WorkerEntrypoint {
  async send(input){
    const p = payload(input);
    await this.env.MAIL.send(new EmailMessage(p.from, p.to, p.raw));
    return 'ok';
  }
}

export default {
  async fetch(){
    return new Response(null, {status:404});
  }
};
