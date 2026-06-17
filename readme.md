# 🚀 TT Burger - Agente Multi-Monitoramento de Infraestrutura

Este projeto é um agente de monitoramento assíncrono e leve, desenvolvido em **TypeScript/Node.js**, projetado para rodar em segundo plano nas máquinas dos caixas (PDV) das filiais do TT Burger (Arpoador, Botafogo, Leblon, Barra, Tijuca). 

O agente avalia de forma simultânea a saúde da conexão externa (Internet) e o status dos equipamentos críticos da rede local (LAN), reportando os dados consolidados em tempo real para a **API Central de Monitoramento**.

---

## 🛠️ Principais Funcionalidades

* **Arquitetura Modular (Clean Code):** Separação estrita de responsabilidades em arquivos dedicados (`config`, `services`, `types`), facilitando manutenções futuras e isolamento de regras de negócio.
* **Validação Antecipada (Fail-Fast):** O agente valida todas as variáveis obrigatórias do arquivo `.env` no primeiro segundo de inicialização. Se algo estiver ausente, a aplicação interrompe a execução com um erro claro, evitando falhas silenciosas em produção.
* **Varredura em Alta Performance (Paralelismo Real):** Utiliza `Promise.all` para disparar os testes de ping da internet e de todos os componentes locais ao mesmo tempo. A verificação total nunca ultrapassa o tempo máximo do timeout individual (2 segundos).
* **Mapeamento Dinâmico por Loja:** O mapeamento de hardware é feito de forma agnóstica através do arquivo `.env`. Lojas que possuem menos equipamentos (como a filial da Tijuca, que conta com apenas 1 totem) são tratadas de forma transparente, ignorando chaves vazias sem quebrar a execução.
* **Isolamento de Ambiente Estático:** Através do uso da propriedade `process.cwd()`, o executável final garante a leitura do arquivo `.env` localizado exatamente na mesma pasta raiz onde o binário (`.exe`) está operando.
* **Comunicação Segura:** Toda a transferência de payloads para o servidor central é autenticada via cabeçalho HTTP utilizando o padrão de segurança **Bearer Token**.

---

## 📋 Arquitetura e Fluxo de Pastas

O projeto adota uma estrutura de pastas profissional que separa a lógica de execução da camada de rede e transporte:

```text
MONITOR-AGENTE/
├── src/
│   ├── config/
│   │   └── env.ts           # Centraliza, valida e exporta as variáveis do .env
│   ├── types/
│   │   └── monitor.ts       # Interfaces de tipagem global (Payloads e Status)
│   ├── services/
│   │   └── ping.service.ts  # Regras de negócio de rede (Pings locais e externos)
│   │   └── api.service.ts   # Comunicação HTTP (Axios) com a API central
│   └── main.ts              # Ponto de entrada (Orquestrador do loop assíncrono)
├── .env
├── package.json
└── tsconfig.json

______________________________________________________________________

⚙️ Funcionamento Detalhado: O Orquestrador e Serviços
1. Inicialização Segura e Configuração (src/config/env.ts)
As variáveis de ambiente são lidas da raiz usando process.cwd(). O objeto estático ENV é montado de forma tipada, eliminando a necessidade de espalhar checagens manuais ou assunções de tipo (!) pelo código do projeto.

2. Monitoramento de Rede Local (src/services/ping.service.ts)
A função checarInfraLocal() é o núcleo de inteligência de rede do agente. Ela descobre quais aparelhos estão ativos ou caídos dentro da loja de forma extremamente veloz através de 4 etapas:

Leitura dos IPs Úteis: Ela pega a lista ENV.INFRA_IPS e ignora qualquer equipamento que não tenha um IP configurado. Se a loja for a da Tijuca (que só possui 1 totem), a linha do IP_TOTEM_02 estará em branco, e o código simplesmente pula esse teste sem gerar erros ou logs falsos.

Disparo Simultâneo (Mapeamento Assíncrono): Em vez de usar um laço for tradicional — que testaria um aparelho por vez e faria o script travar se vários estivessem desligados —, a função utiliza o método .map() associado a uma função assíncrona. Isso faz com que os pings para o roteador, impressoras e totens sejam disparados todos juntos, no mesmo milissegundo.

Controle de Tempo Limite (timeout: 2): Cada comando de ping tem uma tolerância máxima de 2 segundos. Se o equipamento estiver desligado da tomada ou sem cabo de rede, o script não fica travado esperando; ele estoura o tempo limite, entra no bloco catch e marca o status daquele aparelho estritamente como 'OFFLINE'.

Sincronização Final com Promise.all: A linha await Promise.all(promessas) funciona como uma barreira que segura a execução até que todos os pings disparados em paralelo retornem com uma resposta (seja o sucesso ONLINE ou o estouro de tempo OFFLINE).

Benefício Técnico: Graças a essa arquitetura paralela, o tempo total que o agente gasta para testar toda a rede interna da loja será sempre igual ao tempo do ping mais lento. No pior dos cenários (com todos os totens e impressoras desligados), a função demora exatamente 2 segundos para entregar o relatório completo.

3. O Fluxo Principal (src/main.ts)
O arquivo principal atua estritamente como o orquestrador do ciclo de vida da aplicação. A cada ciclo definido pelo INTERVALO, ele dispara as funções de checagem externa e interna de forma paralela e entrega o resultado final tipado para o serviço de API (src/services/api.service.ts), que transmite o payload formatado para a API Central.

🚀 Comandos de Execução
Modo Desenvolvimento
Para rodar e testar o agente em tempo real diretamente via TypeScript (sem compilar):

Bash
npm run dev
Compilação e Build Final (Geração do Executável)
Para transpilar os arquivos TypeScript para a raiz do projeto e gerar o binário otimizado para os caixas Windows (agente_loja.exe):

Bash
npm run build