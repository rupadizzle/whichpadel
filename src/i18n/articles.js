// Explainer articles (rules, hold, vs) in all site languages. View: src/views/VArticle.astro.
import { url } from './routes.js';

export const ART_UI = {
  en:{ tldr:'In short', toc:'Contents', faq:'FAQ', more:'Keep reading: ', finder:'Racket quiz', guide:'Padel racket buying guide' },
  es:{ tldr:'En resumen', toc:'Contenido', faq:'Preguntas frecuentes', more:'Sigue leyendo: ', finder:'Quiz de pala', guide:'Guía para elegir pala' },
  fr:{ tldr:'En bref', toc:'Sommaire', faq:'FAQ', more:'À lire aussi : ', finder:'Quiz raquette', guide:'Guide d’achat raquette' },
  pt:{ tldr:'Em resumo', toc:'Conteúdo', faq:'Perguntas frequentes', more:'Continuar a ler: ', finder:'Quiz de raquete', guide:'Guia para escolher raquete' },
  it:{ tldr:'In breve', toc:'Indice', faq:'Domande frequenti', more:'Continua a leggere: ', finder:'Quiz racchetta', guide:'Guida all’acquisto racchetta' },
  de:{ tldr:'Kurz gesagt', toc:'Inhalt', faq:'FAQ', more:'Weiterlesen: ', finder:'Schläger-Quiz', guide:'Kaufberatung Padelschläger' },
};

const LAB = {
  en:{ rules:'padel rules', hold:'how to hold a padel racket', vs:'padel vs paddle tennis', finder:'racket quiz', guide:'padel racket buying guide', beg:'best padel rackets for beginners', balls:'padel balls', shoes:'padel shoes', rackets:'all rackets', tennis:'best padel rackets for tennis players', elbow:'arm-friendly padel rackets', light:'lightweight padel rackets', tool:'real-weight tool' },
  es:{ rules:'reglas del pádel', hold:'cómo coger la pala', vs:'pádel vs paddle tennis', finder:'quiz de pala', guide:'guía para elegir pala', beg:'mejores palas para principiantes', balls:'pelotas de pádel', shoes:'zapatillas de pádel', rackets:'todas las palas', tennis:'mejores palas para tenistas', elbow:'palas cómodas para el brazo', light:'palas ligeras', tool:'herramienta de peso real' },
  fr:{ rules:'règles du padel', hold:'comment tenir la raquette', vs:'padel vs paddle tennis', finder:'quiz raquette', guide:'guide d’achat raquette', beg:'meilleures raquettes débutants', balls:'balles de padel', shoes:'chaussures de padel', rackets:'toutes les raquettes', tennis:'meilleures raquettes pour joueurs de tennis', elbow:'raquettes douces pour le bras', light:'raquettes légères', tool:'outil de poids réel' },
  pt:{ rules:'regras do pádel', hold:'como segurar a raquete', vs:'pádel vs paddle tennis', finder:'quiz de raquete', guide:'guia para escolher raquete', beg:'melhores raquetes para principiantes', balls:'bolas de pádel', shoes:'sapatilhas de pádel', rackets:'todas as raquetes', tennis:'melhores raquetes para tenistas', elbow:'raquetes suaves para o braço', light:'raquetes leves', tool:'ferramenta de peso real' },
  it:{ rules:'regole del padel', hold:'come impugnare la racchetta', vs:'padel vs paddle tennis', finder:'quiz racchetta', guide:'guida all’acquisto racchetta', beg:'migliori racchette per principianti', balls:'palline da padel', shoes:'scarpe da padel', rackets:'tutte le racchette', tennis:'migliori racchette per tennisti', elbow:'racchette amiche del braccio', light:'racchette leggere', tool:'strumento peso reale' },
  de:{ rules:'Padel-Regeln', hold:'Padelschläger halten', vs:'Padel vs Paddle Tennis', finder:'Schläger-Quiz', guide:'Kaufberatung Padelschläger', beg:'beste Schläger für Anfänger', balls:'Padelbälle', shoes:'Padelschuhe', rackets:'alle Schläger', tennis:'beste Schläger für Tennisspieler', elbow:'armfreundliche Schläger', light:'leichte Schläger', tool:'Echtgewicht-Tool' },
};

function L(lang){
  const lab=LAB[lang];
  const a=(type,key,id)=>`<a href="${url(type,lang,id)}">${lab[key]}</a>`;
  return {
    rules:a('article','rules','rules'), hold:a('article','hold','hold'), vs:a('article','vs','vs'),
    finder:a('finder','finder'), guide:a('guide','guide'),
    beg:a('best','beg','best-padel-rackets-for-beginners'), balls:a('balls','balls'),
    shoes:a('shoeList','shoes','best'), rackets:a('rackets','rackets',1),
    tennis:a('best','tennis','best-padel-racket-for-tennis-players'),
    elbow:a('best','elbow','best-padel-racket-for-tennis-elbow'),
    light:a('best','light','best-lightweight-padel-rackets'),
    tool:a('tool','tool'),
  };
}

export const ART = {
vs:{
  en:(()=>{ const l=L('en'); return {
 crumb:"Padel vs paddle tennis",
 title:"Padel vs paddle tennis: what is the difference?",
 desc:"Padel and paddle tennis are different sports. Compare the court, walls, racket, ball, serve and scoring, and see why people mix up “paddle” and “padel”.",
 eyebrow:"Explainer",
 h1:"Padel vs paddle tennis: what is the difference?",
 lead:"Padel and paddle tennis sound the same and both use a solid racket, but they are two different sports. Padel is played in a walled court with a pressurised ball. Paddle tennis is played on a smaller, open court with a softer ball.",
 tldr:["<b>Padel:</b> enclosed 20 m × 10 m court, glass walls and fence you can play off, doubles only, underarm serve after one bounce.","<b>Paddle tennis:</b> open 50 ft × 20 ft court (about 15 m × 6 m), no walls in play, lower net, solid paddle and a reduced-pressure tennis ball.","<b>“Paddle” is often just a spelling of padel.</b> In the UK and Spain people searching “paddle” usually mean padel; in the US “paddle” can mean either, so check the court."],
 toc:{diff:"The short answer",table:"Side-by-side comparison",names:"Why the names get mixed up",origin:"Where each sport came from",which:"Which one should you play?",gear:"Equipment: do they share anything?",faq:"FAQ"},
 sections:[
  {id:"diff",h:"The short answer",html:`<p>Padel is a racket sport played as doubles in an enclosed court, with walls that stay in play. You hit a pressurised rubber ball with a solid, stringless racket, and after the ball has bounced on the floor you can let it come off the glass or the fence and still return it. Paddle tennis is an older sport played on a small open court with no walls in play, a lower net and a tennis ball with reduced pressure. Both use solid paddles, which is why they get confused, but the court, the ball and the tactics are different.</p>`},
  {id:"table",h:"Side-by-side comparison",html:`<div class="tw"><table><thead><tr><th></th><th>Padel</th><th>Paddle tennis</th></tr></thead><tbody>
<tr><td><b>Court</b></td><td>20 m × 10 m, enclosed by glass walls and metal fence</td><td>About 50 ft × 20 ft (15.2 m × 6.1 m), open</td></tr>
<tr><td><b>Walls in play</b></td><td>Yes, after the ball has bounced on the floor</td><td>No: touching a wall or fence ends the point</td></tr>
<tr><td><b>Net height</b></td><td>0.88 m in the centre, 0.92 m at the posts</td><td>About 31 in (0.78 m)</td></tr>
<tr><td><b>Racket</b></td><td>Solid, perforated, no strings, up to 45.5 cm long and 38 mm thick</td><td>Solid paddle, no strings, may be perforated</td></tr>
<tr><td><b>Ball</b></td><td>Pressurised rubber ball, a little smaller than a tennis ball</td><td>Low-compression tennis ball</td></tr>
<tr><td><b>Players</b></td><td>Doubles</td><td>Doubles is most common; singles is played too</td></tr>
<tr><td><b>Serve</b></td><td>Underarm, ball bounced first, struck at or below waist height, two serves</td><td>Underarm, one serve per point</td></tr>
<tr><td><b>Scoring</b></td><td>Tennis-style (15, 30, 40, game), best of three sets; deuce is settled by the format in use</td><td>Tennis-style with advantage scoring</td></tr>
</tbody></table></div><p class="muted small">Details can vary between clubs, tours and national bodies. Our ${l.rules} guide covers the padel scoring options in full.</p>`},
  {id:"names",h:"Why the names get mixed up",html:`<p>“Padel” is the sport’s own name, a spelling that comes from Spanish and Latin American usage. English speakers hear it as “paddle” and often write it that way, so searches and conversations for “paddle” very often mean padel. In the US the word “paddle” also describes paddle tennis, platform tennis and, informally, pickleball, so context decides. If the court has glass walls and a mesh fence all round it, it is padel.</p><p>Padel is also sometimes confused with pickleball (a solid paddle and a perforated plastic ball on a small open court with no walls), with squash and racquetball (walls in play, but strung rackets and a hollow rubber ball, and padel’s walls only count after the ball has bounced on the floor). Padel is its own game: tennis-style scoring, squash-style walls.</p>`},
  {id:"origin",h:"Where each sport came from",html:`<p>Paddle tennis was invented in the United States in the late 1890s and spread through New York City parks from the 1910s as a small-court version of tennis. Padel was created in Acapulco, Mexico, in 1969, where Enrique Corcuera built a walled court so balls would stay in play. It then grew through Spain and Argentina and is now played in many countries, including a fast-growing scene in the UK.</p>`},
  {id:"which",h:"Which one should you play?",html:`<p>If you live in the UK, Spain, Portugal, Italy, France, Germany or most of Europe and South America, the sport you can book at a local club is almost certainly padel. Paddle tennis is mainly found in parts of the United States. Padel is a good choice for beginners because the walls keep the ball in play, rallies are long, and an underarm serve means you can rally in your first session. Start with our ${l.rules} guide and take the ${l.finder} to see which racket suits your level.</p><p>Coming from tennis? Your groundstrokes help, but padel strokes are shorter and the walls change your positioning. See the ${l.tennis} for forgiving options.</p>`},
  {id:"gear",h:"Equipment: do they share anything?",html:`<p>Not really. A padel racket is built to the size limits of the sport, with a foam or rubber core, a carbon or fibreglass face and a perforated hitting surface, and it must be used with a wrist strap. A padel ball is a pressurised rubber ball made for the padel court. A paddle tennis paddle and ball are designed for a different court and bounce. Do not buy equipment for one sport and expect it to suit the other. For padel, our ${l.guide} explains shape, weight, balance and core, and our ${l.beg} list is a good place to start. Compare ${l.balls} and ${l.shoes} before you play.</p>`},
 ],
 faq:[
  ["Is padel the same as paddle tennis?","No. Padel is played in an enclosed 20 m × 10 m court with walls that stay in play and a pressurised ball. Paddle tennis is played on a smaller open court with a low-compression tennis ball and no walls in play."],
  ["Is it padel or paddle?","The sport is called padel. “Paddle” is a common English spelling and is also the name of a different sport, paddle tennis, so use “padel” when you mean the walled-court game."],
  ["Is padel the same as pickleball?","No. Pickleball is played with a solid paddle and a plastic perforated ball on a small open court with a non-volley zone. Padel is played in an enclosed court with a pressurised rubber ball, and a padel racket has a perforated face and a wrist strap."],
  ["Is padel like tennis or squash?","It borrows from both. Scoring is the same as tennis, and the court is divided by a net, but the glass walls and the fence can be played off, which feels closer to squash."],
  ["Can you play padel with a tennis racket?","No. Padel is played with a solid, stringless padel racket, and the rules require one. A tennis racket is not allowed."],
  ["Do I need walls to play paddle tennis or padel?","Padel needs an enclosed court because the walls are part of the game. Paddle tennis is played on an open court with no walls in play."],
  ["Where did padel start?","Padel started in Acapulco, Mexico, in 1969 and spread through Spain and Argentina before reaching the UK and the rest of Europe."],
 ],
 next:["rules", "hold"]
 }; })(),
  es:(()=>{ const l=L('es'); return {
 crumb:"Pádel vs paddle tennis",
 title:"Pádel vs paddle tennis: ¿cuál es la diferencia?",
 desc:"El pádel y el paddle tennis son deportes distintos. Compara pista, paredes, pala, pelota, saque y puntuación, y por qué se confunden «paddle» y «pádel».",
 eyebrow:"Guía práctica",
 h1:"Pádel vs paddle tennis: ¿cuál es la diferencia?",
 lead:"El pádel y el paddle tennis suenan parecido y ambos usan pala maciza, pero son dos deportes distintos. El pádel se juega en pista cerrada con pelota a presión. El paddle tennis, en una pista más pequeña y abierta con pelota más blanda.",
 tldr:["<b>Pádel:</b> pista cerrada de 20 m × 10 m, paredes de cristal y reja que entran en juego, solo dobles, saque de abajo tras un bote.","<b>Paddle tennis:</b> pista abierta de unos 15 m × 6 m, sin paredes en juego, red más baja, pala maciza y pelota de tenis a baja presión.","<b>«Paddle» suele ser solo una grafía de pádel.</b> En España y el Reino Unido quien busca «paddle» casi siempre quiere pádel; en EE. UU. puede ser cualquiera, así que mira la pista."],
 toc:{diff:"La respuesta corta",table:"Comparación cara a cara",names:"Por qué se confunden los nombres",origin:"De dónde viene cada deporte",which:"¿Cuál deberías jugar?",gear:"Material: ¿comparten algo?",faq:"Preguntas frecuentes"},
 sections:[
  {id:"diff",h:"La respuesta corta",html:`<p>El pádel es un deporte de pala que se juega en dobles en una pista cerrada, con paredes que siguen en juego. Se golpea una pelota de goma a presión con una pala maciza sin cuerdas y, tras botar en el suelo, puede salir del cristal o de la reja y aún devolverse. El paddle tennis es un deporte más antiguo en una pista pequeña y abierta, sin paredes en juego, red más baja y pelota de tenis a baja presión. Ambos usan pala maciza, por eso se confunden, pero la pista, la pelota y la táctica son distintas.</p>`},
  {id:"table",h:"Comparación cara a cara",html:`<div class="tw"><table><thead><tr><th></th><th>Pádel</th><th>Paddle tennis</th></tr></thead><tbody>
<tr><td><b>Pista</b></td><td>20 m × 10 m, cerrada con cristal y reja</td><td>Unos 15,2 m × 6,1 m, abierta</td></tr>
<tr><td><b>Paredes en juego</b></td><td>Sí, tras botar en el suelo</td><td>No: tocar pared o reja acaba el punto</td></tr>
<tr><td><b>Altura de la red</b></td><td>0,88 m en el centro, 0,92 m en los postes</td><td>Unos 0,78 m</td></tr>
<tr><td><b>Pala</b></td><td>Maciza, perforada, sin cuerdas, hasta 45,5 cm y 38 mm</td><td>Pala maciza, sin cuerdas, puede ir perforada</td></tr>
<tr><td><b>Pelota</b></td><td>Goma a presión, un poco más pequeña que la de tenis</td><td>Pelota de tenis de baja compresión</td></tr>
<tr><td><b>Jugadores</b></td><td>Dobles</td><td>Sobre todo dobles; también hay individuales</td></tr>
<tr><td><b>Saque</b></td><td>De abajo, con bote previo, a la altura de la cintura o por debajo, dos saques</td><td>De abajo, un saque por punto</td></tr>
<tr><td><b>Puntuación</b></td><td>Estilo tenis; el deuce se resuelve según el formato</td><td>Estilo tenis con ventaja</td></tr>
</tbody></table></div><p class="muted small">Los detalles pueden variar entre clubes y federaciones. Nuestra guía de ${l.rules} cubre las opciones de puntuación del pádel.</p>`},
  {id:"names",h:"Por qué se confunden los nombres",html:`<p>«Pádel» es el nombre propio del deporte, con grafía de uso español y latinoamericano. Quien habla inglés lo oye como “paddle” y a menudo lo escribe así, así que muchas búsquedas de «paddle» en realidad buscan pádel. En EE. UU. «paddle» también designa el paddle tennis, el platform tennis y, de forma informal, el pickleball: el contexto decide. Si la pista tiene cristal y reja alrededor, es pádel.</p><p>También se confunde a veces con el pickleball (pala maciza y pelota de plástico perforada en pista pequeña sin paredes) o con squash y racquetball (paredes en juego, pero raquetas encordadas). El pádel es su propio juego: puntuación de tenis, paredes al estilo squash.</p>`},
  {id:"origin",h:"De dónde viene cada deporte",html:`<p>El paddle tennis nació en Estados Unidos a finales del siglo XIX y se extendió por parques de Nueva York desde los años 1910 como versión de tenis en pista pequeña. El pádel se creó en Acapulco (México) en 1969, cuando Enrique Corcuera construyó una pista con paredes para que la pelota no se escapara. Creció en España y Argentina y hoy se juega en muchos países, con un auge claro en el Reino Unido y en toda Europa.</p>`},
  {id:"which",h:"¿Cuál deberías jugar?",html:`<p>Si vives en España, Portugal, Italia, Francia, Alemania, el Reino Unido o buena parte de Europa y Sudamérica, el deporte que puedes reservar en un club local es casi seguro el pádel. El paddle tennis se concentra sobre todo en partes de Estados Unidos. El pádel encaja bien a quien empieza: las paredes mantienen la pelota en juego, los peloteos son largos y el saque de abajo permite pelotear en la primera sesión. Empieza con nuestra guía de ${l.rules} y haz el ${l.finder} para ver qué pala te encaja.</p><p>¿Vienes del tenis? El golpe de fondo ayuda, pero en pádel el swing es más corto y las paredes cambian el posicionamiento. Mira las ${l.tennis} si buscas opciones tolerantes.</p>`},
  {id:"gear",h:"Material: ¿comparten algo?",html:`<p>En la práctica, no. Una pala de pádel cumple los límites del deporte, con núcleo de goma o foam, caras de carbono o fibra y superficie perforada, y debe usarse con cordón de seguridad. La pelota de pádel es de goma a presión pensada para esa pista. Pala y pelota de paddle tennis están hechas para otra pista y otro bote. No compres material de un deporte esperando que sirva para el otro. Para pádel, nuestra ${l.guide} explica forma, peso, balance y núcleo, y la lista de ${l.beg} es un buen punto de partida. Compara ${l.balls} y ${l.shoes} antes de jugar.</p>`},
 ],
 faq:[
  ["¿El pádel es lo mismo que el paddle tennis?","No. El pádel se juega en una pista cerrada de 20 m × 10 m con paredes en juego y pelota a presión. El paddle tennis se juega en una pista más pequeña y abierta con pelota de tenis de baja presión y sin paredes en juego."],
  ["¿Se dice pádel o paddle?","El deporte se llama pádel. «Paddle» es una grafía habitual en inglés y también el nombre de otro deporte, el paddle tennis; usa «pádel» cuando hablas del juego con paredes."],
  ["¿El pádel es lo mismo que el pickleball?","No. El pickleball se juega con pala maciza y pelota de plástico perforada en una pista pequeña abierta con zona de no volea. El pádel se juega en pista cerrada con pelota de goma a presión y pala perforada con cordón."],
  ["¿El pádel se parece más al tenis o al squash?","Toma de ambos. La puntuación es como en tenis y hay red, pero el cristal y la reja se pueden usar tras el bote, lo que se acerca más al squash."],
  ["¿Se puede jugar al pádel con una raqueta de tenis?","No. El pádel exige pala maciza sin cuerdas. La raqueta de tenis no está permitida."],
  ["¿Hacen falta paredes para paddle tennis o para pádel?","El pádel necesita pista cerrada porque las paredes forman parte del juego. El paddle tennis se juega en pista abierta sin paredes en juego."],
  ["¿Dónde nació el pádel?","En Acapulco (México) en 1969; luego se extendió por España y Argentina antes de llegar al resto de Europa."],
 ],
 next:["rules", "hold"]
 }; })(),
  fr:(()=>{ const l=L('fr'); return {
 crumb:"Padel vs paddle tennis",
 title:"Padel vs paddle tennis : quelle différence ?",
 desc:"Le padel et le paddle tennis sont deux sports différents. Comparez le court, les murs, la raquette, la balle, le service et le scoring, et pourquoi « paddle » et « padel » se mélangent.",
 eyebrow:"Repères",
 h1:"Padel vs paddle tennis : quelle différence ?",
 lead:"Le padel et le paddle tennis sonnent pareil et utilisent une raquette pleine, mais ce sont deux sports. Le padel se joue sur un court clos avec une balle sous pression. Le paddle tennis, sur un plus petit court ouvert avec une balle plus souple.",
 tldr:["<b>Padel :</b> court clos 20 m × 10 m, murs en verre et grillage dont on peut se servir, uniquement en double, service par-dessous après un rebond.","<b>Paddle tennis :</b> court ouvert d’environ 15 m × 6 m, pas de murs en jeu, filet plus bas, pala pleine et balle de tennis à basse pression.","<b>« Paddle » est souvent juste une orthographe de padel.</b> Au Royaume-Uni et en Espagne, une recherche « paddle » vise presque toujours le padel ; aux USA, ça peut être l’un ou l’autre : regardez le court."],
 toc:{diff:"La réponse courte",table:"Comparaison côte à côte",names:"Pourquoi les noms se mélangent",origin:"D’où vient chaque sport",which:"Lequel jouer ?",gear:"Matériel : partagent-ils quelque chose ?",faq:"FAQ"},
 sections:[
  {id:"diff",h:"La réponse courte",html:`<p>Le padel est un sport de raquette joué en double sur un court clos, avec des murs qui restent en jeu. On frappe une balle en caoutchouc sous pression avec une raquette pleine sans cordage et, après le rebond au sol, elle peut revenir du verre ou du grillage et être encore renvoyée. Le paddle tennis est un sport plus ancien sur un petit court ouvert, sans murs en jeu, filet plus bas et balle de tennis à pression réduite. Les deux utilisent une pala pleine, d’où la confusion, mais le court, la balle et la tactique diffèrent.</p>`},
  {id:"table",h:"Comparaison côte à côte",html:`<div class="tw"><table><thead><tr><th></th><th>Padel</th><th>Paddle tennis</th></tr></thead><tbody>
<tr><td><b>Court</b></td><td>20 m × 10 m, clos (verre et grillage)</td><td>Environ 15,2 m × 6,1 m, ouvert</td></tr>
<tr><td><b>Murs en jeu</b></td><td>Oui, après rebond au sol</td><td>Non : toucher mur ou grillage finit le point</td></tr>
<tr><td><b>Hauteur du filet</b></td><td>0,88 m au centre, 0,92 m aux poteaux</td><td>Environ 0,78 m</td></tr>
<tr><td><b>Raquette</b></td><td>Pleine, perforée, sans cordage, max. 45,5 cm / 38 mm</td><td>Pala pleine, sans cordage, parfois perforée</td></tr>
<tr><td><b>Balle</b></td><td>Caoutchouc sous pression, un peu plus petite qu’une balle de tennis</td><td>Balle de tennis basse compression</td></tr>
<tr><td><b>Joueurs</b></td><td>Double</td><td>Surtout double ; le simple existe aussi</td></tr>
<tr><td><b>Service</b></td><td>Par-dessous, balle rebondie, à hauteur de taille ou moins, deux services</td><td>Par-dessous, un service par point</td></tr>
<tr><td><b>Scoring</b></td><td>Style tennis ; le deuce selon le format</td><td>Style tennis avec avantage</td></tr>
</tbody></table></div><p class="muted small">Les détails varient selon les clubs et fédérations. Notre guide des ${l.rules} détaille les options de scoring du padel.</p>`},
  {id:"names",h:"Pourquoi les noms se mélangent",html:`<p>« Padel » est le nom du sport, issu de l’usage espagnol et latino-américain. Les anglophones l’entendent « paddle » et l’écrivent souvent ainsi, donc beaucoup de recherches « paddle » visent le padel. Aux USA, « paddle » désigne aussi le paddle tennis, le platform tennis et, de façon informelle, le pickleball : le contexte tranche. Si le court a du verre et un grillage tout autour, c’est du padel.</p><p>On le confond aussi parfois avec le pickleball (pala pleine et balle plastique perforée sur petit court sans murs) ou avec le squash et le racquetball (murs en jeu, mais raquettes cordées). Le padel est un jeu à part : scoring tennis, murs façon squash.</p>`},
  {id:"origin",h:"D’où vient chaque sport",html:`<p>Le paddle tennis est né aux États-Unis à la fin des années 1890 et s’est répandu dans les parcs de New York à partir des années 1910 comme tennis sur petit court. Le padel a été créé à Acapulco (Mexique) en 1969, quand Enrique Corcuera a construit un court muré pour garder la balle en jeu. Il a ensuite grandi en Espagne et en Argentine et se joue aujourd’hui dans de nombreux pays, avec une forte croissance au Royaume-Uni et en Europe.</p>`},
  {id:"which",h:"Lequel jouer ?",html:`<p>Si vous vivez au Royaume-Uni, en Espagne, au Portugal, en Italie, en France, en Allemagne ou dans une grande partie de l’Europe et de l’Amérique du Sud, le sport réservable en club est presque sûrement le padel. Le paddle tennis se trouve surtout dans certaines régions des États-Unis. Le padel convient bien aux débutants : les murs gardent la balle, les échanges sont longs, et un service par-dessous permet de rallier dès la première séance. Commencez par notre guide des ${l.rules} et passez le ${l.finder} pour voir quelle raquette vous convient.</p><p>Vous venez du tennis ? Vos coups de fond aident, mais au padel le swing est plus court et les murs changent le placement. Voir les ${l.tennis} pour des options tolérantes.</p>`},
  {id:"gear",h:"Matériel : partagent-ils quelque chose ?",html:`<p>Pas vraiment. Une raquette de padel respecte les limites du sport, avec un noyau mousse ou caoutchouc, des faces carbone ou fibre et une surface perforée, et elle doit s’utiliser avec un cordon de sécurité. La balle de padel est en caoutchouc sous pression pour ce court. Pala et balle de paddle tennis sont conçues pour un autre court et un autre rebond. N’achetez pas le matériel d’un sport en espérant qu’il aille à l’autre. Pour le padel, notre ${l.guide} explique forme, poids, équilibre et noyau, et la liste ${l.beg} est un bon départ. Comparez ${l.balls} et ${l.shoes} avant de jouer.</p>`},
 ],
 faq:[
  ["Le padel est-il le même sport que le paddle tennis ?","Non. Le padel se joue sur un court clos 20 m × 10 m avec murs en jeu et balle sous pression. Le paddle tennis se joue sur un plus petit court ouvert avec une balle de tennis basse pression et sans murs en jeu."],
  ["Dit-on padel ou paddle ?","Le sport s’appelle padel. « Paddle » est une orthographe anglaise courante et le nom d’un autre sport, le paddle tennis ; utilisez « padel » pour le jeu à murs."],
  ["Le padel est-il la même chose que le pickleball ?","Non. Le pickleball se joue avec une pala pleine et une balle plastique perforée sur un petit court ouvert avec zone de non-volley. Le padel se joue sur court clos avec une balle caoutchouc sous pression et une raquette perforée avec cordon."],
  ["Le padel ressemble-t-il plus au tennis ou au squash ?","Il emprunte aux deux. Le scoring est celui du tennis et il y a un filet, mais le verre et le grillage se jouent après le rebond, ce qui rappelle le squash."],
  ["Peut-on jouer au padel avec une raquette de tennis ?","Non. Le padel exige une raquette pleine sans cordage. Une raquette de tennis n’est pas autorisée."],
  ["Faut-il des murs pour le paddle tennis ou le padel ?","Le padel a besoin d’un court clos car les murs font partie du jeu. Le paddle tennis se joue sur court ouvert sans murs en jeu."],
  ["Où le padel a-t-il commencé ?","À Acapulco (Mexique) en 1969, puis il s’est répandu en Espagne et en Argentine avant le reste de l’Europe."],
 ],
 next:["rules", "hold"]
 }; })(),
  pt:(()=>{ const l=L('pt'); return {
 crumb:"Pádel vs paddle tennis",
 title:"Pádel vs paddle tennis: qual é a diferença?",
 desc:"O pádel e o paddle tennis são desportos diferentes. Compara court, paredes, raquete, bola, serviço e pontuação, e porque se misturam «paddle» e «pádel».",
 eyebrow:"Explicador",
 h1:"Pádel vs paddle tennis: qual é a diferença?",
 lead:"O pádel e o paddle tennis soam igual e ambos usam raquete sólida, mas são dois desportos. O pádel joga-se num court fechado com bola pressurizada. O paddle tennis, num court mais pequeno e aberto com bola mais mole.",
 tldr:["<b>Pádel:</b> court fechado 20 m × 10 m, paredes de vidro e rede metálica em jogo, só pares, serviço por baixo após um ressalto.","<b>Paddle tennis:</b> court aberto ~15 m × 6 m, sem paredes em jogo, rede mais baixa, pala sólida e bola de ténis a baixa pressão.","<b>«Paddle» é muitas vezes só uma grafia de pádel.</b> No Reino Unido e em Espanha quem pesquisa «paddle» quer quase sempre pádel; nos EUA pode ser qualquer um — olha para o court."],
 toc:{diff:"A resposta curta",table:"Comparação lado a lado",names:"Porque os nomes se misturam",origin:"De onde veio cada desporto",which:"Qual deves jogar?",gear:"Equipamento: partilham alguma coisa?",faq:"Perguntas frequentes"},
 sections:[
  {id:"diff",h:"A resposta curta",html:`<p>O pádel é um desporto de raquete jogado em pares num court fechado, com paredes que continuam em jogo. Bate-se uma bola de borracha pressurizada com uma raquete sólida sem cordas e, depois de ressalto no chão, pode sair do vidro ou da rede metálica e ainda ser devolvida. O paddle tennis é um desporto mais antigo num court pequeno e aberto, sem paredes em jogo, rede mais baixa e bola de ténis a pressão reduzida. Ambos usam pala sólida — daí a confusão — mas o court, a bola e a tática são diferentes.</p>`},
  {id:"table",h:"Comparação lado a lado",html:`<div class="tw"><table><thead><tr><th></th><th>Pádel</th><th>Paddle tennis</th></tr></thead><tbody>
<tr><td><b>Court</b></td><td>20 m × 10 m, fechado (vidro e rede)</td><td>~15,2 m × 6,1 m, aberto</td></tr>
<tr><td><b>Paredes em jogo</b></td><td>Sim, após ressalto no chão</td><td>Não: tocar parede ou rede acaba o ponto</td></tr>
<tr><td><b>Altura da rede</b></td><td>0,88 m no centro, 0,92 m nos postes</td><td>~0,78 m</td></tr>
<tr><td><b>Raquete</b></td><td>Sólida, perfurada, sem cordas, até 45,5 cm / 38 mm</td><td>Pala sólida, sem cordas, pode ser perfurada</td></tr>
<tr><td><b>Bola</b></td><td>Borracha pressurizada, um pouco menor que a de ténis</td><td>Bola de ténis de baixa compressão</td></tr>
<tr><td><b>Jogadores</b></td><td>Pares</td><td>Sobretudo pares; também há individuais</td></tr>
<tr><td><b>Serviço</b></td><td>Por baixo, com ressalto, à altura da cintura ou abaixo, dois serviços</td><td>Por baixo, um serviço por ponto</td></tr>
<tr><td><b>Pontuação</b></td><td>Estilo ténis; o deuce conforme o formato</td><td>Estilo ténis com vantagem</td></tr>
</tbody></table></div><p class="muted small">Os detalhes variam entre clubes e federações. O nosso guia de ${l.rules} cobre as opções de pontuação do pádel.</p>`},
  {id:"names",h:"Porque os nomes se misturam",html:`<p>«Pádel» é o nome do desporto, com grafia de uso espanhol e latino-americano. Quem fala inglês ouve «paddle» e escreve assim, por isso muitas pesquisas «paddle» querem pádel. Nos EUA, «paddle» também designa paddle tennis, platform tennis e, informalmente, pickleball: o contexto decide. Se o court tem vidro e rede metálica à volta, é pádel.</p><p>Também se confunde com pickleball (pala sólida e bola de plástico perfurada em court pequeno sem paredes) ou com squash e racquetball (paredes em jogo, mas raquetes com cordas). O pádel é o seu próprio jogo: pontuação de ténis, paredes à la squash.</p>`},
  {id:"origin",h:"De onde veio cada desporto",html:`<p>O paddle tennis nasceu nos Estados Unidos no final do século XIX e espalhou-se pelos parques de Nova Iorque a partir dos anos 1910 como ténis em court pequeno. O pádel foi criado em Acapulco (México) em 1969, quando Enrique Corcuera construiu um court com paredes para a bola não sair. Cresceu em Espanha e na Argentina e joga-se hoje em muitos países, com forte crescimento no Reino Unido e na Europa.</p>`},
  {id:"which",h:"Qual deves jogar?",html:`<p>Se vives no Reino Unido, Espanha, Portugal, Itália, França, Alemanha ou grande parte da Europa e da América do Sul, o desporto que reservas no clube local é quase de certeza o pádel. O paddle tennis concentra-se sobretudo em partes dos Estados Unidos. O pádel encaixa bem a quem começa: as paredes mantêm a bola em jogo, os rallies são longos e o serviço por baixo permite trocar bolas na primeira sessão. Começa pelo nosso guia de ${l.rules} e faz o ${l.finder} para ver que raquete te serve.</p><p>Vens do ténis? O fundo de court ajuda, mas no pádel o swing é mais curto e as paredes mudam o posicionamento. Vê as ${l.tennis} para opções tolerantes.</p>`},
  {id:"gear",h:"Equipamento: partilham alguma coisa?",html:`<p>Na prática, não. Uma raquete de pádel cumpre os limites do desporto, com núcleo de espuma ou borracha, faces de carbono ou fibra e superfície perfurada, e deve usar-se com fita de pulso. A bola de pádel é de borracha pressurizada para esse court. Pala e bola de paddle tennis são para outro court e outro ressalto. Não compres material de um desporto à espera que sirva no outro. Para pádel, o nosso ${l.guide} explica forma, peso, balanço e núcleo, e a lista ${l.beg} é um bom ponto de partida. Compara ${l.balls} e ${l.shoes} antes de jogar.</p>`},
 ],
 faq:[
  ["O pádel é o mesmo que o paddle tennis?","Não. O pádel joga-se num court fechado 20 m × 10 m com paredes em jogo e bola pressurizada. O paddle tennis joga-se num court mais pequeno e aberto com bola de ténis a baixa pressão e sem paredes em jogo."],
  ["Diz-se pádel ou paddle?","O desporto chama-se pádel. «Paddle» é uma grafia inglesa comum e o nome de outro desporto; usa «pádel» para o jogo com paredes."],
  ["O pádel é o mesmo que o pickleball?","Não. O pickleball usa pala sólida e bola de plástico perfurada num court pequeno aberto com zona de não voleio. O pádel joga-se em court fechado com bola de borracha pressurizada e raquete perfurada com fita de pulso."],
  ["O pádel parece-se mais com o ténis ou com o squash?","Retira dos dois. A pontuação é de ténis e há rede, mas o vidro e a rede metálica jogam-se após o ressalto, o que se aproxima do squash."],
  ["Posso jogar pádel com uma raquete de ténis?","Não. O pádel exige raquete sólida sem cordas. A raquete de ténis não é permitida."],
  ["Preciso de paredes para paddle tennis ou pádel?","O pádel precisa de court fechado porque as paredes fazem parte do jogo. O paddle tennis joga-se em court aberto sem paredes em jogo."],
  ["Onde começou o pádel?","Em Acapulco (México) em 1969; depois espalhou-se por Espanha e Argentina antes do resto da Europa."],
 ],
 next:["rules", "hold"]
 }; })(),
  it:(()=>{ const l=L('it'); return {
 crumb:"Padel vs paddle tennis",
 title:"Padel vs paddle tennis: qual è la differenza?",
 desc:"Padel e paddle tennis sono sport diversi. Confronta campo, muri, racchetta, palla, servizio e punteggio, e perché si confondono «paddle» e «padel».",
 eyebrow:"Spiegazione",
 h1:"Padel vs paddle tennis: qual è la differenza?",
 lead:"Padel e paddle tennis suonano uguali e usano entrambi una racchetta piena, ma sono due sport. Il padel si gioca in un campo chiuso con palla pressurizzata. Il paddle tennis, su un campo più piccolo e aperto con palla più morbida.",
 tldr:["<b>Padel:</b> campo chiuso 20 m × 10 m, muri di vetro e rete metallica in gioco, solo doppio, servizio dal basso dopo un rimbalzo.","<b>Paddle tennis:</b> campo aperto ~15 m × 6 m, senza muri in gioco, rete più bassa, pala piena e palla da tennis a bassa pressione.","<b>«Paddle» è spesso solo una grafia di padel.</b> In UK e Spagna chi cerca «paddle» di solito intende padel; negli USA può essere entrambi: guarda il campo."],
 toc:{diff:"La risposta breve",table:"Confronto fianco a fianco",names:"Perché i nomi si confondono",origin:"Da dove viene ogni sport",which:"Quale dovresti giocare?",gear:"Attrezzatura: condividono qualcosa?",faq:"Domande frequenti"},
 sections:[
  {id:"diff",h:"La risposta breve",html:`<p>Il padel è uno sport di racchetta giocato in doppio su un campo chiuso, con muri che restano in gioco. Si colpisce una palla di gomma pressurizzata con una racchetta piena senza corde e, dopo il rimbalzo a terra, può uscire dal vetro o dalla rete e essere ancora respinta. Il paddle tennis è uno sport più antico su un piccolo campo aperto, senza muri in gioco, rete più bassa e palla da tennis a pressione ridotta. Entrambi usano pala piena — ecco la confusione — ma campo, palla e tattica sono diversi.</p>`},
  {id:"table",h:"Confronto fianco a fianco",html:`<div class="tw"><table><thead><tr><th></th><th>Padel</th><th>Paddle tennis</th></tr></thead><tbody>
<tr><td><b>Campo</b></td><td>20 m × 10 m, chiuso (vetro e rete)</td><td>~15,2 m × 6,1 m, aperto</td></tr>
<tr><td><b>Muri in gioco</b></td><td>Sì, dopo rimbalzo a terra</td><td>No: toccare muro o rete chiude il punto</td></tr>
<tr><td><b>Altezza rete</b></td><td>0,88 m al centro, 0,92 m ai pali</td><td>~0,78 m</td></tr>
<tr><td><b>Racchetta</b></td><td>Piena, forata, senza corde, max 45,5 cm / 38 mm</td><td>Pala piena, senza corde, a volte forata</td></tr>
<tr><td><b>Palla</b></td><td>Gomma pressurizzata, un po’ più piccola del tennis</td><td>Palla da tennis a bassa compressione</td></tr>
<tr><td><b>Giocatori</b></td><td>Doppio</td><td>Soprattutto doppio; esiste anche il singolo</td></tr>
<tr><td><b>Servizio</b></td><td>Dal basso, con rimbalzo, a altezza vita o sotto, due servizi</td><td>Dal basso, un servizio per punto</td></tr>
<tr><td><b>Punteggio</b></td><td>Stile tennis; il deuce secondo il formato</td><td>Stile tennis con vantaggio</td></tr>
</tbody></table></div><p class="muted small">I dettagli variano tra club e federazioni. La nostra guida alle ${l.rules} copre le opzioni di punteggio del padel.</p>`},
  {id:"names",h:"Perché i nomi si confondono",html:`<p>«Padel» è il nome dello sport, con grafia di uso spagnolo e latinoamericano. Chi parla inglese lo sente come “paddle” e spesso lo scrive così, quindi molte ricerche «paddle» intendono padel. Negli USA «paddle» indica anche paddle tennis, platform tennis e, informalmente, pickleball: decide il contesto. Se il campo ha vetro e rete intorno, è padel.</p><p>Si confonde anche con il pickleball (pala piena e palla di plastica forata su piccolo campo senza muri) o con squash e racquetball (muri in gioco, ma racchette cordate). Il padel è un gioco a sé: punteggio da tennis, muri da squash.</p>`},
  {id:"origin",h:"Da dove viene ogni sport",html:`<p>Il paddle tennis nacque negli Stati Uniti alla fine dell’Ottocento e si diffuse nei parchi di New York dagli anni Dieci come tennis su campo piccolo. Il padel fu creato ad Acapulco (Messico) nel 1969, quando Enrique Corcuera costruì un campo murato perché la palla restasse in gioco. Crebbe in Spagna e Argentina e oggi si gioca in molti Paesi, con forte crescita nel Regno Unito e in Europa.</p>`},
  {id:"which",h:"Quale dovresti giocare?",html:`<p>Se vivi nel Regno Unito, Spagna, Portogallo, Italia, Francia, Germania o in gran parte d’Europa e Sudamerica, lo sport che prenoti in club è quasi certamente il padel. Il paddle tennis si trova soprattutto in alcune zone degli Stati Uniti. Il padel va bene ai principianti: i muri tengono la palla in gioco, gli scambi sono lunghi e il servizio dal basso permette di scambiare già nella prima sessione. Parti dalla nostra guida alle ${l.rules} e fai il ${l.finder} per vedere quale racchetta ti sta bene.</p><p>Vieni dal tennis? I fondisti aiutano, ma nel padel lo swing è più corto e i muri cambiano il posizionamento. Vedi le ${l.tennis} per opzioni indulgenti.</p>`},
  {id:"gear",h:"Attrezzatura: condividono qualcosa?",html:`<p>In pratica no. Una racchetta da padel rispetta i limiti dello sport, con nucleo in schiuma o gomma, facce in carbonio o fibra e superficie forata, e va usata con cordino da polso. La palla da padel è di gomma pressurizzata per quel campo. Pala e palla da paddle tennis sono per un altro campo e un altro rimbalzo. Non comprare l’attrezzatura di uno sport sperando che vada all’altro. Per il padel, la nostra ${l.guide} spiega forma, peso, bilanciamento e nucleo, e la lista ${l.beg} è un buon inizio. Confronta ${l.balls} e ${l.shoes} prima di giocare.</p>`},
 ],
 faq:[
  ["Il padel è uguale al paddle tennis?","No. Il padel si gioca in un campo chiuso 20 m × 10 m con muri in gioco e palla pressurizzata. Il paddle tennis si gioca su un campo più piccolo e aperto con palla da tennis a bassa pressione e senza muri in gioco."],
  ["Si dice padel o paddle?","Lo sport si chiama padel. «Paddle» è una grafia inglese comune e il nome di un altro sport; usa «padel» per il gioco con i muri."],
  ["Il padel è uguale al pickleball?","No. Il pickleball usa pala piena e palla di plastica forata su un piccolo campo aperto con zona di non volée. Il padel si gioca in campo chiuso con palla di gomma pressurizzata e racchetta forata con cordino."],
  ["Il padel assomiglia di più al tennis o allo squash?","Prende da entrambi. Il punteggio è da tennis e c’è la rete, ma vetro e rete metallica si giocano dopo il rimbalzo, più vicino allo squash."],
  ["Si può giocare a padel con una racchetta da tennis?","No. Il padel richiede una racchetta piena senza corde. La racchetta da tennis non è ammessa."],
  ["Servono i muri per paddle tennis o padel?","Il padel ha bisogno di un campo chiuso perché i muri fanno parte del gioco. Il paddle tennis si gioca su campo aperto senza muri in gioco."],
  ["Dove è nato il padel?","Ad Acapulco (Messico) nel 1969; poi si è diffuso in Spagna e Argentina prima del resto d’Europa."],
 ],
 next:["rules", "hold"]
 }; })(),
  de:(()=>{ const l=L('de'); return {
 crumb:"Padel vs Paddle Tennis",
 title:"Padel vs Paddle Tennis: was ist der Unterschied?",
 desc:"Padel und Paddle Tennis sind unterschiedliche Sportarten. Vergleiche Court, Wände, Schläger, Ball, Aufschlag und Zählweise, und warum «Paddle» und «Padel» vermischt werden.",
 eyebrow:"Einordnung",
 h1:"Padel vs Paddle Tennis: was ist der Unterschied?",
 lead:"Padel und Paddle Tennis klingen ähnlich und nutzen beide einen massiven Schläger, sind aber zwei Sportarten. Padel wird auf einem umschlossenen Court mit Druckball gespielt. Paddle Tennis auf einem kleineren, offenen Court mit weicherem Ball.",
 tldr:["<b>Padel:</b> umschlossener 20 m × 10 m Court, Glaswände und Zaun im Spiel, nur Doppel, Unterhand-Aufschlag nach einem Aufsprung.","<b>Paddle Tennis:</b> offener Court ~15 m × 6 m, keine Wände im Spiel, niedrigeres Netz, massiver Schläger und Tennisball mit niedrigem Druck.","<b>«Paddle» ist oft nur eine Schreibweise von Padel.</b> In UK und Spanien meint die Suche nach «paddle» meist Padel; in den USA kann beides gemeint sein — schau auf den Court."],
 toc:{diff:"Die kurze Antwort",table:"Vergleich Seite an Seite",names:"Warum die Namen vermischt werden",origin:"Woher jeder Sport kommt",which:"Welchen solltest du spielen?",gear:"Ausrüstung: teilen sie etwas?",faq:"FAQ"},
 sections:[
  {id:"diff",h:"Die kurze Antwort",html:`<p>Padel ist ein Schlägersport im Doppel auf einem umschlossenen Court, dessen Wände im Spiel bleiben. Du triffst einen Druck-Gummiball mit einem massiven, besaitungslosen Schläger und kannst ihn nach dem Bodenaufsprung noch vom Glas oder Zaun zurückspielen. Paddle Tennis ist älter, wird auf einem kleinen offenen Court ohne Wände im Spiel gespielt, mit niedrigerem Netz und einem Tennisball mit reduziertem Druck. Beide nutzen massive Schläger — daher die Verwechslung — aber Court, Ball und Taktik unterscheiden sich.</p>`},
  {id:"table",h:"Vergleich Seite an Seite",html:`<div class="tw"><table><thead><tr><th></th><th>Padel</th><th>Paddle Tennis</th></tr></thead><tbody>
<tr><td><b>Court</b></td><td>20 m × 10 m, umschlossen (Glas und Zaun)</td><td>~15,2 m × 6,1 m, offen</td></tr>
<tr><td><b>Wände im Spiel</b></td><td>Ja, nach Bodenaufsprung</td><td>Nein: Wand oder Zaun beendet den Punkt</td></tr>
<tr><td><b>Netzhöhe</b></td><td>0,88 m in der Mitte, 0,92 m an den Pfosten</td><td>~0,78 m</td></tr>
<tr><td><b>Schläger</b></td><td>Massiv, gelocht, ohne Saiten, max. 45,5 cm / 38 mm</td><td>Massiver Schläger, ohne Saiten, ggf. gelocht</td></tr>
<tr><td><b>Ball</b></td><td>Druck-Gummi, etwas kleiner als Tennisball</td><td>Tennisball mit niedriger Kompression</td></tr>
<tr><td><b>Spieler</b></td><td>Doppel</td><td>Meist Doppel; Einzel gibt es auch</td></tr>
<tr><td><b>Aufschlag</b></td><td>Unterhand, nach Aufsprung, auf Hüfthöhe oder darunter, zwei Aufschläge</td><td>Unterhand, ein Aufschlag pro Punkt</td></tr>
<tr><td><b>Zählweise</b></td><td>Tennis-Stil; Deuce je nach Format</td><td>Tennis-Stil mit Vorteil</td></tr>
</tbody></table></div><p class="muted small">Details variieren je nach Club und Verband. Unser Guide zu den ${l.rules} deckt die Zähloptionen im Padel ab.</p>`},
  {id:"names",h:"Warum die Namen vermischt werden",html:`<p>«Padel» ist der Eigenname des Sports aus spanischem und lateinamerikanischem Gebrauch. Englischsprachige hören «paddle» und schreiben es oft so — viele Suchen nach «paddle» meinen Padel. In den USA meint «paddle» auch Paddle Tennis, Platform Tennis und informell Pickleball: der Kontext entscheidet. Hat der Court Glas und Maschendraht rundum, ist es Padel.</p><p>Manchmal wird es mit Pickleball verwechselt (massiver Schläger und gelochter Plastikball auf kleinem offenen Court) oder mit Squash und Racquetball (Wände im Spiel, aber besaitete Schläger). Padel ist ein eigenes Spiel: Tennis-Zählweise, Squash-ähnliche Wände.</p>`},
  {id:"origin",h:"Woher jeder Sport kommt",html:`<p>Paddle Tennis entstand Ende des 19. Jahrhunderts in den USA und verbreitete sich ab den 1910ern in New Yorker Parks als Tennis auf kleinem Court. Padel entstand 1969 in Acapulco (Mexiko), als Enrique Corcuera einen ummauerten Court baute, damit der Ball im Spiel blieb. Es wuchs in Spanien und Argentinien und wird heute in vielen Ländern gespielt, mit starkem Wachstum in UK und Europa.</p>`},
  {id:"which",h:"Welchen solltest du spielen?",html:`<p>Wenn du in UK, Spanien, Portugal, Italien, Frankreich, Deutschland oder weiten Teilen Europas und Südamerikas lebst, ist der Sport, den du im Club buchst, fast sicher Padel. Paddle Tennis findet man vor allem in Teilen der USA. Padel eignet sich gut für Einsteiger: die Wände halten den Ball im Spiel, die Ballwechsel sind lang, und der Unterhand-Aufschlag erlaubt schon in der ersten Einheit Rallys. Starte mit unserem Guide zu den ${l.rules} und mach das ${l.finder}, um den passenden Schläger zu finden.</p><p>Kommst du vom Tennis? Deine Grundschläge helfen, aber im Padel ist der Schwung kürzer und die Wände ändern die Positionierung. Siehe die ${l.tennis} für verzeihende Optionen.</p>`},
  {id:"gear",h:"Ausrüstung: teilen sie etwas?",html:`<p>Praktisch nicht. Ein Padelschläger hält die Sportgrenzen ein, mit Schaum- oder Gummikern, Carbon- oder Glasfaserflächen und gelochter Trefffläche, und muss mit Handgelenkschlaufe genutzt werden. Der Padelball ist ein Druck-Gummiball für diesen Court. Schläger und Ball beim Paddle Tennis sind für einen anderen Court und Absprung gemacht. Kauf keine Ausrüstung der einen Sportart und erwarte, dass sie für die andere passt. Für Padel erklärt unsere ${l.guide} Form, Gewicht, Balance und Kern, und die Liste ${l.beg} ist ein guter Start. Vergleiche ${l.balls} und ${l.shoes} vor dem Spielen.</p>`},
 ],
 faq:[
  ["Ist Padel dasselbe wie Paddle Tennis?","Nein. Padel wird auf einem umschlossenen 20 m × 10 m Court mit Wänden im Spiel und Druckball gespielt. Paddle Tennis auf einem kleineren offenen Court mit Tennisball mit niedrigem Druck und ohne Wände im Spiel."],
  ["Heißt es Padel oder Paddle?","Der Sport heißt Padel. «Paddle» ist eine häufige englische Schreibweise und der Name einer anderen Sportart; nutze «Padel» für das Wandspiel."],
  ["Ist Padel dasselbe wie Pickleball?","Nein. Pickleball nutzt einen massiven Schläger und einen gelochten Plastikball auf einem kleinen offenen Court mit Non-Volley-Zone. Padel wird auf umschlossenem Court mit Druck-Gummiball und gelochtem Schläger mit Schlaufe gespielt."],
  ["Ähnelt Padel eher Tennis oder Squash?","Es nimmt von beiden. Gezählt wird wie im Tennis und es gibt ein Netz, aber Glas und Zaun sind nach dem Aufsprung spielbar — näher am Squash."],
  ["Kann man Padel mit einem Tennisschläger spielen?","Nein. Padel verlangt einen massiven, besaitungslosen Schläger. Ein Tennisschläger ist nicht erlaubt."],
  ["Braucht man Wände für Paddle Tennis oder Padel?","Padel braucht einen umschlossenen Court, weil die Wände Teil des Spiels sind. Paddle Tennis wird auf offenem Court ohne Wände im Spiel gespielt."],
  ["Wo begann Padel?","1969 in Acapulco (Mexiko); danach verbreitete es sich über Spanien und Argentinien in den Rest Europas."],
 ],
 next:["rules", "hold"]
 }; })(),
},
hold:{
  en:(()=>{ const l=L('en'); return {
 crumb:"How to hold a padel racket",
 title:"How to hold a padel racket: grips, hand position and common mistakes",
 desc:"Learn how to hold a padel racket: the continental grip, how it differs from the eastern forehand and backhand grips, hand position and the mistakes beginners make.",
 eyebrow:"Technique guide",
 h1:"How to hold a padel racket",
 lead:"Most padel players hold the racket with a relaxed continental grip, like shaking hands with the handle, and make small changes from there. This guide shows the grip, the usual alternatives and the mistakes to avoid.",
 tldr:["<b>Start with the continental grip:</b> hold the handle as if shaking hands, with the “V” between thumb and index finger on the top edge.","<b>Keep it loose:</b> grip firmly only at the moment of contact. A tight grip makes the arm tire and kills feel.","<b>Use the wrist strap</b> on every shot: it is mandatory under the rules."],
 toc:{basic:"The basic grip",continental:"Continental grip step by step",eastern:"Eastern forehand and backhand grips",pressure:"How tight to hold",handle:"Handle size and overgrip",mistakes:"Common mistakes",faq:"FAQ"},
 sections:[
  {id:"basic",h:"The basic grip",html:`<p>Padel is played with a short, fast swing, and most players hold the racket the same way for almost every shot. Rest the racket on your open palm so the face is vertical, then close your fingers around the handle. The handle is eight-sided, which helps you find the same hand position every time without looking. Beginners often start by holding the racket like a frying pan; the aim is to move to a more neutral, hammer-like hold that works for both forehand and backhand without changing your grip.</p>`},
  {id:"continental",h:"Continental grip step by step",html:`<ol><li>Hold the racket by the head with your non-playing hand, with the face vertical.</li><li>Place your playing hand on the handle as if you were shaking hands with it.</li><li>Check that the “V” between your thumb and index finger sits on the top edge of the handle.</li><li>Spread your fingers a little, with a small gap between the index finger and the middle finger, and keep your thumb wrapped around the back.</li><li>Hold the bottom of the handle with the heel of your hand near the end cap so the racket does not slip.</li></ol><p>This is the grip used for volleys, bandejas, víboras, smashes and the underarm serve, and it lets you hit forehand and backhand without switching. Coaches often describe it as the “hammer” grip because it feels like holding a hammer handle.</p>`},
  {id:"eastern",h:"Eastern forehand and backhand grips",html:`<p>Padel players sometimes rotate the hand a little from the continental grip depending on the shot. These are small changes, not different ways of holding the racket:</p><ul><li><b>Eastern forehand:</b> rotate your hand a small amount towards the forehand side, so your palm sits more behind the handle. Some players use this for flat forehands from the back of the court.</li><li><b>Eastern backhand:</b> rotate your hand a small amount the other way, towards the backhand side, so your palm sits more on top of the handle. Some players use it for flat backhands.</li></ul><p>If you play tennis, this is the main habit to unlearn. Tennis forehands often use a stronger eastern or semi-western grip. In padel the ball is slower, the swing is shorter and you often volley, so there is rarely time to change grip. If in doubt, stay close to continental and adjust only after a coach or experienced player has watched you hit.</p>`},
  {id:"pressure",h:"How tight to hold",html:`<p>Hold the racket firmly enough that it does not twist when you hit the ball, but loosely enough that your forearm stays relaxed between shots. Many coaches suggest thinking of it as medium pressure through the rally and a firmer squeeze only at the moment of contact. A very tight grip tires the forearm quickly and reduces touch. If your arm feels sore after playing, a softer, lighter racket can help; see our ${l.elbow} and ${l.light} lists, and see a doctor or physiotherapist if you have pain, because grip advice is not medical advice.</p>`},
  {id:"handle",h:"Handle size and overgrip",html:`<p>A handle that is too small makes you squeeze harder; one that is too large limits wrist movement. Padel handles are fairly standard, and many players adjust the feel by adding an overgrip over the original grip. An overgrip adds a little thickness and absorbs sweat, and many players replace it regularly because it wears and loses tack. Adding overgrip also changes the racket’s weight and balance slightly; our ${l.tool} shows how a small change in weight at the handle changes how heavy the racket feels in the head.</p>`},
  {id:"mistakes",h:"Common mistakes",html:`<ul><li><b>Squeezing too hard</b> through the whole rally.</li><li><b>Holding it like a frying pan</b> or like a tennis forehand, which makes volleys and bandejas awkward.</li><li><b>Changing grip between forehand and backhand</b> when there is no time to do it.</li><li><b>Gripping too high</b> on the handle, which makes the racket feel head-heavy and lowers control.</li><li><b>Not wearing the wrist strap.</b> The strap is compulsory and protects other players if the racket slips; read our ${l.rules} guide for the rules on it.</li></ul><p>Once your grip feels natural, choose a racket that matches how you play with our ${l.finder}, or start from the ${l.guide}.</p>`},
 ],
 faq:[
  ["What grip is used in padel?","Most players use a continental grip for nearly every shot, with small rotations towards the eastern forehand or eastern backhand grip for some strokes. You do not normally change grip between forehand and backhand."],
  ["What is the continental grip in padel?","It is the “shaking hands” grip, with the “V” between your thumb and index finger on the top edge of the handle. It works for volleys, smashes, bandejas and the underarm serve."],
  ["Do you hold a padel racket like a tennis racket?","Not quite. Tennis players often use stronger forehand grips. Padel has a shorter swing, a slower ball and more volleys, so a neutral continental grip is the usual starting point."],
  ["What is the eastern backhand grip in padel?","It is a small turn of the hand from continental towards the backhand side, so your palm sits more on top of the handle. Some players use it for flat backhands. Most padel players stay close to continental."],
  ["Should I use a wrist strap?","Yes. The rules require the wrist strap to be attached to the handle and worn around the wrist, and it must not be elastic."],
  ["How tight should I hold a padel racket?","Medium pressure for most of the rally, and a firmer grip only at contact. Gripping too hard tires the forearm and reduces feel."],
  ["Do I need an overgrip?","You do not need one, but many players add an overgrip for tack and sweat absorption and replace it when it wears. It adds a little weight at the handle."],
 ],
 next:["rules", "vs"]
 }; })(),
  es:(()=>{ const l=L('es'); return {
 crumb:"Cómo coger la pala",
 title:"Cómo coger la pala de pádel: grips, posición de la mano y errores",
 desc:"Aprende a coger la pala de pádel: el grip continental, cómo cambia respecto al eastern de derecha y de revés, la presión y los errores habituales.",
 eyebrow:"Técnica",
 h1:"Cómo coger la pala de pádel",
 lead:"La mayoría de jugadores sujetan la pala con un grip continental relajado, como dar la mano al mango, y hacen pequeños ajustes desde ahí. Esta guía muestra el grip, las variantes y los errores a evitar.",
 tldr:["<b>Empieza por el grip continental:</b> sujeta el mango como si dieras la mano, con la «V» entre pulgar e índice en el canto superior.","<b>Manténlo suelto:</b> aprieta solo en el momento del impacto. Un grip demasiado fuerte fatiga el brazo y mata el tacto.","<b>Usa el cordón de seguridad</b> en cada golpe: es obligatorio según el reglamento."],
 toc:{basic:"El grip básico",continental:"Grip continental paso a paso",eastern:"Grips eastern de derecha y de revés",pressure:"Qué tan fuerte sujetar",handle:"Tamaño del mango y overgrip",mistakes:"Errores habituales",faq:"Preguntas frecuentes"},
 sections:[
  {id:"basic",h:"El grip básico",html:`<p>El pádel se juega con un swing corto y rápido, y la mayoría de jugadores sujetan la pala igual en casi todos los golpes. Apoya la pala en la palma abierta con la cara vertical y cierra los dedos alrededor del mango. El mango tiene ocho caras, lo que ayuda a encontrar la misma posición sin mirar. Quien empieza suele sujetarla como una sartén; el objetivo es pasar a un agarre más neutro, tipo martillo, que valga para derecha y revés sin cambiar de grip.</p>`},
  {id:"continental",h:"Grip continental paso a paso",html:`<ol><li>Sujeta la pala por la cabeza con la mano no dominante, con la cara vertical.</li><li>Coloca la mano de juego en el mango como si dieras la mano.</li><li>Comprueba que la «V» entre pulgar e índice queda en el canto superior del mango.</li><li>Separa un poco los dedos, con un pequeño hueco entre índice y corazón, y envuelve el pulgar por detrás.</li><li>Apoya el talón de la mano cerca del tapón para que la pala no se escape.</li></ol><p>Es el grip de voleas, bandejas, víboras, remates y saque de abajo, y permite derecha y revés sin cambiar. Muchos entrenadores lo llaman grip de «martillo» porque se siente como agarrar un mango de martillo.</p>`},
  {id:"eastern",h:"Grips eastern de derecha y de revés",html:`<p>A veces se gira un poco la mano desde el continental según el golpe. Son cambios pequeños, no otra forma de sujetar la pala:</p><ul><li><b>Eastern de derecha:</b> gira un poco hacia el lado de derecha, de modo que la palma quede más detrás del mango. Algunos lo usan en derechas planas desde el fondo.</li><li><b>Eastern de revés:</b> gira un poco al otro lado, hacia el revés, con la palma más encima del mango. Algunos lo usan en reveses planos.</li></ul><p>Si vienes del tenis, este es el hábito a desaprender. En tenis la derecha suele ir con un eastern o semi-western más cerrado. En pádel la pelota es más lenta, el swing más corto y hay muchas voleas, así que casi nunca da tiempo a cambiar de grip. Ante la duda, quédate cerca del continental y ajusta solo cuando un entrenador te haya visto.</p>`},
  {id:"pressure",h:"Qué tan fuerte sujetar",html:`<p>Sujeta con firmeza suficiente para que la pala no gire al impactar, pero con holgura para que el antebrazo siga relajado entre golpes. Muchos coaches hablan de presión media durante el peloteo y un apretón solo en el impacto. Un grip muy fuerte fatiga el antebrazo y reduce el tacto. Si el brazo duele después de jugar, una pala más blanda y ligera puede ayudar; mira nuestras listas de ${l.elbow} y ${l.light}, y consulta a un médico o fisioterapeuta si hay dolor: el consejo de grip no es consejo médico.</p>`},
  {id:"handle",h:"Tamaño del mango y overgrip",html:`<p>Un mango demasiado fino te hace apretar más; uno demasiado grueso limita la muñeca. Los mangos de pádel son bastante estándar, y mucha gente ajusta la sensación añadiendo un overgrip sobre el grip original. El overgrip aporta un poco de grosor y absorbe sudor, y suele cambiarse con frecuencia porque se desgasta y pierde agarre. También cambia un poco el peso y el balance; nuestra ${l.tool} muestra cómo un pequeño cambio de peso en el mango cambia lo pesada que se siente la cabeza.</p>`},
  {id:"mistakes",h:"Errores habituales",html:`<ul><li><b>Apretar demasiado</b> durante todo el peloteo.</li><li><b>Sujetarla como una sartén</b> o como una derecha de tenis, lo que complica voleas y bandejas.</li><li><b>Cambiar de grip entre derecha y revés</b> cuando no da tiempo.</li><li><b>Agarrar demasiado arriba</b> en el mango, lo que hace la pala más cabezona y resta control.</li><li><b>No llevar el cordón.</b> Es obligatorio y protege a los demás si la pala se escapa; lee nuestra guía de ${l.rules}.</li></ul><p>Cuando el grip te resulte natural, elige pala con el ${l.finder} o empieza por la ${l.guide}.</p>`},
 ],
 faq:[
  ["¿Qué grip se usa en pádel?","La mayoría usa el continental en casi todos los golpes, con pequeños giros hacia eastern de derecha o de revés en algunos. No se cambia de grip entre derecha y revés de forma habitual."],
  ["¿Qué es el grip continental en pádel?","Es el de «dar la mano», con la «V» entre pulgar e índice en el canto superior del mango. Vale para voleas, remates, bandejas y saque de abajo."],
  ["¿Se coge la pala como una raqueta de tenis?","No del todo. En tenis la derecha suele ir con grips más cerrados. En pádel el swing es más corto, la pelota más lenta y hay más voleas, así que el continental neutro es el punto de partida habitual."],
  ["¿Qué es el eastern de revés en pádel?","Un pequeño giro desde el continental hacia el lado de revés, con la palma más encima del mango. Algunos lo usan en reveses planos. La mayoría se queda cerca del continental."],
  ["¿Hay que usar el cordón de seguridad?","Sí. El reglamento exige que el cordón esté fijado al mango y se lleve en la muñeca, y que no sea elástico."],
  ["¿Con qué fuerza debo sujetar la pala?","Presión media en el peloteo y un apretón solo en el impacto. Apretar demasiado fatiga el antebrazo y resta tacto."],
  ["¿Necesito overgrip?","No es obligatorio, pero mucha gente añade uno por agarre y sudor y lo cambia cuando se gasta. Añade un poco de peso en el mango."],
 ],
 next:["rules", "vs"]
 }; })(),
  fr:(()=>{ const l=L('fr'); return {
 crumb:"Comment tenir la raquette",
 title:"Comment tenir une raquette de padel : prises, main et erreurs",
 desc:"Apprenez à tenir une raquette de padel : prise continentale, différences avec les prises eastern, pression et erreurs des débutants.",
 eyebrow:"Technique",
 h1:"Comment tenir une raquette de padel",
 lead:"La plupart des joueurs tiennent la raquette avec une prise continentale souple, comme une poignée de main sur le manche, puis ajustent un peu. Ce guide montre la prise, les variantes et les erreurs à éviter.",
 tldr:["<b>Commencez par la prise continentale :</b> tenez le manche comme une poignée de main, avec le « V » entre pouce et index sur l’arête du haut.","<b>Gardez-la souple :</b> serrez seulement à l’impact. Une prise trop ferme fatigue le bras et tue le feeling.","<b>Portez le cordon de sécurité</b> à chaque coup : il est obligatoire."],
 toc:{basic:"La prise de base",continental:"Prise continentale pas à pas",eastern:"Prises eastern coup droit et revers",pressure:"À quel point serrer",handle:"Taille du manche et overgrip",mistakes:"Erreurs fréquentes",faq:"FAQ"},
 sections:[
  {id:"basic",h:"La prise de base",html:`<p>Le padel se joue avec un swing court et rapide, et la plupart des joueurs tiennent la raquette de la même façon pour presque tous les coups. Posez la raquette sur la paume ouverte, face verticale, puis fermez les doigts autour du manche. Le manche a huit faces, ce qui aide à retrouver la même position sans regarder. Les débutants tiennent souvent la raquette comme une poêle ; l’objectif est un maintien plus neutre, type marteau, qui marche en coup droit et en revers sans changer de prise.</p>`},
  {id:"continental",h:"Prise continentale pas à pas",html:`<ol><li>Tenez la raquette par la tête avec la main non dominante, face verticale.</li><li>Placez la main de jeu sur le manche comme pour une poignée de main.</li><li>Vérifiez que le « V » entre pouce et index est sur l’arête du haut.</li><li>Écartez un peu les doigts, avec un petit écart entre index et majeur, pouce derrière.</li><li>Appuyez le talon de la main près du bouchon pour que la raquette ne glisse pas.</li></ol><p>C’est la prise des volées, bandejas, viboras, smashes et du service par-dessous, et elle permet coup droit et revers sans changer. On l’appelle souvent prise « marteau ».</p>`},
  {id:"eastern",h:"Prises eastern coup droit et revers",html:`<p>On tourne parfois un peu la main depuis la continentale selon le coup. Ce sont de petits ajustements :</p><ul><li><b>Eastern coup droit :</b> tournez légèrement vers le coup droit, paume plus derrière le manche.</li><li><b>Eastern revers :</b> tournez l’autre sens, paume plus au-dessus du manche.</li></ul><p>Si vous venez du tennis, c’est l’habitude à perdre. Au tennis le coup droit est souvent plus fermé. Au padel la balle est plus lente, le swing plus court et les volées nombreuses : on change rarement de prise. En cas de doute, restez proche de la continentale.</p>`},
  {id:"pressure",h:"À quel point serrer",html:`<p>Assez ferme pour que la raquette ne tourne pas à l’impact, assez souple pour garder l’avant-bras détendu entre les coups. Beaucoup de coachs parlent de pression moyenne pendant l’échange et d’un serrage seulement au contact. Une prise trop forte fatigue vite et réduit le toucher. Si le bras est douloureux après jouer, une raquette plus souple et légère peut aider ; voir ${l.elbow} et ${l.light}, et consultez un médecin en cas de douleur : ce n’est pas un avis médical.</p>`},
  {id:"handle",h:"Taille du manche et overgrip",html:`<p>Un manche trop fin fait trop serrer ; trop épais limite le poignet. Les manches de padel sont assez standards, et beaucoup ajoutent un overgrip sur le grip d’origine pour l’épaisseur et la sueur, en le changeant souvent. Cela modifie un peu poids et équilibre ; notre ${l.tool} montre l’effet d’un petit ajout de poids au manche.</p>`},
  {id:"mistakes",h:"Erreurs fréquentes",html:`<ul><li><b>Trop serrer</b> pendant tout l’échange.</li><li><b>Tenir comme une poêle</b> ou comme un coup droit de tennis.</li><li><b>Changer de prise</b> entre coup droit et revers sans en avoir le temps.</li><li><b>Trop haut sur le manche</b>, ce qui alourdit la tête.</li><li><b>Sans cordon.</b> Il est obligatoire ; voir ${l.rules}.</li></ul><p>Quand la prise est naturelle, choisissez une raquette avec le ${l.finder} ou partez du ${l.guide}.</p>`},
 ],
 faq:[
  ["Quelle prise utilise-t-on au padel ?","La plupart utilisent la continentale pour presque tous les coups, avec de petites rotations eastern selon les frappes. On ne change en général pas entre coup droit et revers."],
  ["Qu’est-ce que la prise continentale au padel ?","La prise « poignée de main », avec le « V » pouce–index sur l’arête du haut. Elle sert aux volées, smashes, bandejas et au service par-dessous."],
  ["Tient-on une raquette de padel comme au tennis ?","Pas tout à fait. Au tennis le coup droit est souvent plus fermé. Au padel, swing plus court et plus de volées : la continentale neutre est le point de départ."],
  ["Qu’est-ce que l’eastern revers au padel ?","Une petite rotation depuis la continentale vers le revers, paume plus au-dessus. Beaucoup restent proches de la continentale."],
  ["Faut-il porter le cordon ?","Oui. Le règlement exige le cordon fixé au manche et porté au poignet, non élastique."],
  ["À quel point serrer la raquette ?","Pression moyenne pendant l’échange, plus ferme seulement au contact."],
  ["Faut-il un overgrip ?","Ce n’est pas obligatoire, mais beaucoup en mettent un pour l’adhérence et la sueur et le changent quand il s’use."],
 ],
 next:["rules", "vs"]
 }; })(),
  pt:(()=>{ const l=L('pt'); return {
 crumb:"Como segurar a raquete",
 title:"Como segurar a raquete de pádel: grips, mão e erros",
 desc:"Aprende a segurar a raquete de pádel: grip continental, eastern, pressão e erros dos principiantes.",
 eyebrow:"Técnica",
 h1:"Como segurar a raquete de pádel",
 lead:"A maioria dos jogadores segura a raquete com um grip continental relaxado, como cumprimentar o cabo, e faz pequenos ajustes. Este guia mostra o grip, as variantes e os erros a evitar.",
 tldr:["<b>Começa pelo grip continental:</b> segura o cabo como se cumprimentasses, com o «V» entre polegar e indicador no canto de cima.","<b>Mantém-no solto:</b> aperta só no impacto. Um grip demasiado firme cansa o braço e mata o feeling.","<b>Usa a fita de pulso</b> em cada pancada: é obrigatória."],
 toc:{basic:"O grip básico",continental:"Grip continental passo a passo",eastern:"Grips eastern de direita e de esquerda",pressure:"Com que força segurar",handle:"Tamanho do cabo e overgrip",mistakes:"Erros comuns",faq:"Perguntas frequentes"},
 sections:[
  {id:"basic",h:"O grip básico",html:`<p>O pádel joga-se com um swing curto e rápido, e a maioria segura a raquete da mesma forma em quase todas as pancadas. Apoia a raquete na palma aberta com a face vertical e fecha os dedos em volta do cabo. O cabo tem oito faces, o que ajuda a repetir a posição sem olhar. Quem começa segura muitas vezes como uma frigideira; o objetivo é um agarre mais neutro, tipo martelo, que sirva para direita e esquerda sem mudar de grip.</p>`},
  {id:"continental",h:"Grip continental passo a passo",html:`<ol><li>Segura a raquete pela cabeça com a mão não dominante, face vertical.</li><li>Coloca a mão de jogo no cabo como se cumprimentasses.</li><li>Confirma que o «V» entre polegar e indicador fica no canto de cima.</li><li>Afasta um pouco os dedos, com um pequeno espaço entre indicador e médio, polegar atrás.</li><li>Apoia o calcanhar da mão perto da tampa para a raquete não escapar.</li></ol><p>É o grip de voleios, bandejas, víboras, smashs e serviço por baixo, e permite direita e esquerda sem mudar. Muitos treinadores chamam-lhe grip de «martelo».</p>`},
  {id:"eastern",h:"Grips eastern de direita e de esquerda",html:`<p>Por vezes roda-se um pouco a mão a partir do continental conforme a pancada:</p><ul><li><b>Eastern de direita:</b> roda ligeiramente para o lado da direita, palma mais atrás do cabo.</li><li><b>Eastern de esquerda:</b> roda para o outro lado, palma mais em cima do cabo.</li></ul><p>Se vens do ténis, este é o hábito a desaprender. No ténis a direita costuma ser mais fechada. No pádel a bola é mais lenta, o swing mais curto e há muitos voleios: raramente há tempo para mudar de grip. Na dúvida, fica perto do continental.</p>`},
  {id:"pressure",h:"Com que força segurar",html:`<p>Firme o suficiente para a raquete não rodar no impacto, solta o suficiente para o antebraço ficar relaxado entre pancadas. Muitos coaches falam de pressão média no rally e um aperto só no contacto. Um grip muito forte cansa o antebraço e reduz o toque. Se o braço dói depois de jogar, uma raquete mais macia e leve pode ajudar; vê ${l.elbow} e ${l.light}, e consulta um médico se houver dor: isto não é aconselhamento médico.</p>`},
  {id:"handle",h:"Tamanho do cabo e overgrip",html:`<p>Um cabo demasiado fino faz apertar mais; demasiado grosso limita o pulso. Os cabos de pádel são bastante standard, e muita gente acrescenta um overgrip sobre o grip original para espessura e suor, trocando-o com frequência. Também muda um pouco o peso e o balanço; a nossa ${l.tool} mostra o efeito de um pequeno peso no cabo.</p>`},
  {id:"mistakes",h:"Erros comuns",html:`<ul><li><b>Apertar demasiado</b> durante todo o rally.</li><li><b>Segurar como uma frigideira</b> ou como uma direita de ténis.</li><li><b>Mudar de grip</b> entre direita e esquerda sem tempo.</li><li><b>Agarrar demasiado alto</b> no cabo.</li><li><b>Sem fita de pulso.</b> É obrigatória; vê ${l.rules}.</li></ul><p>Quando o grip for natural, escolhe raquete com o ${l.finder} ou começa pelo ${l.guide}.</p>`},
 ],
 faq:[
  ["Que grip se usa no pádel?","A maioria usa o continental em quase todas as pancadas, com pequenas rotações eastern em alguns golpes. Não se muda habitualmente entre direita e esquerda."],
  ["O que é o grip continental no pádel?","É o de «cumprimentar», com o «V» polegar–indicador no canto de cima. Serve para voleios, smashs, bandejas e serviço por baixo."],
  ["Segura-se a raquete de pádel como a de ténis?","Não exatamente. No ténis a direita costuma ser mais fechada. No pádel o swing é mais curto e há mais voleios: o continental neutro é o ponto de partida."],
  ["O que é o eastern de esquerda no pádel?","Uma pequena rotação desde o continental para o lado da esquerda, palma mais em cima. Muitos ficam perto do continental."],
  ["Devo usar a fita de pulso?","Sim. O regulamento exige que a fita esteja fixa ao cabo e no pulso, e que não seja elástica."],
  ["Com que força devo segurar?","Pressão média no rally e mais firme só no contacto."],
  ["Preciso de overgrip?","Não é obrigatório, mas muita gente põe um por aderência e suor e troca-o quando gasta."],
 ],
 next:["rules", "vs"]
 }; })(),
  it:(()=>{ const l=L('it'); return {
 crumb:"Come impugnare la racchetta",
 title:"Come impugnare la racchetta da padel: grip, mano ed errori",
 desc:"Impara a impugnare la racchetta da padel: grip continentale, eastern, pressione ed errori tipici.",
 eyebrow:"Tecnica",
 h1:"Come impugnare la racchetta da padel",
 lead:"La maggior parte dei giocatori tiene la racchetta con un grip continentale rilassato, come una stretta di mano sul manico, e fa piccoli aggiustamenti. Questa guida mostra il grip, le varianti e gli errori da evitare.",
 tldr:["<b>Parti dal grip continentale:</b> tieni il manico come una stretta di mano, con la «V» tra pollice e indice sul bordo alto.","<b>Tienilo sciolto:</b> stringi solo all’impatto. Un grip troppo stretto stanca il braccio e uccide il feeling.","<b>Usa il cordino da polso</b> a ogni colpo: è obbligatorio."],
 toc:{basic:"Il grip di base",continental:"Grip continentale passo dopo passo",eastern:"Grip eastern di dritto e di rovescio",pressure:"Quanto stringere",handle:"Misura del manico e overgrip",mistakes:"Errori comuni",faq:"Domande frequenti"},
 sections:[
  {id:"basic",h:"Il grip di base",html:`<p>Il padel si gioca con uno swing corto e rapido, e la maggior parte tiene la racchetta allo stesso modo quasi a ogni colpo. Appoggia la racchetta sul palmo aperto con la faccia verticale e chiudi le dita intorno al manico. Il manico ha otto facce, così ritrovi la stessa posizione senza guardare. I principianti spesso la tengono come una padella; l’obiettivo è una presa più neutra, tipo martello, che valga per dritto e rovescio senza cambiare grip.</p>`},
  {id:"continental",h:"Grip continentale passo dopo passo",html:`<ol><li>Tieni la racchetta per la testa con la mano non dominante, faccia verticale.</li><li>Metti la mano di gioco sul manico come per una stretta di mano.</li><li>Controlla che la «V» tra pollice e indice sia sul bordo alto.</li><li>Allarga un po’ le dita, con un piccolo spazio tra indice e medio, pollice dietro.</li><li>Appoggia il tallone della mano vicino al tappo perché non scivoli.</li></ol><p>È il grip di volée, bandeja, víbora, smash e servizio dal basso, e permette dritto e rovescio senza cambiare. Spesso lo chiamano grip a «martello».</p>`},
  {id:"eastern",h:"Grip eastern di dritto e di rovescio",html:`<p>A volte si ruota un po’ la mano dal continentale a seconda del colpo:</p><ul><li><b>Eastern di dritto:</b> ruota leggermente verso il dritto, palmo più dietro il manico.</li><li><b>Eastern di rovescio:</b> ruota dall’altra parte, palmo più sopra il manico.</li></ul><p>Se vieni dal tennis, questa è l’abitudine da disimparare. Nel tennis il dritto è spesso più chiuso. Nel padel la palla è più lenta, lo swing più corto e ci sono molte volée: di rado c’è tempo per cambiare grip. Nel dubbio resta vicino al continentale.</p>`},
  {id:"pressure",h:"Quanto stringere",html:`<p>Abbastanza fermo perché la racchetta non giri all’impatto, abbastanza sciolto perché l’avambraccio resti rilassato tra i colpi. Molti coach parlano di pressione media nello scambio e di una stretta solo al contatto. Un grip troppo forte stanca in fretta e riduce il feeling. Se il braccio duole dopo aver giocato, una racchetta più morbida e leggera può aiutare; vedi ${l.elbow} e ${l.light}, e consulta un medico in caso di dolore: non è un consiglio medico.</p>`},
  {id:"handle",h:"Misura del manico e overgrip",html:`<p>Un manico troppo sottile fa stringere di più; troppo grosso limita il polso. I manici da padel sono piuttosto standard, e molti aggiungono un overgrip sul grip originale per spessore e sudore, cambiandolo spesso. Cambia anche un po’ peso e bilanciamento; il nostro ${l.tool} mostra l’effetto di un piccolo peso sul manico.</p>`},
  {id:"mistakes",h:"Errori comuni",html:`<ul><li><b>Stringere troppo</b> per tutto lo scambio.</li><li><b>Tenere come una padella</b> o come un dritto da tennis.</li><li><b>Cambiare grip</b> tra dritto e rovescio senza tempo.</li><li><b>Impugnare troppo in alto</b> sul manico.</li><li><b>Senza cordino.</b> È obbligatorio; vedi ${l.rules}.</li></ul><p>Quando il grip è naturale, scegli la racchetta con il ${l.finder} o parti dalla ${l.guide}.</p>`},
 ],
 faq:[
  ["Che grip si usa nel padel?","La maggior parte usa il continentale quasi a ogni colpo, con piccole rotazioni eastern su alcuni. Di solito non si cambia tra dritto e rovescio."],
  ["Cos’è il grip continentale nel padel?","È la «stretta di mano», con la «V» pollice–indice sul bordo alto. Serve per volée, smash, bandeja e servizio dal basso."],
  ["Si impugna come una racchetta da tennis?","Non proprio. Nel tennis il dritto è spesso più chiuso. Nel padel lo swing è più corto e ci sono più volée: il continentale neutro è il punto di partenza."],
  ["Cos’è l’eastern di rovescio nel padel?","Una piccola rotazione dal continentale verso il rovescio, palmo più sopra. Molti restano vicini al continentale."],
  ["Devo usare il cordino?","Sì. Il regolamento richiede il cordino fissato al manico e al polso, non elastico."],
  ["Quanto forte devo stringere?","Pressione media nello scambio e più ferma solo al contatto."],
  ["Serve un overgrip?","Non è obbligatorio, ma molti ne mettono uno per aderenza e sudore e lo cambiano quando si consuma."],
 ],
 next:["rules", "vs"]
 }; })(),
  de:(()=>{ const l=L('de'); return {
 crumb:"Padelschläger halten",
 title:"Padelschläger halten: Griffe, Handposition und Fehler",
 desc:"Lerne, einen Padelschläger zu halten: Kontinentalgriff, Eastern, Druck und typische Fehler.",
 eyebrow:"Technik",
 h1:"Padelschläger halten",
 lead:"Die meisten Spieler halten den Schläger mit einem lockeren Kontinentalgriff, wie ein Händeschütteln am Griff, und justieren nur leicht. Dieser Guide zeigt Griff, Varianten und Fehler.",
 tldr:["<b>Starte mit dem Kontinentalgriff:</b> halte den Griff wie zum Händeschütteln, mit dem „V“ zwischen Daumen und Zeigefinger auf der oberen Kante.","<b>Lass ihn locker:</b> drücke erst beim Treffpunkt fest. Zu fest ermüdet den Arm und tötet das Gefühl.","<b>Trag die Handgelenkschlaufe</b> bei jedem Schlag: sie ist Pflicht."],
 toc:{basic:"Der Basisgriff",continental:"Kontinentalgriff Schritt für Schritt",eastern:"Eastern-Vorhand und -Rückhand",pressure:"Wie fest halten",handle:"Griffstärke und Overgrip",mistakes:"Häufige Fehler",faq:"FAQ"},
 sections:[
  {id:"basic",h:"Der Basisgriff",html:`<p>Padel wird mit einem kurzen, schnellen Schwung gespielt, und die meisten halten den Schläger bei fast jedem Schlag gleich. Leg den Schläger auf die offene Handfläche mit senkrechter Fläche und schließ die Finger um den Griff. Der Griff hat acht Flächen, damit du die Position ohne Hinsehen wiederfindest. Einsteiger halten oft wie eine Bratpfanne; Ziel ist ein neutralerer, hammerartiger Halt für Vor- und Rückhand ohne Griffwechsel.</p>`},
  {id:"continental",h:"Kontinentalgriff Schritt für Schritt",html:`<ol><li>Halt den Schläger am Kopf mit der Nicht-Schlaghand, Fläche senkrecht.</li><li>Setz die Schlaghand wie zum Händeschütteln auf den Griff.</li><li>Prüfe, dass das „V“ zwischen Daumen und Zeigefinger auf der oberen Kante sitzt.</li><li>Spreiz die Finger leicht, mit kleinem Abstand zwischen Zeige- und Mittelfinger, Daumen hinten.</li><li>Setz die Handballen nahe der Kappe auf, damit nichts wegrutscht.</li></ol><p>Das ist der Griff für Volleys, Bandejas, Viboras, Smashes und den Unterhand-Aufschlag und erlaubt Vor- und Rückhand ohne Wechsel. Trainer nennen ihn oft „Hammergriff“.</p>`},
  {id:"eastern",h:"Eastern-Vorhand und -Rückhand",html:`<p>Manchmal dreht man die Hand vom Kontinentalgriff leicht je nach Schlag:</p><ul><li><b>Eastern-Vorhand:</b> leicht zur Vorhandseite, Handfläche mehr hinter dem Griff.</li><li><b>Eastern-Rückhand:</b> zur anderen Seite, Handfläche mehr oben auf dem Griff.</li></ul><p>Kommst du vom Tennis, ist das die Gewohnheit zum Verlernen. Im Tennis ist die Vorhand oft geschlossener. Im Padel ist der Ball langsamer, der Schwung kürzer und es gibt viele Volleys: selten Zeit zum Wechseln. Im Zweifel nah am Kontinental bleiben.</p>`},
  {id:"pressure",h:"Wie fest halten",html:`<p>Fest genug, dass der Schläger beim Treffer nicht verdreht, locker genug, dass der Unterarm zwischen den Schlägen entspannt bleibt. Viele Coaches sprechen von mittlerem Druck im Ballwechsel und festem Druck nur beim Kontakt. Zu fest ermüdet schnell und mindert Gefühl. Tut der Arm nach dem Spielen weh, kann ein weicherer, leichterer Schläger helfen; siehe ${l.elbow} und ${l.light}, und bei Schmerz zum Arzt — das ist kein medizinischer Rat.</p>`},
  {id:"handle",h:"Griffstärke und Overgrip",html:`<p>Ein zu dünner Griff lässt dich fester drücken; ein zu dicker begrenzt das Handgelenk. Padelschläger-Griffe sind recht standard, und viele legen ein Overgrip über den Originalgriff für Dicke und Schweiß und wechseln es oft. Das ändert Gewicht und Balance leicht; unser ${l.tool} zeigt den Effekt von etwas Gewicht am Griff.</p>`},
  {id:"mistakes",h:"Häufige Fehler",html:`<ul><li><b>Zu fest</b> den ganzen Ballwechsel.</li><li><b>Wie eine Bratpfanne</b> oder wie eine Tennis-Vorhand halten.</li><li><b>Griff wechseln</b> zwischen Vor- und Rückhand ohne Zeit.</li><li><b>Zu hoch</b> am Griff greifen.</li><li><b>Ohne Schlaufe.</b> Sie ist Pflicht; siehe ${l.rules}.</li></ul><p>Wenn der Griff natürlich sitzt, wähl einen Schläger mit dem ${l.finder} oder starte bei der ${l.guide}.</p>`},
 ],
 faq:[
  ["Welcher Griff wird im Padel genutzt?","Die meisten nutzen den Kontinentalgriff bei fast jedem Schlag, mit kleinen Eastern-Drehungen bei manchen. Zwischen Vor- und Rückhand wechselt man normalerweise nicht."],
  ["Was ist der Kontinentalgriff im Padel?","Der „Händeschüttel-Griff“ mit dem „V“ Daumen–Zeigefinger auf der oberen Kante. Er eignet sich für Volleys, Smashes, Bandejas und den Unterhand-Aufschlag."],
  ["Hält man einen Padelschläger wie einen Tennisschläger?","Nicht ganz. Im Tennis ist die Vorhand oft geschlossener. Im Padel ist der Schwung kürzer und es gibt mehr Volleys: der neutrale Kontinentalgriff ist der Start."],
  ["Was ist der Eastern-Rückhandgriff im Padel?","Eine kleine Drehung vom Kontinental zur Rückhandseite, Handfläche mehr oben. Viele bleiben nah am Kontinental."],
  ["Muss ich die Handgelenkschlaufe tragen?","Ja. Die Regeln verlangen die Schlaufe am Griff und am Handgelenk, nicht elastisch."],
  ["Wie fest soll ich halten?","Mittlerer Druck im Ballwechsel, fester nur beim Kontakt."],
  ["Brauche ich ein Overgrip?","Nicht zwingend, aber viele legen eines für Grip und Schweiß auf und wechseln es bei Verschleiß."],
 ],
 next:["rules", "vs"]
 }; })(),
},
rules:{
  en:(()=>{ const l=L('en'); return {
 crumb:"Padel rules",
 title:"Padel rules: how to play, serve and score",
 desc:"Padel rules and how to play padel, explained: the court, the underarm serve and serve rules, walls and the fence, scoring (points, games, sets, golden point, star point, tie-break) and beginner tactics.",
 eyebrow:"Rules guide",
 h1:"Padel rules: how to play, serve and score",
 lead:"Padel is played in pairs on an enclosed court. You serve underarm, the ball must bounce on the floor before it touches a wall, and scoring follows tennis. This guide covers how to play padel from the first serve, the serve rules in detail, how scoring works and a few simple tactics, based on the international rulebook.",
 tldr:["<b>Doubles on a 20 m × 10 m walled court</b>, with the net 0.88 m high in the centre.","<b>Underarm serve</b> after one bounce, struck at or below waist height, diagonally into the opposite box; you get two serves.","<b>After the ball has bounced on the floor, it can hit the glass or the fence and still be returned.</b> A ball that hits a wall or fence before it bounces is out.","<b>Scoring is tennis-style</b> (15, 30, 40, game, best of three sets); deuce is settled with advantage, golden point or star point depending on the event.","<b>Beginner tactics:</b> keep the ball in play, use the back wall, lob to push the opponents back, and move forward and back as a pair."],
 toc:{court:"The court and the net",howto:"How to play padel, step by step",serve:"Serve rules in detail",play:"Playing the point",walls:"Walls and the fence",rallies:"How a rally works",tactics:"Basic tactics for beginners",scoring:"Padel scoring",ends:"Changing ends and breaks",equipment:"Equipment rules",faq:"FAQ"},
 sections:[
  {id:"court",h:"The court and the net",html:`<p>A padel court is a rectangle 10 m wide and 20 m long, split in half by a net that is 0.88 m high at the centre and 0.92 m at the ends. A service line sits 6.95 m from the net on each side, and a central line splits the area between the net and the service line into two service boxes. The court is enclosed by walls at the back and a mix of wall and metal fence at the sides, with the walls part of the game. Padel is played in pairs: two players per side.</p><p class="muted small">New to the sport? Read ${l.vs} first if you are not sure how padel differs from other racket sports.</p>`},
  {id:"howto",h:"How to play padel, step by step",html:`<p>If you have never played, this is the short version of how a match runs:</p><ol><li><b>Form two pairs</b> and decide who serves first. The serving pair picks who serves; the receiving pair picks who receives on which side.</li><li><b>Serve underarm.</b> The server bounces the ball, hits it at or below waist height and sends it diagonally into the opposite service box.</li><li><b>Let the serve bounce.</b> The receiver lets the serve bounce in the box, then returns it. The serve cannot be volleyed.</li><li><b>Rally.</b> From the return on, both pairs hit the ball alternately, on the volley or after one bounce, and the ball may use the walls once it has bounced on the floor.</li><li><b>Win the point</b> when the opponents fail to return the ball legally.</li><li><b>Count the score</b> in points, games and sets, and change ends at the right moments.</li></ol><p>If you are still choosing a racket, our ${l.beg} page and the ${l.finder} are good places to start.</p>`},
  {id:"serve",h:"Serve rules in detail",html:`<p>Every point starts with a serve, and you get two attempts. Stand with at least one foot behind the service line, between the centre line and the side wall. Bounce the ball inside your own service box, then hit it at or below waist height with at least one foot on the ground, diagonally into the opposite box. Serve from the right first, then alternate sides after each point.</p><p>It is a fault if the ball lands outside the receiver’s box, hits you or your partner, or lands in the box and then touches the metal fence before bouncing a second time. Two faults lose the point. A serve that clips the net and lands in the correct box is replayed (net), unless it then touches the fence. One player serves a whole game; the other pair serves the next, and partners take turns to serve in the same order for the set. In a tie-break, one player serves the first point, then each serves two points in turn.</p>`},
  {id:"play",h:"Playing the point",html:`<p>After the serve, the pairs hit alternately. You can volley or let the ball bounce once. You lose the point if the ball bounces twice on your side, if you hit it twice, if you touch the net, posts or the opponents’ court, or if the ball hits you after the opponents have hit it. Only one player in a pair may hit on each shot. You also lose the point if you drop the racket or break the strap. See ${l.hold} to keep the racket under control.</p>`},
  {id:"walls",h:"Walls and the fence: what is allowed?",html:`<p>The ball must bounce on the floor of the opponents’ side first. After that bounce it can hit the glass or the metal fence, and your opponents must return it before a second bounce. You can use your own walls after a bounce on your side. A shot can touch your own wall before it crosses the net, but it must then bounce on the opponents’ floor. A ball that hits the opponents’ wall or fence without bouncing on their floor is out. A ball that hits the metal fence on your own side after your shot loses you the point. So yes, the ball can hit the fence — but only after it has bounced on the floor.</p>`},
  {id:"rallies",h:"How a rally works",html:`<p>A rally starts once the serve is returned. Typical beginner rally: return of serve deep or down the middle; then volley or bounce; wall play when a ball rebounds off the back or side wall after one floor bounce; the point ends on a double bounce, a ball out, into the net, into your own fence, or another fault. Wall play takes the longest to learn — missing rebounds early on is normal.</p>`},
  {id:"tactics",h:"Basic tactics for beginners",html:`<p>Keep the ball in play. Move as a pair. Take the net when you can. Lob when you are in trouble. Use the back wall rather than rushing. Hit to the middle between opponents. Talk to your partner (“mine” / “yours”). Good gear helps too — see ${l.shoes} and ${l.light}.</p>`},
  {id:"scoring",h:"Padel scoring: points, games, sets and tie-breaks",html:`<p>Points go 15, 30, 40, then game (server’s score first). Six games win a set with a two-game lead; matches are usually best of three. At deuce the organiser picks advantage (two points in a row), golden point (one deciding point; receivers choose side) or star point (advantage twice, then a deciding point). At 6-6 a tie-break to seven with a two-point margin; change ends every six points; winner takes the set 7-6.</p>`},
  {id:"ends",h:"Changing ends and breaks",html:`<p>Pairs change ends after the first game of a set and after every odd game after that. In a tie-break you change after every six points. Official matches allow up to 20 seconds between points, 90 when changing ends and 120 between sets. Play is continuous; no coaching during a match.</p>`},
  {id:"equipment",h:"Equipment rules",html:`<p>The padel racket has no strings and a perforated flat hitting surface. Max 45.5 cm long, 26 cm wide and 38 mm thick, with a non-elastic wrist strap no more than 35 cm long which you must wear. The ball is rubber between 6.35 and 6.77 cm across. Choosing gear? Read our ${l.guide}, compare ${l.rackets}, and check ${l.balls} and ${l.shoes}.</p>`},
 ],
 faq:[
  ["How do you play padel?","Two pairs on an enclosed court. Serve underarm into the diagonal box, let it bounce, then rally. The ball can hit the walls after bouncing on the floor. Scoring follows tennis."],
  ["Can the ball hit the fence in padel?","Yes, but only after it has bounced on the opponents’ floor. Hitting wall or fence before that bounce is out."],
  ["What are the serve rules in padel?","Bounce inside your box, hit underarm at or below waist height with a foot on the ground, diagonally into the opposite box. Two serves; two faults lose the point."],
  ["Can you serve overarm in padel?","No. The serve is after a bounce at or below waist height, so it is underarm."],
  ["How do you score in padel?","Like tennis: 15, 30, 40, game; six games to a set; best of three. Deuce uses advantage, golden point or star point; 6-6 goes to a tie-break."],
  ["What is a golden point in padel?","At deuce, one deciding point wins the game. The receiving pair chooses which side to receive on."],
  ["Is padel always played as doubles?","Yes. Official padel is two against two."],
  ["Do you have to wear the wrist strap?","Yes. It must be worn, non-elastic, and no longer than 35 cm."],
  ["Can you hit the ball before it bounces?","Yes after a valid serve and return — you can volley. The serve itself must bounce, and the ball must bounce on the floor before it touches a wall."],
  ["What size is a padel court?","20 m long and 10 m wide, net 0.88 m high at the centre."],
 ],
 next:["hold", "vs"]
 }; })(),
  es:(()=>{ const l=L('es'); return {
 crumb:"Reglas del pádel",
 title:"Reglas del pádel: cómo se juega, el saque y la puntuación",
 desc:"Reglas del pádel explicadas: la pista, el saque de abajo, paredes y reja, puntuación y táctica básica.",
 eyebrow:"Reglamento",
 h1:"Reglas del pádel: cómo se juega, el saque y la puntuación",
 lead:"El pádel se juega en parejas en una pista cerrada. Se saca de abajo, la pelota debe botar en el suelo antes de tocar una pared, y se puntúa como en tenis.",
 tldr:["<b>Dobles en pista de 20 m × 10 m</b>, red a 0,88 m en el centro.","<b>Saque de abajo</b> tras un bote, a la altura de la cintura o por debajo, en diagonal; dos saques.","<b>Tras botar en el suelo, puede pegar en cristal o reja y aún devolverse.</b> Si pega en pared o reja antes de botar, está fuera.","<b>Puntuación estilo tenis</b>; el deuce se resuelve con ventaja, punto de oro o punto estrella.","<b>Táctica básica:</b> mantén la pelota en juego, usa la pared de fondo, globo para echar atrás y muévete en pareja."],
 toc:{court:"La pista y la red",howto:"Cómo se juega al pádel, paso a paso",serve:"Reglas del saque al detalle",play:"Cómo se juega el punto",walls:"Paredes y reja",rallies:"Cómo funciona un peloteo",tactics:"Táctica básica para principiantes",scoring:"Puntuación en pádel",ends:"Cambio de lado y descansos",equipment:"Reglas del material",faq:"Preguntas frecuentes"},
 sections:[
  {id:"court",h:"La pista y la red",html:`<p>La pista mide 10 m de ancho y 20 m de largo, con red de 0,88 m en el centro y 0,92 m en los extremos. La línea de saque está a 6,95 m de la red. Está cerrada con paredes al fondo y mezcla de pared y reja a los lados. Se juega en parejas.</p><p class="muted small">¿Nuevo en el deporte? Lee ${l.vs} si no tienes claro en qué se diferencia de otros deportes de pala.</p>`},
  {id:"howto",h:"Cómo se juega al pádel, paso a paso",html:`<p>Dos parejas; se decide quién saca. Saque de abajo en diagonal al cuadro contrario; el restador deja botar y devuelve (no se puede volear el saque). Luego peloteo con volea o tras un bote, usando paredes tras el bote en el suelo. Ganas el punto cuando el rival no devuelve de forma legal. Si aún eliges pala, mira ${l.beg} y el ${l.finder}.</p>`},
  {id:"serve",h:"Reglas del saque al detalle",html:`<p>Dos intentos de saque. Al menos un pie detrás de la línea de saque. Bota la pelota en tu cuadro, golpea a la altura de la cintura o por debajo con un pie en el suelo, en diagonal. Empiezas desde la derecha y alternas. Fuera del cuadro, tocar a un compañero o pegar en la reja metálica tras botar en el cuadro (antes del segundo bote) es falta. Dos faltas pierden el punto. Saque a la red que cae bien se repite. Un jugador saca todo el juego; la otra pareja el siguiente.</p>`},
  {id:"play",h:"Cómo se juega el punto",html:`<p>Tras el saque, las parejas golpean por turnos. Puedes volear o dejar botar una vez. Pierdes si bota dos veces en tu campo, si golpeas dos veces, si tocas la red o el campo rival, o si la pelota te pega tras el golpe rival. Solo un jugador de la pareja puede golpear en cada golpe. Ver ${l.hold}.</p>`},
  {id:"walls",h:"Paredes y reja",html:`<p>La pelota debe botar primero en el suelo del rival. Después puede pegar en cristal o reja y aún debe devolverse antes del segundo bote. Puedes usar tus paredes tras un bote en tu lado. Un golpe que va a la pared o reja rival sin botar en su suelo está fuera. Pegar en tu propia reja metálica tras tu golpe te hace perder el punto.</p>`},
  {id:"rallies",h:"Cómo funciona un peloteo",html:`<p>El peloteo empieza al devolver el saque. Resto profundo o al centro; volea o bote; juego de pared tras un bote; el punto acaba en doble bote, fuera, a la red, a tu reja u otra falta. El juego de pared es lo que más cuesta al principio.</p>`},
  {id:"tactics",h:"Táctica básica para principiantes",html:`<p>Mantén la pelota en juego. Muévete en pareja. Sube a la red cuando puedas. Globo si estás apurado. Usa la pared de fondo. Dirige al centro entre rivales. Habla con tu pareja. Material: ${l.shoes} y ${l.light}.</p>`},
  {id:"scoring",h:"Puntuación en pádel",html:`<p>Puntos 15, 30, 40 y juego. Seis juegos ganan el set con ventaja de dos; partidos al mejor de tres. En deuce: ventaja, punto de oro (un punto decisivo; eligen lado los restadores) o punto estrella. A 6-6, tie-break a siete con margen de dos.</p>`},
  {id:"ends",h:"Cambio de lado y descansos",html:`<p>Se cambia de lado tras el primer juego del set y tras cada juego impar. En tie-break, cada seis puntos. Hasta 20 s entre puntos, 90 al cambiar y 120 entre sets en partidos oficiales.</p>`},
  {id:"equipment",h:"Reglas del material",html:`<p>Pala sin cuerdas, superficie plana perforada; máx. 45,5 cm de largo, 26 cm de ancho y 38 mm de grosor; cordón no elástico ≤ 35 cm, obligatorio. Pelota de goma 6,35–6,77 cm. Ver ${l.guide}, ${l.rackets}, ${l.balls} y ${l.shoes}.</p>`},
 ],
 faq:[
  ["¿Cómo se juega al pádel?","Dos parejas en pista cerrada. Saque de abajo en diagonal, dejar botar, pelotear. Tras botar en el suelo puede usar paredes. Puntuación como en tenis."],
  ["¿Puede pegar la pelota en la reja?","Sí, pero solo tras botar en el suelo del rival. Antes de ese bote, fuera."],
  ["¿Cuáles son las reglas del saque?","Bota en tu cuadro, golpea de abajo a la cintura o por debajo, en diagonal. Dos saques; dos faltas pierden el punto."],
  ["¿Se puede sacar de arriba?","No. El saque es tras un bote a la altura de la cintura o por debajo."],
  ["¿Cómo se puntúa?","Como en tenis: 15, 30, 40, juego; seis juegos al set; mejor de tres. Deuce con ventaja, punto de oro o estrella; 6-6 a tie-break."],
  ["¿Qué es el punto de oro?","En deuce, un punto decisivo. Los restadores eligen el lado."],
  ["¿El pádel es siempre en dobles?","Sí. El pádel oficial es dos contra dos."],
  ["¿Obligatorio el cordón?","Sí. Debe llevarse, no ser elástico y medir como máximo 35 cm."],
  ["¿Se puede volear?","Sí tras saque y resto válidos. El saque debe botar, y la pelota debe botar en el suelo antes de tocar una pared."],
  ["¿Qué tamaño tiene la pista?","20 m de largo y 10 m de ancho; red 0,88 m en el centro."],
 ],
 next:["hold", "vs"]
 }; })(),
  fr:(()=>{ const l=L('fr'); return {
 crumb:"Règles du padel",
 title:"Règles du padel : jouer, servir et marquer",
 desc:"Règles du padel expliquées : le court, le service par-dessous, murs et grillage, scoring et tactique débutant.",
 eyebrow:"Règlement",
 h1:"Règles du padel : jouer, servir et marquer",
 lead:"Le padel se joue à deux sur un court clos. On sert par-dessous, la balle doit rebondir au sol avant de toucher un mur, et le scoring suit le tennis.",
 tldr:["<b>Double sur court 20 m × 10 m</b>, filet à 0,88 m au centre.","<b>Service par-dessous</b> après un rebond, à hauteur de taille ou moins, en diagonal ; deux services.","<b>Après rebond au sol, la balle peut toucher verre ou grillage et être encore renvoyée.</b> Avant ce rebond, c’est faute.","<b>Scoring style tennis</b> ; le deuce se règle en avantage, golden point ou star point.","<b>Tactique débutant :</b> garder la balle, utiliser le mur du fond, lobber pour reculer l’adversaire, bouger en paire."],
 toc:{court:"Le court et le filet",howto:"Comment jouer au padel, étape par étape",serve:"Règles du service en détail",play:"Jouer le point",walls:"Murs et grillage",rallies:"Comment se déroule un échange",tactics:"Tactique de base pour débutants",scoring:"Le scoring au padel",ends:"Changement de côté et pauses",equipment:"Règles du matériel",faq:"FAQ"},
 sections:[
  {id:"court",h:"Le court et le filet",html:`<p>Le court fait 10 m de large et 20 m de long, filet 0,88 m au centre et 0,92 m aux extrémités. Ligne de service à 6,95 m. Clos avec murs au fond et mélange mur/grillage sur les côtés. On joue en double.</p><p class="muted small">Nouveau ? Lisez ${l.vs} si vous hésitez face aux autres sports de pala.</p>`},
  {id:"howto",h:"Comment jouer au padel, étape par étape",html:`<p>Deux paires ; on décide qui sert. Service par-dessous en diagonal ; le relanceur laisse rebondir (pas de volée sur le service). Puis échange à la volée ou après un rebond, murs autorisés après rebond au sol. Vous gagnez le point si l’adversaire ne renvoie pas légalement. Pour choisir une raquette : ${l.beg} et ${l.finder}.</p>`},
  {id:"serve",h:"Règles du service en détail",html:`<p>Deux essais. Au moins un pied derrière la ligne de service. Faites rebondir dans votre carré, frappez à hauteur de taille ou moins, en diagonal. Droite d’abord, puis on alterne. Faute si hors carré, si ça touche un partenaire, ou si ça touche le grillage métallique après rebond dans le carré avant le second rebond. Deux fautes perdent le point. Service filet correct rejoué. Un joueur sert tout le jeu.</p>`},
  {id:"play",h:"Jouer le point",html:`<p>Après le service, les paires frappent à tour de rôle. Volée ou un rebond. Vous perdez sur double rebond, double touche, contact filet/camp adverse, ou si la balle vous touche après le coup adverse. Un seul joueur de la paire frappe à chaque coup. Voir ${l.hold}.</p>`},
  {id:"walls",h:"Murs et grillage",html:`<p>La balle doit d’abord rebondir au sol côté adverse. Ensuite elle peut toucher verre ou grillage et doit être renvoyée avant le second rebond. Vous pouvez jouer vos propres murs après rebond de votre côté. Direct au mur/grillage adverse sans rebond au sol = faute. Toucher votre propre grillage après votre coup vous fait perdre le point.</p>`},
  {id:"rallies",h:"Comment se déroule un échange",html:`<p>L’échange commence au renvoi du service. Relance profonde ou au milieu ; volée ou rebond ; jeu de mur après un rebond ; le point finit sur double rebond, faute, filet, votre grillage ou autre faute. Le jeu de mur prend le plus de temps à apprendre.</p>`},
  {id:"tactics",h:"Tactique de base pour débutants",html:`<p>Gardez la balle en jeu. Bougez en paire. Prenez le filet quand vous pouvez. Lobez en difficulté. Utilisez le mur du fond. Visez le milieu entre adversaires. Parlez à votre partenaire. Matériel : ${l.shoes} et ${l.light}.</p>`},
  {id:"scoring",h:"Le scoring au padel",html:`<p>Points 15, 30, 40, jeu. Six jeux gagnent le set avec deux d’écart ; matchs au meilleur des trois. Au deuce : avantage, golden point (un point décisif ; les relanceurs choisissent le côté) ou star point. À 6-6, tie-break à sept avec deux d’écart.</p>`},
  {id:"ends",h:"Changement de côté et pauses",html:`<p>Changement de côté après le premier jeu du set puis chaque jeu impair. En tie-break, toutes les six points. Jusqu’à 20 s entre les points, 90 au changement, 120 entre les sets.</p>`},
  {id:"equipment",h:"Règles du matériel",html:`<p>Raquette sans cordage, surface plane perforée ; max 45,5 cm / 26 cm / 38 mm ; cordon non élastique ≤ 35 cm, obligatoire. Balle caoutchouc 6,35–6,77 cm. Voir ${l.guide}, ${l.rackets}, ${l.balls} et ${l.shoes}.</p>`},
 ],
 faq:[
  ["Comment joue-t-on au padel ?","Deux paires sur court clos. Service par-dessous en diagonal, laisser rebondir, échanger. Après rebond au sol, les murs comptent. Scoring tennis."],
  ["La balle peut-elle toucher le grillage ?","Oui, mais seulement après rebond au sol côté adverse. Avant, c’est faute."],
  ["Quelles sont les règles du service ?","Rebond dans votre carré, frappe par-dessous à hauteur de taille ou moins, en diagonal. Deux services ; deux fautes perdent le point."],
  ["Peut-on servir par-dessus ?","Non. Le service suit un rebond à hauteur de taille ou moins."],
  ["Comment marque-t-on ?","Comme au tennis : 15, 30, 40, jeu ; six jeux au set ; meilleur des trois. Deuce en avantage, golden ou star point ; 6-6 en tie-break."],
  ["Qu’est-ce que le golden point ?","Au deuce, un point décisif. Les relanceurs choisissent le côté."],
  ["Le padel se joue-t-il toujours en double ?","Oui. Le padel officiel est deux contre deux."],
  ["Le cordon est-il obligatoire ?","Oui. Porté, non élastique, max 35 cm."],
  ["Peut-on voler la balle ?","Oui après service et renvoi valides. Le service doit rebondir, et la balle doit rebondir au sol avant de toucher un mur."],
  ["Quelle taille fait le court ?","20 m de long, 10 m de large ; filet 0,88 m au centre."],
 ],
 next:["hold", "vs"]
 }; })(),
  pt:(()=>{ const l=L('pt'); return {
 crumb:"Regras do pádel",
 title:"Regras do pádel: como jogar, servir e pontuar",
 desc:"Regras do pádel explicadas: o court, o serviço por baixo, paredes e rede metálica, pontuação e tática para principiantes.",
 eyebrow:"Regulamento",
 h1:"Regras do pádel: como jogar, servir e pontuar",
 lead:"O pádel joga-se em pares num court fechado. Serve-se por baixo, a bola tem de bater no chão antes de tocar numa parede, e a pontuação segue o ténis.",
 tldr:["<b>Pares num court 20 m × 10 m</b>, rede a 0,88 m no centro.","<b>Serviço por baixo</b> após um ressalto, à altura da cintura ou abaixo, em diagonal; dois serviços.","<b>Após ressalto no chão, pode bater em vidro ou rede metálica e ainda ser devolvida.</b> Antes desse ressalto, está fora.","<b>Pontuação estilo ténis</b>; o deuce resolve-se com vantagem, golden point ou star point.","<b>Tática básica:</b> mantém a bola em jogo, usa a parede de fundo, globo para empurrar atrás e move-te em par."],
 toc:{court:"O court e a rede",howto:"Como jogar pádel, passo a passo",serve:"Regras do serviço em detalhe",play:"A jogar o ponto",walls:"Paredes e rede metálica",rallies:"Como funciona um rally",tactics:"Tática básica para principiantes",scoring:"Pontuação no pádel",ends:"Mudança de lado e pausas",equipment:"Regras do equipamento",faq:"Perguntas frequentes"},
 sections:[
  {id:"court",h:"O court e a rede",html:`<p>O court tem 10 m de largura e 20 m de comprimento, rede 0,88 m no centro e 0,92 m nas extremidades. Linha de serviço a 6,95 m. Fechado com paredes ao fundo e mistura de parede e rede metálica aos lados. Joga-se em pares.</p><p class="muted small">Novo no desporto? Lê ${l.vs} se não tiveres a certeza da diferença face a outros desportos de pala.</p>`},
  {id:"howto",h:"Como jogar pádel, passo a passo",html:`<p>Dois pares; decide-se quem serve. Serviço por baixo em diagonal; o recetor deixa ressaltir (não se voleia o serviço). Depois rally de voleio ou após um ressalto, paredes após ressalto no chão. Ganhas o ponto quando o rival não devolve legalmente. A escolher raquete: ${l.beg} e ${l.finder}.</p>`},
  {id:"serve",h:"Regras do serviço em detalhe",html:`<p>Dois tentativas. Pelo menos um pé atrás da linha de serviço. Faz ressaltir no teu quadro, bate à altura da cintura ou abaixo, em diagonal. Direita primeiro, depois alternas. Falta se cair fora do quadro, tocar num parceiro, ou tocar na rede metálica após ressalto no quadro antes do segundo ressalto. Duas faltas perdem o ponto. Serviço à rede que cai bem repete-se. Um jogador serve o jogo inteiro.</p>`},
  {id:"play",h:"A jogar o ponto",html:`<p>Após o serviço, os pares batem à vez. Podes volear ou deixar ressaltir uma vez. Perdes com duplo ressalto, duas pancadas, tocar na rede ou no campo rival, ou se a bola te bater após a pancada rival. Só um jogador do par pode bater em cada pancada. Vê ${l.hold}.</p>`},
  {id:"walls",h:"Paredes e rede metálica",html:`<p>A bola tem de ressaltir primeiro no chão do rival. Depois pode bater em vidro ou rede metálica e tem de ser devolvida antes do segundo ressalto. Podes usar as tuas paredes após ressalto do teu lado. Direto à parede/rede rival sem ressalto no chão = fora. Bater na tua própria rede metálica após a tua pancada faz-te perder o ponto.</p>`},
  {id:"rallies",h:"Como funciona um rally",html:`<p>O rally começa ao devolver o serviço. Resto profundo ou ao meio; voleio ou ressalto; jogo de parede após um ressalto; o ponto acaba em duplo ressalto, fora, rede, a tua rede metálica ou outra falta. O jogo de parede é o que mais demora a aprender.</p>`},
  {id:"tactics",h:"Tática básica para principiantes",html:`<p>Mantém a bola em jogo. Move-te em par. Sobe à rede quando puderes. Globo se estiveres em apuros. Usa a parede de fundo. Aponta ao meio entre rivais. Fala com o parceiro. Material: ${l.shoes} e ${l.light}.</p>`},
  {id:"scoring",h:"Pontuação no pádel",html:`<p>Pontos 15, 30, 40 e jogo. Seis jogos ganham o set com vantagem de dois; jogos ao melhor de três. No deuce: vantagem, golden point (um ponto decisivo; os recetores escolhem o lado) ou star point. A 6-6, tie-break a sete com margem de dois.</p>`},
  {id:"ends",h:"Mudança de lado e pausas",html:`<p>Muda-se de lado após o primeiro jogo do set e após cada jogo ímpar. No tie-break, a cada seis pontos. Até 20 s entre pontos, 90 na mudança e 120 entre sets.</p>`},
  {id:"equipment",h:"Regras do equipamento",html:`<p>Raquete sem cordas, superfície plana perfurada; máx. 45,5 cm / 26 cm / 38 mm; fita não elástica ≤ 35 cm, obrigatória. Bola de borracha 6,35–6,77 cm. Vê ${l.guide}, ${l.rackets}, ${l.balls} e ${l.shoes}.</p>`},
 ],
 faq:[
  ["Como se joga pádel?","Dois pares em court fechado. Serviço por baixo em diagonal, deixar ressaltir, trocar bolas. Após ressalto no chão as paredes contam. Pontuação de ténis."],
  ["A bola pode bater na rede metálica?","Sim, mas só após ressalto no chão do rival. Antes disso, está fora."],
  ["Quais são as regras do serviço?","Ressalto no teu quadro, pancada por baixo à cintura ou abaixo, em diagonal. Dois serviços; duas faltas perdem o ponto."],
  ["Pode-se servir por cima?","Não. O serviço é após ressalto à altura da cintura ou abaixo."],
  ["Como se pontua?","Como no ténis: 15, 30, 40, jogo; seis jogos ao set; melhor de três. Deuce com vantagem, golden ou star point; 6-6 a tie-break."],
  ["O que é o golden point?","No deuce, um ponto decisivo. Os recetores escolhem o lado."],
  ["O pádel é sempre em pares?","Sim. O pádel oficial é dois contra dois."],
  ["A fita de pulso é obrigatória?","Sim. Tem de se usar, não ser elástica e ter no máximo 35 cm."],
  ["Pode-se volear?","Sim após serviço e resto válidos. O serviço tem de ressaltir, e a bola tem de ressaltir no chão antes de tocar numa parede."],
  ["Que tamanho tem o court?","20 m de comprimento e 10 m de largura; rede 0,88 m no centro."],
 ],
 next:["hold", "vs"]
 }; })(),
  it:(()=>{ const l=L('it'); return {
 crumb:"Regole del padel",
 title:"Regole del padel: come si gioca, il servizio e il punteggio",
 desc:"Regole del padel spiegate: il campo, il servizio dal basso, muri e rete metallica, punteggio e tattica base.",
 eyebrow:"Regolamento",
 h1:"Regole del padel: come si gioca, il servizio e il punteggio",
 lead:"Il padel si gioca in coppia su un campo chiuso. Si serve dal basso, la palla deve rimbalzare a terra prima di toccare un muro, e il punteggio segue il tennis.",
 tldr:["<b>Doppio su campo 20 m × 10 m</b>, rete a 0,88 m al centro.","<b>Servizio dal basso</b> dopo un rimbalzo, a altezza vita o sotto, in diagonale; due servizi.","<b>Dopo il rimbalzo a terra può toccare vetro o rete metallica e essere ancora respinta.</b> Prima di quel rimbalzo è fuori.","<b>Punteggio stile tennis</b>; il deuce si risolve con vantaggio, golden point o star point.","<b>Tattica base:</b> tieni la palla in gioco, usa il muro di fondo, lob per mandare indietro e muoviti in coppia."],
 toc:{court:"Il campo e la rete",howto:"Come si gioca a padel, passo dopo passo",serve:"Regole del servizio nel dettaglio",play:"Giocare il punto",walls:"Muri e rete metallica",rallies:"Come funziona uno scambio",tactics:"Tattica base per principianti",scoring:"Il punteggio nel padel",ends:"Cambio di campo e pause",equipment:"Regole dell’attrezzatura",faq:"Domande frequenti"},
 sections:[
  {id:"court",h:"Il campo e la rete",html:`<p>Il campo misura 10 m di larghezza e 20 m di lunghezza, rete 0,88 m al centro e 0,92 m alle estremità. Linea di servizio a 6,95 m. Chiuso con muri sul fondo e mix di muro e rete metallica ai lati. Si gioca in coppia.</p><p class="muted small">Nuovo allo sport? Leggi ${l.vs} se non hai chiaro il confronto con altri sport di pala.</p>`},
  {id:"howto",h:"Come si gioca a padel, passo dopo passo",html:`<p>Due coppie; si decide chi serve. Servizio dal basso in diagonale; il ricevitore lascia rimbalzare (niente volée sul servizio). Poi scambio in volée o dopo un rimbalzo, muri dopo rimbalzo a terra. Vinci il punto se l’avversario non risponde legalmente. Per scegliere la racchetta: ${l.beg} e ${l.finder}.</p>`},
  {id:"serve",h:"Regole del servizio nel dettaglio",html:`<p>Due tentativi. Almeno un piede dietro la linea di servizio. Fai rimbalzare nel tuo riquadro, colpisci a altezza vita o sotto, in diagonale. Destra prima, poi si alterna. Fallo se fuori riquadro, se tocca un partner, o se tocca la rete metallica dopo rimbalzo nel riquadro prima del secondo rimbalzo. Due falli perdono il punto. Servizio a rete che cade bene si ripete. Un giocatore serve tutto il game.</p>`},
  {id:"play",h:"Giocare il punto",html:`<p>Dopo il servizio le coppie colpiscono a turno. Puoi fare volée o lasciare un rimbalzo. Perdi con doppio rimbalzo, doppio colpo, contatto rete/campo avverso, o se la palla ti colpisce dopo il colpo avverso. Un solo giocatore della coppia colpisce a ogni colpo. Vedi ${l.hold}.</p>`},
  {id:"walls",h:"Muri e rete metallica",html:`<p>La palla deve prima rimbalzare a terra dal lato avverso. Poi può toccare vetro o rete metallica e va respinta prima del secondo rimbalzo. Puoi usare i tuoi muri dopo un rimbalzo dal tuo lato. Diretto a muro/rete avversa senza rimbalzo a terra = fuori. Toccare la tua rete metallica dopo il tuo colpo ti fa perdere il punto.</p>`},
  {id:"rallies",h:"Come funziona uno scambio",html:`<p>Lo scambio inizia al ritorno del servizio. Risposta profonda o al centro; volée o rimbalzo; gioco di muro dopo un rimbalzo; il punto finisce su doppio rimbalzo, fuori, rete, la tua rete metallica o altro fallo. Il gioco di muro è ciò che costa di più all’inizio.</p>`},
  {id:"tactics",h:"Tattica base per principianti",html:`<p>Tieni la palla in gioco. Muoviti in coppia. Prendi la rete quando puoi. Lob se sei in difficoltà. Usa il muro di fondo. Mira al centro tra gli avversari. Parla con il partner. Attrezzatura: ${l.shoes} e ${l.light}.</p>`},
  {id:"scoring",h:"Il punteggio nel padel",html:`<p>Punti 15, 30, 40 e game. Sei game vincono il set con due di scarto; partite al meglio dei tre. Al deuce: vantaggio, golden point (un punto decisivo; i ricevitori scelgono il lato) o star point. A 6-6, tie-break a sette con margine di due.</p>`},
  {id:"ends",h:"Cambio di campo e pause",html:`<p>Si cambia lato dopo il primo game del set e dopo ogni game dispari. Nel tie-break ogni sei punti. Fino a 20 s tra i punti, 90 al cambio e 120 tra i set.</p>`},
  {id:"equipment",h:"Regole dell’attrezzatura",html:`<p>Racchetta senza corde, superficie piana forata; max 45,5 cm / 26 cm / 38 mm; cordino non elastico ≤ 35 cm, obbligatorio. Palla di gomma 6,35–6,77 cm. Vedi ${l.guide}, ${l.rackets}, ${l.balls} e ${l.shoes}.</p>`},
 ],
 faq:[
  ["Come si gioca a padel?","Due coppie su campo chiuso. Servizio dal basso in diagonale, lasciare rimbalzare, scambiare. Dopo il rimbalzo a terra i muri contano. Punteggio da tennis."],
  ["La palla può toccare la rete metallica?","Sì, ma solo dopo il rimbalzo a terra dal lato avverso. Prima è fuori."],
  ["Quali sono le regole del servizio?","Rimbalzo nel tuo riquadro, colpo dal basso a altezza vita o sotto, in diagonale. Due servizi; due falli perdono il punto."],
  ["Si può servire dall’alto?","No. Il servizio è dopo un rimbalzo a altezza vita o sotto."],
  ["Come si segna?","Come nel tennis: 15, 30, 40, game; sei game al set; meglio dei tre. Deuce con vantaggio, golden o star point; 6-6 a tie-break."],
  ["Cos’è il golden point?","Al deuce, un punto decisivo. I ricevitori scelgono il lato."],
  ["Il padel è sempre in doppio?","Sì. Il padel ufficiale è due contro due."],
  ["Il cordino è obbligatorio?","Sì. Va indossato, non elastico, max 35 cm."],
  ["Si può fare volée?","Sì dopo servizio e risposta validi. Il servizio deve rimbalzare, e la palla deve rimbalzare a terra prima di toccare un muro."],
  ["Che misure ha il campo?","20 m di lunghezza e 10 m di larghezza; rete 0,88 m al centro."],
 ],
 next:["hold", "vs"]
 }; })(),
  de:(()=>{ const l=L('de'); return {
 crumb:"Padel-Regeln",
 title:"Padel-Regeln: Spielen, Aufschlag und Zählen",
 desc:"Padel-Regeln erklärt: Court, Unterhand-Aufschlag, Wände und Zaun, Zählweise und Einsteiger-Taktik.",
 eyebrow:"Regeln",
 h1:"Padel-Regeln: Spielen, Aufschlag und Zählen",
 lead:"Padel wird zu zweit auf einem umschlossenen Court gespielt. Du schlägst unterhand auf, der Ball muss auf dem Boden aufspringen, bevor er eine Wand berührt, und gezählt wird wie im Tennis.",
 tldr:["<b>Doppel auf 20 m × 10 m Court</b>, Netz 0,88 m in der Mitte.","<b>Unterhand-Aufschlag</b> nach einem Aufsprung, auf Hüfthöhe oder darunter, diagonal; zwei Aufschläge.","<b>Nach Bodenaufsprung darf der Ball Glas oder Zaun treffen und trotzdem zurückgespielt werden.</b> Vorher ist er aus.","<b>Zählweise wie Tennis</b>; Deuce mit Vorteil, Golden Point oder Star Point.","<b>Einsteiger-Taktik:</b> Ball im Spiel halten, Rückwand nutzen, loben um Gegner zurückzudrängen, als Paar bewegen."],
 toc:{court:"Court und Netz",howto:"Padel spielen, Schritt für Schritt",serve:"Aufschlagregeln im Detail",play:"Den Punkt spielen",walls:"Wände und Zaun",rallies:"So läuft ein Ballwechsel",tactics:"Grundtaktik für Einsteiger",scoring:"Zählweise im Padel",ends:"Seitenwechsel und Pausen",equipment:"Ausrüstungsregeln",faq:"FAQ"},
 sections:[
  {id:"court",h:"Court und Netz",html:`<p>Der Court ist 10 m breit und 20 m lang, Netz 0,88 m in der Mitte und 0,92 m an den Enden. Aufschlaglinie 6,95 m vom Netz. Umschlossen mit Wänden hinten und Mix aus Wand und Metallzaun an den Seiten. Gespielt wird im Doppel.</p><p class="muted small">Neu im Sport? Lies ${l.vs}, wenn du den Unterschied zu anderen Schlägersportarten unsicher bist.</p>`},
  {id:"howto",h:"Padel spielen, Schritt für Schritt",html:`<p>Zwei Paare; wer aufschlägt, wird entschieden. Unterhand diagonal; der Returner lässt aufspringen (kein Volley auf den Aufschlag). Dann Ballwechsel per Volley oder nach einem Aufsprung, Wände nach Bodenaufsprung. Du gewinnst den Punkt, wenn der Gegner nicht regelkonform zurückspielt. Schlägerwahl: ${l.beg} und ${l.finder}.</p>`},
  {id:"serve",h:"Aufschlagregeln im Detail",html:`<p>Zwei Versuche. Mindestens ein Fuß hinter der Aufschlaglinie. Ball im eigenen Feld aufspringen lassen, auf Hüfthöhe oder darunter diagonal schlagen. Rechts zuerst, dann abwechseln. Fehler bei außerhalb, Partner-Treffer oder Metallzaun nach Aufsprung im Feld vor dem zweiten Aufsprung. Zwei Fehler verlieren den Punkt. Netz-Aufschlag ins richtige Feld wird wiederholt. Ein Spieler schlägt das ganze Spiel auf.</p>`},
  {id:"play",h:"Den Punkt spielen",html:`<p>Nach dem Aufschlag schlagen die Paare abwechselnd. Volley oder ein Aufsprung. Du verlierst bei Doppelaufsprung, Doppeltreffer, Netz-/Gegnerfeld-Berührung oder wenn der Ball dich nach dem Gegnerschlag trifft. Nur ein Spieler des Paars darf pro Schlag treffen. Siehe ${l.hold}.</p>`},
  {id:"walls",h:"Wände und Zaun",html:`<p>Der Ball muss zuerst auf dem Boden der Gegnerseite aufspringen. Danach darf er Glas oder Zaun treffen und muss vor dem zweiten Aufsprung zurückgespielt werden. Eigene Wände nach Aufsprung auf deiner Seite sind erlaubt. Direkt an Gegnerwand/-zaun ohne Bodenaufsprung = aus. Treffer am eigenen Metallzaun nach deinem Schlag verliert den Punkt.</p>`},
  {id:"rallies",h:"So läuft ein Ballwechsel",html:`<p>Der Ballwechsel beginnt mit dem Return. Return tief oder in die Mitte; Volley oder Aufsprung; Wandspiel nach einem Aufsprung; der Punkt endet bei Doppelaufsprung, Aus, Netz, eigenem Zaun oder anderem Fehler. Wandspiel braucht am längsten zum Lernen.</p>`},
  {id:"tactics",h:"Grundtaktik für Einsteiger",html:`<p>Ball im Spiel halten. Als Paar bewegen. Netz einnehmen, wenn möglich. Loben unter Druck. Rückwand nutzen. In die Mitte zwischen die Gegner spielen. Mit dem Partner sprechen. Ausrüstung: ${l.shoes} und ${l.light}.</p>`},
  {id:"scoring",h:"Zählweise im Padel",html:`<p>Punkte 15, 30, 40, Spiel. Sechs Spiele gewinnen den Satz mit zwei Vorsprung; Matches meist Best of Three. Bei Deuce: Vorteil, Golden Point (ein Entscheidungspunkt; Returner wählen die Seite) oder Star Point. Bei 6-6 Tie-Break bis sieben mit zwei Vorsprung.</p>`},
  {id:"ends",h:"Seitenwechsel und Pausen",html:`<p>Seitenwechsel nach dem ersten Spiel des Satzes und nach jedem ungeraden Spiel. Im Tie-Break alle sechs Punkte. Bis 20 s zwischen Punkten, 90 beim Wechsel, 120 zwischen Sätzen.</p>`},
  {id:"equipment",h:"Ausrüstungsregeln",html:`<p>Schläger ohne Saiten, flache gelochte Trefffläche; max. 45,5 cm / 26 cm / 38 mm; nicht-elastische Schlaufe ≤ 35 cm, Pflicht. Gummiball 6,35–6,77 cm. Siehe ${l.guide}, ${l.rackets}, ${l.balls} und ${l.shoes}.</p>`},
 ],
 faq:[
  ["Wie spielt man Padel?","Zwei Paare auf umschlossenem Court. Unterhand diagonal aufschlagen, aufspringen lassen, Ballwechsel. Nach Bodenaufsprung zählen die Wände. Zählweise wie Tennis."],
  ["Darf der Ball den Zaun treffen?","Ja, aber nur nach Bodenaufsprung auf der Gegnerseite. Vorher ist er aus."],
  ["Was sind die Aufschlagregeln?","Aufsprung im eigenen Feld, Unterhand auf Hüfthöhe oder darunter, diagonal. Zwei Aufschläge; zwei Fehler verlieren den Punkt."],
  ["Darf man Überhand aufschlagen?","Nein. Der Aufschlag folgt einem Aufsprung auf Hüfthöhe oder darunter."],
  ["Wie wird gezählt?","Wie Tennis: 15, 30, 40, Spiel; sechs Spiele zum Satz; Best of Three. Deuce mit Vorteil, Golden oder Star Point; 6-6 Tie-Break."],
  ["Was ist der Golden Point?","Bei Deuce entscheidet ein Punkt. Die Returner wählen die Seite."],
  ["Wird Padel immer im Doppel gespielt?","Ja. Offizielles Padel ist zwei gegen zwei."],
  ["Ist die Handgelenkschlaufe Pflicht?","Ja. Sie muss getragen werden, nicht elastisch, max. 35 cm."],
  ["Darf man volleyen?","Ja nach gültigem Aufschlag und Return. Der Aufschlag muss aufspringen, und der Ball muss auf dem Boden aufspringen, bevor er eine Wand berührt."],
  ["Wie groß ist der Court?","20 m lang und 10 m breit; Netz 0,88 m in der Mitte."],
 ],
 next:["hold", "vs"]
 }; })(),
},
};
