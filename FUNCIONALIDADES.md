# Funcionalidades da Lumi

Este documento descreve o que está implementado no código atual e os pontos que ainda precisam ser concluídos ou validados antes de uma publicação em produção.

## Funcionalidades implementadas

### Página inicial e navegação

- Página pública de apresentação da Lumi.
- Cabeçalho e rodapé responsivos.
- Apresentação dos benefícios do produto e do Lumi Pro.
- Atalhos para planos, autenticação, dashboard e biscoito da sorte.
- Os botões **Começar** e **Quero minha mensagem** direcionam visitantes sem sessão para o login.
- Usuários autenticados continuam para a experiência correspondente.

### Autenticação

- Cadastro com nome, e-mail e senha pelo Supabase Auth.
- Login com e-mail e senha.
- Preparação para login com Google, controlado pela variável `VITE_GOOGLE_AUTH_ENABLED`.
- Redirecionamento de usuários autenticados para o dashboard.
- Proteção das páginas privadas por meio do `AuthGate`.
- Mensagens amigáveis para erros comuns de credenciais, conexão, limite de requisições e configuração de API.

### Onboarding musical

- Escolha de estilos musicais favoritos.
- Registro de artistas favoritos.
- Preferência musical para momentos tristes.
- Controle do nível de interesse em descobrir músicas novas.
- Persistência das preferências no Supabase.

### Mensagens personalizadas

- Campo para a pessoa escrever livremente como está se sentindo.
- Geração de uma mensagem acolhedora pela API da OpenAI.
- Identificação resumida do sentimento.
- Experiência visual de carregamento durante a geração.
- Limite de até três mensagens diárias para o plano Free.
- Mensagens ilimitadas para o plano Pro.
- Possibilidade de favoritar e remover mensagens dos favoritos.
- Limite de cinco favoritas para o plano Free.
- Favoritas ilimitadas para o plano Pro.

### Segurança emocional

- Análise de risco no texto compartilhado.
- Exibição de um painel de segurança quando a resposta identifica uma situação sensível.
- Supressão da recomendação musical quando há indicação de risco.

### Recomendações musicais Pro

- Recomendação de música real com título, artista e explicação personalizada.
- Escolha baseada no texto do momento e nas preferências musicais cadastradas.
- Persistência da música, artista, explicação, sentimento, data e horário.
- Link **Ouvir no Spotify — nome da música**.
- Link **Ouvir no YouTube — nome da música**.
- Registro de avaliação da recomendação: gostei, mais ou menos ou não gostei.
- Página **Minha trilha** com todas as recomendações organizadas por data.

Os links de Spotify e YouTube levam a uma busca formada pelo título e pelo artista. Isso evita a necessidade de integrar as APIs dessas plataformas nesta etapa.

### Histórico de momentos Pro

- Página privada em `/historico`.
- Exibição do texto original escrito pela pessoa.
- Exibição da resposta correspondente da Lumi.
- Data e horário do relato no fuso de São Paulo.
- Exibição do sentimento identificado.
- Indicação de mensagens favoritas.
- Consulta autenticada no servidor e verificação do plano Pro.
- Acesso pelo dashboard por meio do botão **Meu histórico**.

### Biscoito da sorte

- Página pública em `/biscoito`.
- Disponível gratuitamente, inclusive sem login.
- Catálogo local com 500 combinações de mensagens da sorte.
- Mensagens divididas em dez categorias:
  - Oportunidades
  - Encontros
  - Caminhos
  - Conquistas
  - Surpresas
  - Prosperidade
  - Descobertas
  - Sincronicidades
  - Viagens
  - Novos ciclos
- Nenhuma chamada de IA para gerar o biscoito.
- Uma abertura por dia, considerando o fuso horário de São Paulo.
- A mesma mensagem permanece disponível durante todo o dia.
- O sorteio evita repetir mensagens já vistas até percorrer o catálogo completo.
- Visitantes e contas Free têm o controle diário armazenado no navegador.
- Contas Pro registram a abertura no Supabase.

### Histórico de biscoitos Pro

- Aba **Meu histórico** dentro da página do biscoito.
- Registro da mensagem, categoria, data e horário da abertura.
- Ordenação das mensagens mais recentes para as mais antigas.
- Persistência vinculada ao usuário autenticado.
- Políticas de banco que limitam leitura e inclusão a usuários Pro.
- Restrição de apenas um registro por usuário em cada dia.
- Apresentação do benefício e acesso aos planos para usuários Free.
- Convite de login para visitantes anônimos.

### Perfil

- Edição de nome e e-mail.
- Atualização das preferências musicais.
- Encerramento da sessão.

### Planos

- Página comparativa entre Lumi Free e Lumi Pro.
- Benefícios atualizados com recomendações musicais, históricos de momentos e biscoitos.
- Identificação visual do plano atual.
- Interface preparada para a futura assinatura.

### Interface e experiência

- Layout responsivo para celular e desktop.
- Identidade visual consistente da Lumi.
- Notificações de sucesso, erro, informação e carregamento no padrão visual da marca.
- Verde e vermelho restritos principalmente aos ícones de estado.
- Páginas de erro e de rota não encontrada.
- Metadados básicos de SEO e compartilhamento social.

### Banco de dados e segurança

- Tabelas para perfis, preferências musicais, relatos, mensagens, recomendações musicais e histórico de biscoitos.
- Row Level Security habilitado nas tabelas do Supabase.
- Registros vinculados ao usuário autenticado.
- Regras de limite do plano Free no banco.
- Restrição de recomendações musicais e histórico de biscoitos ao plano Pro.
- Índices para as consultas cronológicas mais utilizadas.

## Pontos pendentes

### Prioridade alta

1. **Aplicar e validar as migrações no Supabase de produção**

   A migração `20260821120000_add_fortune_cookie_history.sql` foi criada no projeto, mas precisa ser aplicada ao ambiente Supabase utilizado pela aplicação. Depois disso, é necessário testar as políticas com usuários Free e Pro reais.

2. **Implementar cobrança e gestão de assinatura**

   A página apresenta o Lumi Pro por R$ 9,90/mês, mas o botão de assinatura ainda mostra que a cobrança não está disponível. Falta integrar um provedor de pagamentos, confirmação por webhook, cancelamento, renovação e atualização segura do campo `plan`.

3. **Definir privacidade e retenção dos relatos**

   Os textos sobre como a pessoa está se sentindo podem conter informações pessoais e sensíveis. Antes da produção, é importante definir termos de uso, política de privacidade, prazo de retenção, exclusão de conta, exportação de dados e consentimento adequado à LGPD.

4. **Validar o painel de segurança emocional**

   O fluxo sensível deve ser revisado com cuidado, incluindo linguagem, contatos de emergência aplicáveis ao país, falsos positivos, falsos negativos e comportamento quando a API estiver indisponível.

### Prioridade média

5. **Configurar e testar os serviços externos em produção**

   Confirmar `OPENAI_API_KEY`, variáveis do Supabase, URLs de redirecionamento de autenticação e, se desejado, login com Google. Também é necessário configurar limites, monitoramento de custo e alertas da API.

6. **Melhorar a precisão dos links musicais**

   Atualmente os botões abrem resultados de busca no Spotify e no YouTube. Uma integração futura pode localizar e salvar o identificador exato da faixa, evitando que a pessoa precise escolher entre resultados.

7. **Sincronizar biscoitos anônimos após o login**

   O histórico Pro começa a ser registrado no servidor quando a pessoa abre um biscoito já como usuária Pro. Um biscoito aberto anonimamente ou no plano Free não é transferido automaticamente para o histórico após login ou upgrade.

8. **Decidir a regra de limite para visitantes anônimos**

   O limite diário anônimo usa `localStorage`. Portanto, pode ser reiniciado limpando os dados do navegador ou usando outro dispositivo. Uma restrição realmente global exigiria identificação, login ou outra estratégia de servidor com implicações de privacidade.

9. **Revisar editorialmente as 500 mensagens da sorte**

   O catálogo é formado por combinações categorizadas de começos e finais. Recomenda-se uma revisão humana completa para eliminar combinações muito parecidas, construções pouco naturais ou mensagens que possam soar como promessas excessivas.

10. **Adicionar paginação aos históricos**

    Os históricos estão limitados aos 500 registros mais recentes. Antes de crescer, convém adicionar paginação ou carregamento progressivo para reduzir tráfego e tempo de renderização.

### Qualidade técnica

11. **Criar testes automatizados**

    Ainda faltam testes para autenticação, limites Free/Pro, geração de mensagens, histórico, RLS, abertura diária do biscoito, fuso horário e prevenção de duplicidade.

12. **Corrigir a configuração de formatação e finais de linha**

    O build passa, mas o lint global encontra milhares de alertas do Prettier relacionados principalmente a CRLF/LF. É necessário alinhar Prettier, Git e editor sem reformatar arquivos de maneira descontrolada.

13. **Otimizar o pacote principal**

    O build alerta que alguns chunks ultrapassam 500 kB. Vale revisar divisão de código e carregamento sob demanda para melhorar a primeira abertura da aplicação.

14. **Testes manuais em dispositivos e navegadores reais**

    Validar principalmente autenticação, redirecionamentos, animações, acessibilidade, histórico, fuso horário, atualização à meia-noite e comportamento em Safari/iOS.

15. **Observabilidade e suporte**

    Definir monitoramento de erros, métricas de geração, falhas de API, custos, taxa de retorno diário, uso dos recursos Pro e um canal de suporte ao usuário.

## Sugestão de ordem para as próximas etapas

1. Aplicar e testar todas as migrações no Supabase.
2. Revisar privacidade, retenção e segurança emocional.
3. Criar testes dos fluxos Free e Pro.
4. Integrar a cobrança e os webhooks de assinatura.
5. Revisar editorialmente as mensagens do biscoito.
6. Testar a aplicação em produção e dispositivos reais.
7. Melhorar links musicais, paginação e desempenho.

