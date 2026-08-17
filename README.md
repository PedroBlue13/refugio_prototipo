# Refúgio Barber — site

Site institucional de página única. **HTML, CSS e JavaScript puros, sem build e sem dependências externas.**
Nenhuma requisição sai para fora do domínio: fontes, ícones e imagens estão todos dentro desta pasta.

---

## Como ver o site

Abra `index.html` com dois cliques.

Para ver exatamente como ficará publicado (o `iframe` do Google Maps e os caminhos relativos
funcionam melhor via servidor), rode na pasta do site:

```bash
python -m http.server 8000
```

E acesse `http://localhost:8000`.

---

## Como publicar

### GitHub Pages (já configurado)

O repositório é [PedroBlue13/refugio_prototipo](https://github.com/PedroBlue13/refugio_prototipo).

**Configuração atual:** Settings → Pages → Source: **GitHub Actions**, rodando
[`.github/workflows/static.yml`](.github/workflows/static.yml) — o template "Static HTML" padrão do
GitHub. **Todo push na `main` publica sozinho:**

```bash
git add .
git commit -m "descrição da mudança"
git push
```

Em cerca de um minuto o site atualiza em
`https://pedroblue13.github.io/refugio_prototipo/`.

> **Por que o site mora na raiz do repositório.** O workflow sobe `path: '.'`, ou seja, o
> repositório inteiro — então o `index.html` precisa estar na raiz. É por isso que não existe mais
> uma pasta `site/`. Como bônus, esse arranjo também funciona sem alteração nenhuma se um dia você
> trocar o Source para **Deploy from a branch → `main` → `/ (root)`**.
>
> Se quiser publicar só o essencial, troque `path: '.'` por `path: './publico'` no workflow e mova
> para essa pasta apenas `index.html`, `css/`, `js/`, `fonts/`, `img/` e `.nojekyll`.
>
> O `.nojekyll` na raiz desliga o processamento Jekyll — os arquivos são servidos exatamente como
> estão, o que é mais rápido e evita surpresas com nomes de arquivo.

**Só pode existir um mecanismo de publicação.** Um workflow com `actions/deploy-pages` exige
Source "GitHub Actions"; com "Deploy from a branch" ele falha a cada push. Por isso o repositório
tem apenas o `static.yml` — o workflow que eu havia criado antes foi removido para não competir
com ele.

### Outras hospedagens

Arraste a raiz do projeto (ou só `index.html`, `css/`, `js/`, `fonts/` e `img/`). Não há build.

- **Netlify** — arraste a pasta em app.netlify.com/drop
- **Vercel** — `vercel deploy` na pasta, ou arraste pelo painel
- **Hospedagem tradicional (cPanel, Hostinger…)** — envie por FTP para `public_html`

### Ao migrar para o domínio definitivo

Troque o endereço provisório `https://refugiobarber.com.br/` em `index.html`: nas tags
`<link rel="canonical">`, `og:url` e no campo `url` dos dados estruturados.

> ⚠️ **Enquanto estiver no GitHub Pages**, o `canonical` aponta para `refugiobarber.com.br`, um
> domínio que ainda não existe. Para um protótipo isso é até conveniente — evita que a versão de
> teste seja indexada no lugar do site final. Mas se você quiser que o endereço do Pages apareça no
> Google, precisa trocar o `canonical` para a URL do Pages.
>
> A `og:image` também usa caminho relativo (`img/og.jpg`). WhatsApp, Instagram e afins exigem URL
> **absoluta** para exibir a prévia — quando o domínio estiver definido, troque para o endereço
> completo (`https://seudominio.com.br/img/og.jpg`).

---

## Estrutura

```
.                          ← raiz do repositório = raiz do site publicado
├── index.html             página inteira + SEO + dados estruturados + ícones SVG
├── .nojekyll              desliga o Jekyll: serve os arquivos como estão
├── css/styles.css         design system e todos os estilos
├── js/main.js             animações de scroll, menu, FAQ, contadores
├── fonts/                 Bebas Neue, Inter e Permanent Marker (.woff2 local)
├── img/                   o que o site realmente usa
│   ├── ana.webp/.jpg      retrato do Hero (recorte com fundo transparente)
│   ├── og.jpg             imagem de compartilhamento, 1200×630
│   ├── logo.* / icon-*    logo e favicons
│   └── galeria/g1–g9      fotos recortadas das tiras originais
│
├── originais/             arquivos-fonte — NÃO usados pelo site
│   ├── ana/ana.png        retrato em alta, com alfa
│   ├── clientes/          as duas tiras de contato
│   └── logo/
├── refugio-barber-*.md    briefings do cliente
└── claude-frontend-skills/
```

Como o workflow sobe a raiz inteira, tudo isso é servido publicamente — inclusive os `.md` de
briefing, `originais/` e `claude-frontend-skills/`. O repositório já é público, então nada novo
fica exposto, e são só alguns MB. Se quiser enxugar, veja a nota sobre `path:` em
[Como publicar](#github-pages-já-configurado).

---

## ⚠️ Trocar uma foto: leia isto primeiro

**O site não lê a pasta `originais/`.** Ele usa cópias próprias, já otimizadas, em `img/`.
Trocar o arquivo original **não muda nada** no site — é preciso gerar as cópias de novo.

Para o retrato do Hero, depois de substituir `originais/ana/ana.png`:

```bash
python - <<'FIM'
from PIL import Image, ImageFilter
im = Image.open('originais/ana/ana.png').convert('RGBA')
im = im.crop(im.getbbox())                       # corta a borda transparente
w = 1000; h = round(im.height * w / im.width)
im = im.resize((w, h), Image.LANCZOS)
im = im.filter(ImageFilter.UnsharpMask(1.2, 55, 3))
im.save('img/ana.webp', 'WEBP', quality=82, method=6)
flat = Image.new('RGB', im.size, (5, 5, 5)); flat.paste(im, (0, 0), im)
flat.save('img/ana.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
og = Image.new('RGB', (1200, 630), (5, 5, 5))
fh = 600; fw = round(im.width * fh / im.height)
fig = im.resize((round(im.width * fh / im.height), fh), Image.LANCZOS)
og.paste(fig, (1200 - fig.width - 90, 30), fig)
og.save('img/og.jpg', 'JPEG', quality=86, optimize=True)
FIM
```

Depois **atualize `width` e `height` do `<img>` do Hero** no `index.html` para as novas medidas —
eles reservam o espaço e evitam o layout "pular" durante o carregamento.

**O Hero espera um recorte com fundo transparente (PNG com alfa).** Não há moldura nem borda: a
figura flutua sobre o preto, com um halo de luz atrás e a base dissolvendo no fundo. Se a foto nova
tiver fundo sólido, ela vai aparecer como um retângulo — nesse caso remova a máscara de dissolução
em `.hero__frame img` e devolva um `border-radius` ao `.hero__frame`.

---

## Onde mexer no conteúdo

| O que mudar | Onde |
|---|---|
| **Link de agendamento** | `js/main.js`, constante `BOOKING_URL` no topo — ela é reaplicada nos 22 botões ao carregar a página |
| Preços e durações dos serviços | seção `<!-- serviços -->` em `index.html` — atualize **também** o `hasOfferCatalog` nos dados estruturados do `<head>` |
| Horários de atendimento | bloco `.hours` na seção de localização — e o `openingHoursSpecification` no `<head>` |
| Formas de pagamento | lista `.pays` na seção de localização — e `paymentAccepted` no `<head>` |
| WhatsApp | busque por `5541995787871` em `index.html` |
| Endereço | busque por `José Merhy` em `index.html` |
| Preço do Clube | `data-count="170"` em `index.html` (o contador anima até esse número) |
| Economia anunciada | `data-count="400"` em `index.html` |
| Perguntas do FAQ | seção `<!-- faq -->` em `index.html` — atualize **também** o bloco `FAQPage` de dados estruturados no `<head>` |
| Cores, tipos, espaçamentos | bloco `:root` no topo de `css/styles.css` |

> **Sobre o link de agendamento:** ele também está escrito por extenso em cada `href` do HTML.
> Isso é proposital — garante que os botões funcionem mesmo se o JavaScript falhar.
> Ao trocar a URL, altere a constante em `main.js` **e** faça um localizar/substituir no `index.html`.

---

## Decisões que valem saber

**Paleta.** O preto ocupa 75–80% da tela por decisão de projeto. Azul, roxo, rosa e laranja
aparecem só em CTA, preço, números, ícones, bordas e hover. Os brilhos coloridos ao fundo estão
bem discretos de propósito: se aumentá-los, o site perde o ar premium e vira "fundo colorido".

**Acentos em títulos.** Os títulos usam Bebas Neue com `line-height` menor que 1. Nessa condição,
o acento do "Ú" de REFÚGIO fica **fora** da caixa da linha — ele some quando o texto tem degradê
(`background-clip:text`) e é cortado quando está dentro da máscara de animação. Por isso `.mask` e
`.mask__in` têm `padding-top` com margem negativa compensando. **Não remova esses paddings.**

**Degradê no texto.** Elementos em bloco com degradê precisam de `width:max-content`, senão o
espectro se espalha pela coluna inteira e o texto mostra só um pedaço da cor.

**Animações.** Tudo é `transform` e `opacity`, disparado por `IntersectionObserver`, com um único
listener de scroll. Cada elemento anima uma vez só. O parallax só roda a partir de 960px de largura.
Além do observer há uma varredura de segurança no scroll (`sweep`, em `main.js`), que garante que
nenhum bloco fique preso invisível em cenários que o observer pode não cobrir bem — salto por
âncora, aba em segundo plano, posição de scroll restaurada ao recarregar.

**"O site está parado" — o motivo mais provável.** Se o Windows estiver com
*Configurações → Acessibilidade → Efeitos visuais → **Efeitos de animação** desligado*, o navegador
informa `prefers-reduced-motion: reduce` e o site respeita isso. Duas saídas:

1. Ligar os efeitos de animação no Windows; ou
2. Usar o botão **"Animações reduzidas / ativas"** no rodapé do site — a escolha vale sobre a
   preferência do sistema e fica salva no navegador.

**Como o movimento é controlado.** O atributo `data-motion` no `<html>` (`full` ou `reduced`) é
resolvido por um script no `<head>`, antes da primeira pintura: escolha salva do visitante primeiro,
preferência do sistema depois. O CSS inteiro se apoia nesse atributo.

O modo `reduced` **não congela a página** — ele corta deslocamento, parallax e laços contínuos
(marquee, respiro da foto), mas mantém o fade de opacidade. O que incomoda em movimento é o
deslocamento, não a variação suave de opacidade.

**Degradação.** Sem JavaScript o site continua completo: os reveals só escondem conteúdo quando a
classe `.js` existe no `<html>`.

---

## Acessibilidade

- Um único `<h1>`, hierarquia de títulos sem saltos, landmarks semânticos e link "pular para o conteúdo"
- Menu mobile com `aria-expanded`, foco preso enquanto aberto, `Esc` para fechar e foco devolvido ao botão
- FAQ com `aria-expanded` / `aria-controls`; painel fechado sai da ordem de tabulação
- Foco sempre visível, alvos de toque de 44px, cor nunca é o único indicador de estado
- Testado com movimento reduzido, sem JavaScript, e em 390 / 768 / 1440px

---

## Decisões tomadas sobre os dados de serviços

**Grafia da rua.** O arquivo de instruções pedia "utilizar exatamente: Rua José **Mehry**". O arquivo de
serviços trazia "Rua José **Merhy**", e o Google Maps confirma **Merhy** — é essa a grafia usada no site,
no `iframe` do mapa, no botão "Como chegar" e nos dados estruturados. Se por algum motivo a grafia
oficial for outra, é só um localizar/substituir.

**Domingo e segunda.** O arquivo lista horários apenas de terça a sábado. O site exibe
"Domingo e segunda — Fechado", que é a leitura natural da ausência. Confirme com a barbearia.

**Os 12 serviços foram agrupados em 5 categorias** (Cabelo, Barba, Combos, Sobrancelha e cílios,
Coloração), cada uma com um acento de cor. Os preços aparecem em branco de propósito: o degradê da
marca fica reservado ao preço do Clube, que precisa ser o momento de cor mais forte da página.

**Comparativo do Clube.** O card do Clube mostra "Corte avulso R$ 58,00 — a partir do 3º corte no mês,
o Clube já se pagou". A conta é factual (3 × R$ 58 = R$ 174 > R$ 170) e usa só dados fornecidos.
O selo "Economize mais de R$ 400" foi mantido exatamente como veio do material promocional.

---

## Pendências para o cliente

**As imagens estão em resolução baixa.** As fotos da galeria vieram de duas tiras de contato de
~180px de largura; foram recortadas, ampliadas e tratadas com nitidez, mas não têm detalhe real
para crescer mais. O logo tem apenas 150×150px.

Se a barbearia enviar os arquivos originais, o ganho é grande e a troca é direta:

- **Galeria** — substituir `img/galeria/g1.webp` … `g9.webp` (e os `.jpg`), mantendo os nomes.
  Atualize os atributos `width`/`height` no HTML para as novas medidas, senão o espaço reservado fica errado.
- **Logo** — enviar em SVG ou PNG de 512px, e gerar de novo `icon-32/180/512.png`
- **Hero** — `img/ana.webp` está em 667×851; o ideal seriam ~1400px de largura

Uma foto da tira original continua fora: um close de **unhas/manicure**. A lista de serviços tem
cílios, coloração e mechas, mas nenhum serviço de unhas — então incluí-la sugeriria algo que a
barbearia não anuncia. Se o serviço existir, vale um card próprio em Serviços e a foto volta.

**Links de redes sociais.** O arquivo pede para adicionar "quando disponíveis". O ícone do Instagram
já está no sprite de SVG (`#i-instagram`), pronto para uso no rodapé assim que o link chegar.

**Ainda não fornecido:** tempo de mercado, número de clientes e depoimentos. Nada disso foi inventado.
Quando o cliente passar depoimentos reais, o lugar natural é uma faixa entre a Galeria e o Sobre.
