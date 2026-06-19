# Trabalho de Conclusão — Integração Contínua com GitHub Actions

Pipeline de Integração Contínua em **GitHub Actions** para um projeto Node.js com
testes automatizados, desenvolvida para o Trabalho de Conclusão da disciplina
**Integração Contínua e Testes Automatizados** (PGATS-2026-03).

> Projeto reaproveitado de outra disciplina da pós: `ServicoDePagamento`, um
> serviço de pagamentos simples com testes unitários em **Mocha**.

## Objetivo e requisitos atendidos

| Requisito do TCC | Como foi atendido |
| --- | --- |
| Execução por **push** | `on.push` nas branches `main` e `feat/**` |
| Execução **manual** | `on.workflow_dispatch` (botão *Run workflow*) |
| Execução **agendada** | `on.schedule` com `cron` (segunda 06:00 UTC) |
| **Geração** de relatório de testes | Mochawesome (HTML), xUnit XML e CTRF JSON |
| **Armazenamento/publicação** do relatório | `actions/upload-artifact` + resumo CTRF no *Summary* do run |
| **README** com solução e conceitos | este documento |

## O projeto

```
.
├── src/servicoDePagamento.js          # Código da aplicação
├── test/servicoDePagamento.test.js    # Testes unitários (Mocha)
├── config/mocha-reporters.json        # Multi-reporter: spec + HTML + xUnit + CTRF
└── .github/workflows/ci.yml           # A pipeline do TCC
```

### Rodar localmente

```bash
npm ci             # instala dependências
npm test           # executa os testes (saída no console)
npm run test:ci    # executa os testes e gera os relatórios em reports/
```

O `npm run test:ci` roda o Mocha com o **mocha-multi-reporters**, gerando numa
única execução:

| Relatório | Formato | Caminho | Para quem |
| --- | --- | --- | --- |
| Mochawesome | HTML | `reports/mochawesome/index.html` | humano (QA/dev/negócio) |
| JUnit | xUnit XML | `reports/junit/results.xml` | ferramentas de CI |
| CTRF | JSON | `reports/ctrf/ctrf-report.json` | análises/IA |

## A pipeline (`.github/workflows/ci.yml`)

### Gatilhos (triggers)

```yaml
on:
  push:
    branches: [main, "feat/**"]   # a cada commit enviado
  pull_request:
    branches: [main]              # em Pull Requests para a main
  schedule:
    - cron: "0 6 * * 1"           # toda segunda-feira às 06:00 UTC
  workflow_dispatch:              # disparo manual (1 clique)
```

Cobre os três gatilhos exigidos (push, manual e agendado) e, de bônus,
`pull_request` — aplicando a boa prática "build a cada commit/PR".

### Etapas (job `test`)

1. **Checkout** do código (`actions/checkout`).
2. **Setup do Node 20** com cache de `npm` (`actions/setup-node`).
3. **`npm ci`** — instalação determinística pelo `package-lock.json`.
4. **`npm run test:ci`** — executa os testes e gera os 3 relatórios.
5. **`actions/upload-artifact`** — publica a pasta `reports/` como artefato do
   run (com `if: always()`, sai mesmo se um teste falhar).
6. **`ctrf-io/github-test-reporter`** — publica um resumo visual dos testes
   direto na aba *Summary* da execução.

### Como ver o relatório publicado

- **Resumo rápido:** aba *Summary* do run (gerado pela action CTRF).
- **Relatório HTML completo:** no run → seção *Artifacts* → baixar
  `relatorios-de-teste` → abrir `mochawesome/index.html` no navegador.

## Conceitos aplicados (da disciplina)

- **Etapas macro do CI**: Compilação (`npm ci`) → Testes (`npm run test:ci`) →
  Relatórios/Inspeção.
- **Gatilhos**: push, pull_request, scheduled e manual.
- **Relatórios padronizados**: xUnit (praticamente um padrão) e CTRF (JSON
  padronizado), além do HTML legível (Mochawesome).
- **Boas práticas**: build a cada commit, *fail fast*, timeout curto
  (`timeout-minutes`), versão fixa da máquina (`ubuntu-24.04`), permissões
  mínimas e segredos fora do código (notificação opcional via secret).

## Evidência de execução

Histórico de execuções (incluindo runs **agendados** que passaram):
**https://github.com/JoaoVRBastos/desafio-programacao-pos/actions**

## Extras (fora do escopo do TCC)

Exercícios práticos do módulo, mantidos no repositório:

- `.gitlab-ci.yml` — a mesma pipeline portada para **GitLab CI**.
- `.github/workflows/ci-self-hosted.yml` + `self-hosted/` — execução em
  **runner self-hosted** (análise em `docs/exercicio-3-self-hosted.md`).
