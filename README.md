# Traffic Insight Automator

Uma ferramenta moderna e intuitiva para análise de dados de tráfego digital com exportação profissional para PDF, PNG e PowerPoint.

## 🚀 Características Principais

### 📊 Dashboard Completo
- **KPIs Avançados**: CTR, CPC, CPM, CPL, ROAS, Taxa de Conversão e muito mais
- **Análise de Tendências**: Acompanhe a evolução das métricas ao longo do tempo
- **Benchmarks da Indústria**: Compare seus resultados com padrões do mercado
- **Score de Qualidade**: Avaliação automática da performance das campanhas

### 📈 Gráficos Interativos
- Gráficos de linha para tendências temporais
- Gráficos de barras para comparação de campanhas
- Visualizações responsivas usando Recharts

### 📋 Exportação Profissional
- **PDF de Alta Qualidade**: Relatórios prontos para apresentação
- **PNG**: Imagens dos dashboards para compartilhamento
- **PowerPoint**: Apresentações automáticas com slides estruturados

### 🔍 Validação Inteligente de Dados
- Verificação automática de colunas obrigatórias
- Detecção de inconsistências nos dados
- Sugestões para correção de problemas
- Suporte a múltiplos formatos de data

## 📁 Formato dos Dados

### Estrutura do CSV/XLSX

Para garantir o funcionamento correto, seu arquivo deve conter as seguintes colunas **obrigatórias**:

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `date` | Data | Data da campanha | 2025-01-15 ou 15/01/2025 |
| `impressions` | Número | Total de impressões | 12000 |
| `clicks` | Número | Total de cliques | 350 |
| `cost` | Número | Custo total (em reais) | 500.00 |

### Colunas Opcionais (para análises avançadas):

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `leads` | Número | Leads gerados | 25 |
| `conversions` | Número | Conversões obtidas | 18 |
| `revenue` | Número | Receita gerada | 2500.00 |
| `reach` | Número | Alcance único | 8500 |
| `campaignname` | Texto | Nome da campanha | "Campanha Black Friday" |

### Extensão para Social Media:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `likes` | Número | Curtidas |
| `comments` | Número | Comentários |
| `shares` | Número | Compartilhamentos |
| `followers` | Número | Seguidores |
| `engagement` | Número | Taxa de engajamento |
| `posts` | Número | Posts publicados |
| `stories` | Número | Stories publicados |
| `reels` | Número | Reels publicados |

## 📝 Exemplos de Dados

### Exemplo 1: Dados Básicos de Tráfego Pago
```csv
date,impressions,clicks,cost,leads,campaignname
2025-01-01,15000,420,650.00,32,"Campanha Janeiro"
2025-01-02,18000,510,780.00,38,"Campanha Janeiro"
2025-01-03,12000,290,520.00,25,"Campanha Janeiro"
```

### Exemplo 2: Dados Completos com Revenue
```csv
date,impressions,clicks,cost,leads,conversions,revenue,reach,campaignname
2025-01-01,15000,420,650.00,32,28,2800.00,12500,"Black Friday"
2025-01-02,18000,510,780.00,38,35,3500.00,14200,"Black Friday"
```

### Exemplo 3: Dados de Social Media
```csv
date,impressions,likes,comments,shares,followers,engagement,posts
2025-01-01,25000,1200,85,45,15000,5.32,3
2025-01-02,28000,1450,92,52,15100,5.51,2
```

## 🎯 KPIs Calculados Automaticamente

### Métricas Básicas
- **CTR** (Click Through Rate): `(cliques ÷ impressões) × 100`
- **CPC** (Cost Per Click): `custo ÷ cliques`
- **CPM** (Cost Per Mille): `(custo ÷ impressões) × 1000`
- **CPL** (Cost Per Lead): `custo ÷ leads`

### Métricas Avançadas
- **ROAS** (Return On Ad Spend): `receita ÷ custo`
- **ROI** (Return On Investment): `((receita - custo) ÷ custo) × 100`
- **Taxa de Conversão**: `(conversões ÷ cliques) × 100`
- **Frequência**: `impressões ÷ alcance`

### Benchmarks da Indústria

| Métrica | Excelente | Bom | Médio | Baixo |
|---------|-----------|-----|-------|-------|
| CTR | ≥ 3% | 1.5-3% | 0.5-1.5% | < 0.5% |
| CPC | ≤ R$ 2 | R$ 2-5 | R$ 5-15 | > R$ 15 |
| ROAS | ≥ 6 | 4-6 | 2-4 | < 2 |

## 🚀 Como Usar

### 1. Preparar os Dados
- Organize seus dados em um arquivo CSV ou XLSX
- Certifique-se de que as colunas obrigatórias estão presentes
- Use nomes de colunas em português ou inglês (o sistema faz o mapeamento automático)

### 2. Fazer Upload
- Arraste e solte o arquivo na área de upload
- Ou clique para selecionar o arquivo
- O sistema validará automaticamente os dados

### 3. Analisar Dashboard
- Visualize os KPIs principais na primeira seção
- Explore os gráficos de tendência
- Confira os insights automáticos

### 4. Exportar Relatórios
- Clique em "Exportar PDF" para relatório completo
- Use "Exportar PNG" para imagens
- "Exportar PPTX" gera apresentações automáticas

## 🔧 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/traffic-insight-automator.git

# Instalar dependências
cd traffic-insight-automator
npm install

# Iniciar desenvolvimento
npm run dev
```

### Build para Produção
```bash
npm run build
npm run preview
```

## 📊 Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **Upload de Arquivos**: react-dropzone
- **Parsing CSV**: PapaParse
- **Exportação PDF**: jsPDF + html2canvas
- **Exportação PPTX**: PptxGenJS
- **Validação**: Zod
- **Notificações**: Sonner

## 🎨 Paleta de Cores

- **Primária**: #D21B1B (Vermelho vibrante)
- **Secundária**: #2563eb (Azul)
- **Fundo**: #ffffff (Branco)
- **Texto**: #1f2937 (Cinza escuro)
- **Cinza**: #6b7280 (Cinza médio)

## ⚠️ Limitações Conhecidas

- Arquivos CSV/XLSX devem ter no máximo 10MB
- Máximo de 10.000 linhas por arquivo
- Exportação PDF funciona melhor em navegadores modernos
- Para melhor qualidade, use dados dos últimos 90 dias

## 🐛 Resolução de Problemas

### Erro: "Colunas obrigatórias ausentes"
**Solução**: Verifique se seu arquivo contém as colunas: `date`, `impressions`, `clicks`, `cost`

### Erro: "Formato de data inválido"
**Solução**: Use formatos: YYYY-MM-DD, DD/MM/YYYY ou DD-MM-YYYY

### Exportação PDF não funciona
**Solução**: Certifique-se de usar um navegador moderno (Chrome, Firefox, Safari)

### CTR muito alto ou baixo
**Solução**: Verifique se os valores de impressões e cliques estão corretos

## 📞 Suporte

Para sugestões, bugs ou dúvidas:
- Abra uma [issue no GitHub](https://github.com/seu-usuario/traffic-insight-automator/issues)
- Email: suporte@trafficinsight.com

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Traffic Insight Automator** - Transformando dados de tráfego em insights valiosos 🚀

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
