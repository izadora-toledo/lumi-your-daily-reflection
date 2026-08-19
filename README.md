# Lumi: Your Daily Reflection

Use a imagem que estou te enviando como referência para as cores, estilos de fonte, espaçamento, design em geral.

Crie um MVP completo e funcional de uma aplicação web chamada Lumi, focada em bem-estar, motivação e descoberta musical personalizada.

A proposta da Lumi é simples:

“Conte como você está se sentindo. A Lumi encontra as palavras e a música certas para esse momento.”

O usuário informa como está se sentindo e recebe uma frase personalizada gerada por IA. Usuários do plano pago também recebem uma recomendação de música escolhida de acordo com o sentimento atual e com seus gostos musicais.

IDENTIDADE VISUAL

Quero uma interface extremamente elegante, delicada, moderna, emocional e minimalista.

Use como referência visual:

Fundo predominantemente branco/off-white

Gradientes muito suaves em rosa claro

Rosa vibrante como cor principal

Textos em preto com leve tom vinho

Cards brancos

Bordas suaves

Muito espaço em branco

Botões arredondados em formato pill

Sombras extremamente discretas

Visual premium, não infantil

Não utilizar excesso de ilustrações

Não utilizar emojis em excesso

Paleta aproximada

Cor primária:
#FF1F5A

Rosa claro:
#FFD9E3

Rosa muito claro para fundos:
#FFF2F5

Texto principal:
#211117

Texto secundário:
#665A5E

Fundo:
#FCFBFB

Preto para botões secundários:
#111417

Tipografia

Use uma fonte sans-serif moderna e elegante semelhante a:

Inter, Manrope ou equivalente

Para pequenos textos decorativos ou destaques emocionais, pode utilizar uma fonte manuscrita delicada semelhante a:

Caveat

A fonte manuscrita deve ser usada com moderação, apenas em pequenos detalhes.

PÁGINA INICIAL

No header:

À esquerda:

Ícone circular rosa com a letra L

Ao lado:
Lumi

À direita:

Entrar

E um botão principal:

Começar

Hero centralizado.

Pequeno texto manuscrito rosa acima do título:

um momento só seu

Título grande:

Como você está
se sentindo hoje?

Deixe “sentindo hoje?” em rosa.

Subtítulo:

Conte para a Lumi como foi o seu dia. Você receberá algumas palavras escolhidas especialmente para esse momento.

Botão rosa:

Quero minha mensagem

Abaixo, texto discreto:

Leva menos de um minuto.

Adicionar ao fundo um gradiente rosa extremamente suave semelhante à referência visual.

FLUXO SEM LOGIN

Ao clicar em “Quero minha mensagem”, abrir uma experiência em etapas.

ETAPA 1 — SENTIMENTO

Título:

Como você está se sentindo agora?

Subtítulo:

Não precisa encontrar a palavra perfeita. Escreva do seu jeito.

Textarea grande com placeholder:

Ex: Estou cansada, um pouco triste e parece que hoje nada deu muito certo...

Limite visual de aproximadamente 300 caracteres.

Também oferecer alguns chips opcionais:

Feliz

Triste

Ansiosa

Cansada

Desmotivada

Com esperança

Apaixonada

Confusa

Mas o usuário deve poder escrever livremente.

Botão:

Continuar

ETAPA 2 — RESPOSTA DA LUMI

Mostrar uma pequena animação de carregamento elegante.

Textos alternando durante o loading:

Entendendo seu momento...

Escolhendo algumas palavras para você...

Depois exibir um card central.

Pequeno título:

Para você, agora

Dentro do card, exibir a frase gerada pela IA.

Exemplo:

“Você não precisa resolver tudo hoje. Talvez o que você mais precise agora seja se permitir fazer apenas o que consegue.”

A frase deverá ser personalizada com base exatamente no sentimento descrito pelo usuário.

A IA deve evitar frases genéricas e clichês.

A resposta deve ter no máximo aproximadamente 2 ou 3 frases curtas.

Abaixo:

Botão secundário:
Quero outra mensagem

Botão para salvar:
♡ Guardar

Depois da mensagem, mostrar uma seção bloqueada visualmente:

🎵

Existe uma música para esse momento.

Texto:

A Lumi pode escolher uma música considerando não apenas como você está se sentindo, mas também aquilo que você gosta de ouvir.

Card parcialmente desfocado mostrando:

Sua música para agora

🔒 Disponível no Lumi Pro

Botão rosa:

Descobrir minha música

CADASTRO

Quando o usuário tentar salvar uma mensagem ou acessar a recomendação musical, solicitar cadastro.

Campos:

Nome

E-mail

Senha

Também permitir login.

Após cadastro, iniciar onboarding simples.

ONBOARDING MUSICAL

Essa parte deve parecer divertida e rápida.

Título:

Agora quero conhecer o seu ouvido 🎧

Subtítulo:

Isso ajuda a Lumi a escolher músicas que realmente tenham a sua cara.

Perguntar:

1. Quais estilos você gosta?

Permitir múltipla seleção:

Pop

Rock

Indie

MPB

Sertanejo

Pagode

Rap

R&B

Eletrônica

Gospel

K-pop

Reggae

Música clássica

Outros

2. Cite alguns artistas que você ama

Campo:

Ex: Coldplay, Billie Eilish, Taylor Swift...

3. Quando você está triste, você prefere:

Opções:

Músicas que combinem com minha tristeza

Músicas que me façam melhorar

Depende do momento

4. Você prefere descobrir músicas novas?

Escala:

Quase sempre quero algo que já conheço

até

Adoro descobrir músicas novas

Salvar essas preferências no perfil do usuário.

PLANOS

Criar dois planos inicialmente.

LUMI FREE

Até 3 mensagens personalizadas por dia

Informar livremente como está se sentindo

Gerar novas frases

Salvar até 5 mensagens favoritas

Preço:

Grátis

LUMI PRO

Destacar visualmente como plano recomendado.

Preço inicial configurável.

Usar provisoriamente:

R$ 9,90/mês

Benefícios:

Mensagens personalizadas ilimitadas

Recomendação musical personalizada

Música escolhida considerando sentimento + gosto musical

Explicação do motivo da escolha

Histórico das músicas

Mensagens favoritas ilimitadas

Perfil musical personalizado

CTA:

Assinar Lumi Pro

Não implementar cobrança real inicialmente se isso atrasar o MVP.

Criar toda a interface e deixar a arquitetura preparada para integração posterior com gateway de pagamento.

EXPERIÊNCIA PRO

Depois que um usuário Pro escrever como está se sentindo, mostrar primeiro a frase.

Em seguida:

Pequeno texto:

E para acompanhar esse momento...

Card de música elegante.

Mostrar:

Capa ou placeholder visual

Nome da música

Artista

E um pequeno texto:

Por que escolhi essa para você

Exemplo:

“Você contou que está cansada e um pouco desanimada, mas também disse que prefere músicas que tragam esperança nesses momentos. Essa começa introspectiva e vai crescendo aos poucos.”

Botão:

Ouvir no Spotify

E:

Essa escolha combinou com você?

Opções:

❤️ Muito
😐 Mais ou menos
👎 Não

Guardar esse feedback para melhorar recomendações futuras.

Não é necessário reproduzir música diretamente dentro da plataforma neste MVP.

A recomendação deve fornecer nome da música e artista.

O link pode direcionar para uma busca da música no Spotify.

DASHBOARD

Após login, criar dashboard elegante.

Saudação:

Oi, Isadora. Como você está hoje?

Abaixo, campo principal:

Conte para mim...

Botão:

Receber minha mensagem

Mostrar também:

Seu momento de hoje

Caso já tenha realizado uma geração.

Mensagens que você guardou

Cards com frases favoritas.

Sua trilha recente

Disponível para usuários Pro.

Mostrar as últimas músicas recomendadas.

HISTÓRICO PRO

Criar uma página:

Minha trilha

Exibir um histórico visual:

Hoje

😔 Triste

Fix You
Coldplay

Ontem

😌 Mais tranquila

Paradise
Coldplay

etc.

Adicionar futuramente a possibilidade de criar:

A trilha sonora do meu mês

No MVP, pode existir o card dessa funcionalidade como “Em breve”.

PERFIL

Permitir alterar:

Nome

E-mail

Preferências musicais

Artistas favoritos

Gêneros favoritos

Preferência para momentos tristes

Interesse em descobrir músicas novas

Mostrar plano atual:

Free ou Pro.

BANCO DE DADOS

Estruture o banco pensando nas seguintes entidades:

users

id

name

email

created_at

plan

user_music_preferences

user_id

genres

favorite_artists

sad_music_preference

discovery_level

mood_entries

id

user_id

mood_text

detected_mood

created_at

generated_messages

id

user_id

mood_entry_id

message

favorite

created_at

music_recommendations

id

user_id

mood_entry_id

song

artist

explanation

spotify_url

feedback

created_at

IA

Crie uma camada separada para integração com uma API de IA.

Não colocar API Key diretamente no frontend.

Toda chamada deve acontecer por backend/server function.

Criar duas funções:

generateMotivationalMessage()

Recebe:

sentimento escrito pelo usuário

Retorna:

frase curta e personalizada

Prompt base:

“Você é Lumi, uma companhia de bem-estar emocional. Leia como a pessoa está se sentindo e responda com uma mensagem curta, acolhedora e personalizada.

Não dê diagnóstico.
Não se apresente como psicóloga.
Não use linguagem clínica.
Não faça promessas.
Não utilize frases motivacionais clichês.
Não seja excessivamente positiva quando a pessoa estiver passando por algo ruim.
Reconheça o sentimento de maneira natural.

Responda em no máximo 2 ou 3 frases.”

generateMusicRecommendation()

Recebe:

sentimento atual

estilos musicais favoritos

artistas favoritos

preferência quando triste

nível de interesse em descobrir músicas

Retorna em JSON:

song

artist

explanation

A recomendação precisa ser de uma música REAL.

Não inventar músicas ou artistas.

A explicação deve ser personalizada.

Exemplo:

{
"song": "Fix You",
"artist": "Coldplay",
"explanation": "Você está se sentindo..."
}

SEGURANÇA EMOCIONAL

Como usuários podem escrever coisas relacionadas à saúde mental, implemente uma regra específica.

Se houver indicação clara de risco imediato de automutilação ou suicídio, não responder apenas com uma frase motivacional comum.

Mostrar uma experiência de segurança apropriada incentivando a pessoa a procurar ajuda imediata e pessoas de confiança.

A aplicação não deve se posicionar como substituta de atendimento psicológico ou médico.

No rodapé:

Lumi é uma ferramenta de bem-estar e reflexão e não substitui acompanhamento profissional.

RESPONSIVIDADE

Prioridade absoluta para mobile.

A experiência deve parecer um aplicativo mesmo sendo web.

No desktop:

conteúdo centralizado e elegante.

No mobile:

cards ocupando quase toda largura, com espaçamento confortável.

Não deixar textos ou botões pequenos.

EXPERIÊNCIA VISUAL

Adicionar microinterações sutis:

fade-in entre etapas

loading delicado

hover discreto

transição suave dos cards

coração animando discretamente quando uma frase é salva

pequenos elementos rosa aparecendo durante geração

Não exagerar em animações.

Não usar gradientes fortes.

Não transformar a interface em visual de startup genérica.

O produto precisa transmitir:

acolhimento
intimidade
leveza
sofisticação
personalização

IMPORTANTE

Quero um MVP realmente funcional, e não apenas uma landing page.

Implemente:

Landing page

Cadastro

Login

Onboarding musical

Área autenticada

Geração de frase

Limite diário para plano Free

Estado de usuário Pro

Recomendação musical para Pro

Favoritos

Histórico

Perfil

Banco de dados

Estrutura para integração com IA

Interface responsiva

Use Supabase para autenticação e banco de dados se for a opção mais simples dentro do Lovable.

Crie dados mock apenas onde uma integração externa ainda não estiver configurada.

Não complique a arquitetura desnecessariamente.

O objetivo é ter um MVP bonito, rápido e funcional que eu consiga testar com usuários reais.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0b7514c9-e511-406d-a259-fcf12f97aa2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
