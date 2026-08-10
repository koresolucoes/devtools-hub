export const snippetsData = {
  "node-multi-stage": {
    title: "Node 20 Multi-stage Dockerfile",
    language: "dockerfile",
    code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]`
  },
  "nginx-proxy": {
    title: "Nginx Reverse Proxy",
    language: "nginx",
    code: `server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`
  },
  "interactive-rebase": {
    title: "Interactive Rebase",
    language: "bash",
    code: `# Inicia o rebase interativo para os últimos 3 commits
git rebase -i HEAD~3

# Na tela que abrir (vim/nano):
# p, pick = usar o commit
# r, reword = usar o commit, mas editar a mensagem
# e, edit = usar o commit, mas parar para alteração
# s, squash = usar o commit, mas fundir no commit anterior
# f, fixup = igual ao squash, mas descarta a mensagem
# d, drop = remover o commit`
  },
  "recover-reflog": {
    title: "Recover from Reflog",
    language: "bash",
    code: `# Mostra o histórico de todos os movimentos do HEAD
git reflog

# Se você deletou uma branch ou fez um reset hard errado,
# ache o hash do commit antes do erro (ex: abc1234) e faça:
git reset --hard abc1234
# Ou crie uma nova branch a partir desse ponto:
git checkout -b branch-recuperada abc1234`
  },
  "mcp-python": {
    title: "Python MCP Server Init",
    language: "python",
    code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("MeuServidor")

@mcp.tool()
def ola_mundo(nome: str) -> str:
    """Uma ferramenta simples de teste"""
    return f"Olá, {nome}!"

if __name__ == "__main__":
    mcp.run(transport='stdio')`
  },
  "mcp-node": {
    title: "Node MCP Client Init",
    language: "javascript",
    code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "python",
  args: ["meu_servidor.py"]
});

const client = new Client(
  { name: "meu-client", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

await client.connect(transport);
console.log("Conectado ao MCP Server!");`
  }
};
