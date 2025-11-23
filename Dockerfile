FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm pkg delete scripts.prepare
RUN pnpm install --frozen-lockfile

COPY . .

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["node", "src/index.ts"]
