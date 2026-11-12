export const ALLOWED_SENDER = 'noreply@whichpadel.com';
export const REPLY_TO = 'hello@whichpadel.com';

function addr(value, fallbackName){
  if(!value) return {email:'', name:fallbackName||''};
  if(typeof value==='string') return {email:value, name:fallbackName||''};
  return {email:String(value.email||''), name:value.name||fallbackName||''};
}

function headerName(s){
  return /^[\x20-\x7E]*$/.test(s) ? s : '=?UTF-8?B?'+btoa(unescape(encodeURIComponent(s)))+'?=';
}

function formatAddr({email, name}){
  if(!email) return '';
  return name ? headerName(name)+' <'+email+'>' : email;
}

export function mime({from, to, subject, text, html, replyTo}){
  const boundary = 'wp_'+crypto.randomUUID().replace(/-/g,'');
  const lines = [
    'From: '+formatAddr(from),
    'To: '+formatAddr(to),
    'Reply-To: '+formatAddr(replyTo),
    'Subject: '+headerName(subject||''),
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="'+boundary+'"',
    '',
    '--'+boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text||'',
  ];
  if(html){
    lines.push('--'+boundary, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: 8bit', '', html);
  }
  lines.push('--'+boundary+'--', '');
  return lines.join('\r\n');
}

export function payload(input){
  const from = addr(input&&input.from, 'WhichPadel');
  if(from.email!==ALLOWED_SENDER) throw new Error('sender');
  const to = addr(input&&input.to);
  if(!to.email) throw new Error('to');
  const replyTo = addr((input&&input.replyTo)||REPLY_TO, 'WhichPadel');
  if(!replyTo.email) replyTo.email = REPLY_TO;
  const raw = mime({
    from, to, replyTo,
    subject: input&&input.subject||'',
    text: input&&input.text||'',
    html: input&&input.html||'',
  });
  return {from: from.email, to: to.email, raw, replyTo: replyTo.email};
}
