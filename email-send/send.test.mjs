import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ALLOWED_SENDER, REPLY_TO, payload, mime } from './src/send.js';

const here = dirname(fileURLToPath(import.meta.url));

test('allowed sender and reply-to are the WhichPadel addresses', ()=>{
  assert.equal(ALLOWED_SENDER, 'noreply@whichpadel.com');
  assert.equal(REPLY_TO, 'hello@whichpadel.com');
});

test('payload builds MIME with Reply-To and rejects other senders', ()=>{
  const p = payload({
    from:{email:ALLOWED_SENDER,name:'WhichPadel'},
    to:'player@example.com',
    subject:'Your WhichPadel sign-in link',
    text:'Use this link\n\nhttps://whichpadel.com/api/auth/finish?t=abc',
    html:'<p>Use this link</p>',
  });
  assert.equal(p.from, ALLOWED_SENDER);
  assert.equal(p.to, 'player@example.com');
  assert.equal(p.replyTo, REPLY_TO);
  assert.match(p.raw, /Reply-To: WhichPadel <hello@whichpadel.com>/);
  assert.match(p.raw, /From: WhichPadel <noreply@whichpadel.com>/);
  assert.match(p.raw, /Subject: Your WhichPadel sign-in link/);
  assert.throws(()=>payload({from:{email:'hello@whichpadel.com'}, to:'a@b.c', subject:'x', text:'y'}), /sender/);
  assert.throws(()=>payload({from:{email:ALLOWED_SENDER}, to:'', subject:'x', text:'y'}), /to/);
});

test('whichpadel-send wrangler keeps workers_dev off, no routes, allowed sender only', ()=>{
  const toml = readFileSync(join(here, 'wrangler.toml'), 'utf8');
  assert.match(toml, /name = "whichpadel-send"/);
  assert.match(toml, /workers_dev = false/);
  assert.doesNotMatch(toml, /workers_dev = true/);
  assert.doesNotMatch(toml, /^\s*routes\s*=/m);
  assert.doesNotMatch(toml, /\[\[routes\]\]/);
  assert.match(toml, /allowed_sender_addresses = \["noreply@whichpadel.com"\]/);
  assert.doesNotMatch(toml, /destination_address/);
  assert.doesNotMatch(toml, /allowed_destination/);
});

test('Pages EMAIL service binding is production-only', ()=>{
  const toml = readFileSync(join(here, '..', 'wrangler.toml'), 'utf8');
  const preview = toml.split('[env.production')[0];
  const prod = toml.includes('[env.production') ? toml.slice(toml.indexOf('[env.production')) : '';
  assert.match(prod, /binding = "EMAIL"/);
  assert.match(prod, /service = "whichpadel-send"/);
  assert.match(prod, /entrypoint = "Sender"/);
  assert.doesNotMatch(preview, /binding = "EMAIL"/);
  assert.match(preview, /preview_database_id = "2dbd9911-d4cd-4d04-8c6f-9f391ceabf96"/);
  assert.match(preview, /id = "aea3c86a469447f7b439a2d171c89cd9"/);
});
