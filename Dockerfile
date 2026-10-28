FROM node:26-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global pnpm@12.16.1

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm pkg delete scripts.prepare
RUN pnpm install --frozen-lockfile

COPY . .

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["node", "src/index.ts"]
