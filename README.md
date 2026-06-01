# desafio-programacao-pos — Integração Contínua e Testes Automatizados

Projeto da disciplina **Integração Contínua e Testes Automatizados** (PGATS-2026-03).
Aplicação Node.js simples (`ServicoDePagamento`) com testes unitários em **Mocha**,
usada como base para configurar pipelines de CI em **duas ferramentas diferentes**,
gerar **relatórios padronizados** e executar em **runners self-hosted**.

## Estrutura do projeto

```
.
├── src/servicoDePagamento.js          # Código da aplicação
├── test/servicoDePagamento.test.js    # Testes unitários (Mocha)
├── config/mocha-reporters.json        # Config multi-reporter (spec + xUnit + CTRF)
├── .github/workflows/
│   ├── ci.yml                         # Pipeline base (GitHub Actions) + Exercício 2
│   └── ci-self-hosted.yml             # Exercício 3 (runner self-hosted)
├── .gitlab-ci.yml                     # Exercício 1 (GitLab CI/CD)
├── self-hosted/
│   ├── docker-compose.yml             # Exercício 3 — GitLab Runner via Docker
│   └── setup-github-runner.ps1        # Exercício 3 — registra runner do GitHub no Windows
└── docs/exercicio-3-self-hosted.md    # Exercício 3 — análise escrita
```

## Como rodar localmente

```bash
npm ci             # instala dependências
npm test           # roda os testes (saída "spec" no console)
npm run test:ci    # roda os testes e gera os relatórios em reports/
```

O `npm run test:ci` produz, em uma única execução:

- `reports/junit/results.xml` — formato **xUnit XML** (slides 43-44), praticamente um padrão de mercado.
- `reports/ctrf/ctrf-report.json` — formato **CTRF** (slides 45-46), JSON padronizado que habilita relatórios e análises por IA.

---

## Exercício 1 — Pipeline em outra ferramenta de CI (GitLab CI/CD)

Arquivo: [`.gitlab-ci.yml`](.gitlab-ci.yml)

A mesma pipeline do GitHub Actions foi portada para o **GitLab CI/CD**, mantendo os
conceitos da aula e mudando apenas a sintaxe (slide 61). Destaques:

- **Stages** `build` → `test` (equivalente aos *jobs/steps*).
- **Triggers** via `workflow:rules`: pushes em branches, Merge Requests e pipelines agendados (slide 31).
- **Cache** de `node_modules` com chave pelo `package-lock.json`.
- **Relatórios**: o XML xUnit é publicado com `artifacts:reports:junit`, a
  **integração nativa** do GitLab — os resultados aparecem na aba *Tests* do pipeline
  e no widget da Merge Request (o equivalente, no GitLab, à action de test reporter).
- Boas práticas do slide 61: imagem com versão fixa e `timeout` curto.

| GitHub Actions | GitLab CI |
| --- | --- |
| `on: [push, pull_request, schedule]` | `workflow:rules` |
| `jobs` / `steps` | `stages` / `script` |
| `runs-on` | `image` (+ `tags` p/ self-hosted) |
| `actions/upload-artifact` | `artifacts:paths` |
| action de test reporter (Marketplace) | `artifacts:reports:junit` (nativo) |

---

## Exercício 2 — Action do Marketplace

Action escolhida: **[ctrf-io/github-test-reporter](https://github.com/marketplace/actions/github-test-reporter-ctrf)**
— integrada em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (step "Publicar relatório de testes (CTRF)").

**Por que esta?** Ela agrega **relatórios + IA** ao fluxo (categorias sugeridas no
enunciado) e conversa diretamente com o conteúdo da aula sobre o formato **CTRF**
(slides 45-46). O que ela entrega:

- Resumo visual dos testes direto no **Summary** da execução do workflow.
- Relatórios de **testes que falharam** e de **testes instáveis (flaky)** — apoia a
  análise de resultados dos slides 51-52.
- Comentário automático na **Pull Request** (opcional, já deixado comentado no YAML).
- **Resumo por IA** dos erros (opcional) — o "CTRF AI Test Reporter" do slide 46.

> **Bônus — Notificações:** o job `notificar` demonstra a categoria "notificações"
> enviando o status ao **Slack** via `slackapi/slack-github-action`. Ele só roda se o
> secret `SLACK_WEBHOOK_URL` existir, então não quebra o pipeline de quem não o configurar
> (boa prática do slide 58: "mantenha visibilidade do status do build").

---

## Exercício 3 — Self-hosted runners/agents

Análise completa (quando usar, prós/contras, plataformas equivalentes e segurança):
**[docs/exercicio-3-self-hosted.md](docs/exercicio-3-self-hosted.md)**.

Resumo do que foi implementado:

- **GitHub Actions** — workflow [`ci-self-hosted.yml`](.github/workflows/ci-self-hosted.yml)
  com `runs-on: [self-hosted]` + script PowerShell
  [`self-hosted/setup-github-runner.ps1`](self-hosted/setup-github-runner.ps1) para
  registrar o runner na própria máquina (Windows).
- **GitLab CI** — [`self-hosted/docker-compose.yml`](self-hosted/docker-compose.yml)
  sobe um GitLab Runner em Docker; basta marcar o job com `tags: [self-hosted]`.

**Em uma frase:** faz sentido usar self-hosted quando você precisa de hardware/SO
específico, acesso a rede privada, controle de custo em alto volume ou compliance —
e **todas** as grandes plataformas (GitLab, Azure DevOps, Jenkins, CircleCI,
Bitbucket) oferecem o equivalente, mudando apenas a nomenclatura.

---

## Conceitos da aula aplicados

- **Etapas macro do CI** (slide 9): Compilação (`npm ci`) → Testes (`npm run test:ci`) → Relatórios.
- **Triggers** (slide 31): push, pull_request, scheduled e disparo manual.
- **Relatórios padronizados**: xUnit XML (slides 43-44) e CTRF (slides 45-46).
- **Boas práticas** (slides 54-61): build a cada commit, shift-left, sem segredos no
  código, visibilidade do status, timeouts curtos, versões fixas e uso consciente de Actions.
