# Exercício 3 — Self-hosted runners / agents

> Disciplina: Integração Contínua e Testes Automatizados (PGATS-2026-03)

## O que é um self-hosted runner/agent?

Um **runner** (GitHub Actions) ou **agent** (Azure DevOps / Jenkins) é a *Máquina
para Execução* citada nos componentes do processo de CI (slide 14): é onde os jobs
do pipeline de fato rodam.

Existem dois modelos (slide 21 — "Cloud-hosted agents vs Self-hosted agents"):

| Modelo | Quem mantém a máquina | Exemplos |
| --- | --- | --- |
| **Cloud-hosted** | O provedor de CI (efêmera, descartada após o job) | `ubuntu-24.04` no GitHub, `saas-linux` no GitLab.com |
| **Self-hosted** | **Você** (sua VM, seu servidor on-premise, seu cluster) | Runner registrado no seu repo/projeto |

## Quando faz sentido usar self-hosted?

1. **Hardware/SO específico** — builds que exigem GPU, macOS dedicado, ARM,
   dispositivos físicos (ex.: testar app mobile em um device USB conectado).
2. **Acesso a rede privada** — testes que precisam falar com bancos, APIs internas
   ou ambientes que vivem atrás do firewall corporativo, sem expor nada à internet.
3. **Custo em alto volume** — quando o consumo de minutos cloud é muito alto,
   uma frota própria pode sair mais barata (slide 16: as máquinas de build do
   SoundCloud em 2015 são exatamente esse caso de frota self-hosted).
4. **Performance e cache** — máquinas "quentes" com dependências/imagens já em
   cache reduzem o tempo de build (ajuda no "Build fast, fail fast" do slide 27).
5. **Compliance/soberania de dados** — setores regulados que não podem rodar
   código ou dados em infraestrutura de terceiros.

### Quando **NÃO** vale a pena

- Projetos pequenos/educacionais (como este): o free tier cloud é suficiente.
- Quando você não quer assumir a manutenção: patching de SO, segurança,
  disponibilidade e escalabilidade do runner passam a ser **sua** responsabilidade.
- ⚠️ **Repositórios públicos**: a própria documentação do GitHub desaconselha
  self-hosted em repo público, pois um fork malicioso poderia executar código
  arbitrário na sua máquina.

## Outras plataformas oferecem recursos similares? (sim, todas)

| Plataforma | Nome do recurso | Como registrar |
| --- | --- | --- |
| **GitHub Actions** | Self-hosted runner | `./config.cmd --url ... --token ...` |
| **GitLab CI/CD** | Self-managed GitLab Runner | `gitlab-runner register` |
| **Azure DevOps** | Self-hosted agent (Agent Pools) | `./config.cmd` do agente |
| **Jenkins** | Agent/Node (controller + agents) | Conectar nó via SSH/JNLP |
| **CircleCI** | Self-hosted runner | `circleci runner` |
| **Bitbucket Pipelines** | Self-hosted runner | runner em Docker |

O conceito é o mesmo em todas — muda a nomenclatura e a sintaxe de registro
(exatamente o que o slide 61 diz: "essas práticas se aplicam a outros provedores
de CI, mudando nomenclaturas, sintaxe e pré-definições").

## Implementação entregue neste repositório

### A) GitHub Actions (Windows, sua máquina)

- Workflow: [`.github/workflows/ci-self-hosted.yml`](../.github/workflows/ci-self-hosted.yml)
  — usa `runs-on: [self-hosted]` e é disparado manualmente (`workflow_dispatch`).
- Script de registro: [`self-hosted/setup-github-runner.ps1`](../self-hosted/setup-github-runner.ps1)

```powershell
# 1) Pegue o token em: Settings > Actions > Runners > "New self-hosted runner"
# 2) Rode (na raiz do projeto):
./self-hosted/setup-github-runner.ps1 `
  -RepoUrl "https://github.com/JoaoVRBastos/desafio-programacao-pos" `
  -Token   "COLE_O_TOKEN_AQUI"

# 3) Com o runner "Idle", dispare em: Actions > "CI (self-hosted)" > Run workflow
```

### B) GitLab CI (via Docker)

- Compose: [`self-hosted/docker-compose.yml`](../self-hosted/docker-compose.yml)

```bash
docker compose -f self-hosted/docker-compose.yml up -d
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive --url "https://gitlab.com/" \
  --registration-token "SEU_TOKEN" \
  --executor "docker" --docker-image "node:20-bookworm-slim" \
  --tag-list "self-hosted,node"
```

Depois, basta adicionar `tags: [self-hosted]` ao job desejado no `.gitlab-ci.yml`
para direcioná-lo ao runner próprio.

## Boas práticas de segurança (slide 61, item 7)

- Use runners **efêmeros** (recriados a cada job) sempre que possível.
- **Nunca** use self-hosted em repositório público.
- Isole o runner (container/VM dedicada) e conceda o mínimo de permissões.
- Fixe a versão das imagens/ferramentas e mantenha o SO atualizado.
- Não guarde segredos na máquina; use o cofre de secrets do provedor.
