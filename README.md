# GitHub Bot

A Telegram bot that tracks and announces GitHub activities in the FullstacksJS community.

## Features

- Track GitHub organization activities
- Announce contributions to Telegram channel
- Webhook support for real-time updates
- Multi-language support (English, Farsi)
- Rate limiting and auto-retry functionality
- Admin commands for bot management

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Bot Framework**: [Grammy](https://grammy.dev/)
- **HTTP Framework**: [Hono](https://hono.dev/)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **GitHub API**: [Octokit](https://github.com/octokit/octokit.js)
- **Validation**: [Zod](https://zod.dev/)

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v10.22.0 or higher)
- A Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- GitHub Personal Access Token

## Installation

1. Clone the repository:

```bash
git clone https://github.com/fullstacksjs/github-bot.git
cd github-bot
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure the environment variables in `.env`:

```env
# API Configuration
API_PORT=3000

# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token
BOT_CHAT_ID=your_chat_id
BOT_TOPIC_ID=your_topic_id
BOT_ADMIN_IDS=comma_separated_admin_ids
BOT_WEBHOOK_URL=your_webhook_url
BOT_WEBHOOK_SECRET=your_webhook_secret

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_ORG_NAME=fullstacksjs
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret

# Database Configuration
DB_FILE_PATH=file:database.sqlite
```

## Usage

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm start
```

### Database Commands

```bash
# Generate database migrations
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

### Other Commands

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

## Docker

You can also run the bot using Docker:

```bash
docker-compose up -d
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the [FullstacksJS](https://github.com/fullstacksjs) organization.
