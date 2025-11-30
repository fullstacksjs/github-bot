FullstacksJS Telegram bot that listens to GitHub activity and announces repository events directly into a Telegram chat.

## Features

The bot automatically announces:

- ⭐ **Stars** — when someone stars the repository
- 📝 **New Issues** — when a new issue is opened
- 🔀 **Pull Requests** — when a PR is created
- ✅ **PR Merges** — when a PR is merged
- 🏁 **Releases** — when a new release is published
- 👀 **Repository Created** — when a repository is created

## Installation

### Prerequisites

Make sure you have:

- [bash](https://www.gnu.org/software/bash/)
- [node](https://nodejs.org/) >= 22.18.0
- [pnpm](https://pnpm.io/)

You can run the bot locally, with Docker, or deploy it on a server.

### 1. Clone the Repository

```bash
git clone https://github.com/fullstacksjs/github-bot.git
cd github-bot
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example `.env` file:

```bash
cp .env.example .env
```

Open `.env` and fill in each variable as needed.
See the **Configuration Reference** and **Contributing** sections below for more information.

## Configuration Reference

Environment variables:

| Key                     | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `PORT`                  | Port for the server                                            |
| `BOT_TOKEN`             | Telegram bot token from BotFather                              |
| `CHAT_ID`               | Telegram chat, group, or channel ID                            |
| `BOT_TOPIC_ID`          | Optional Telegram topic ID (for forum groups)                  |
| `BOT_WEBHOOK_URL`       | Telegram bot webhook URL                                       |
| `BOT_WEBHOOK_SECRET`    | Secret used for Telegram webhook validation                    |
| `BOT_POLLING`           | Use polling instead of webhook (recommended for local testing) |
| `GITHUB_TOKEN`          | Personal GitHub token                                          |
| `GITHUB_ORG_NAME`       | GitHub organization to receive events from                     |
| `GITHUB_WEBHOOK_SECRET` | Shared secret for GitHub webhook                               |

See `.env.example` for all available options.

## Configure GitHub Webhooks

> [!NOTE]
> If you want to use FullstacksJS events, you can skip this section and go to the [gaining access to FullstacksJS events](#gaining-access-to-fullstacksjs-events-optional) section.

To test GitHub announcements locally:

1. Go to
   **GitHub → Repository/Organization → Settings → Webhooks**

2. Click **Add webhook**

3. Set your public webhook URL:

   ```
   https://your-public-url.com/api/webhook/github
   ```

4. Set **Content type:** `application/json`

5. Enable the following events:
   - Issues
   - Pull requests
   - Pull request review requests
   - Releases

   Or select **Send me everything**.

6. Add a webhook secret in GitHub and use the same value in `.env`:

   ```
   GITHUB_WEBHOOK_SECRET=your-secret
   ```

## Configure Telegram Webhook

If you are testing or running the bot locally, you can simply use polling by setting:

```
BOT_POLLING=true
```

No additional configuration is required.

If you want to configure a Telegram webhook, follow the [official documentation](https://core.telegram.org/bots/api#getting-updates).

### 4. Run the Bot

Development mode (with auto-reload):

```bash
pnpm run dev
```

Production mode:

```bash
pnpm run start
```

### 5. Run Via Docker (Optional)

```bash
docker-compose up -d
```

## Webhook Requirement

Because GitHub and Telegram deliver events through webhooks, your bot must be accessible from the public internet.

If you are running the bot locally, use a tunneling tool such as:

- ngrok
- Cloudflare Tunnel
- LocalTunnel
- Expose

### Example Using ngrok

```bash
ngrok http 3000
```

Use the generated HTTPS URL as your GitHub webhook endpoint:

```
https://<random>.ngrok-free.app/api/webhook/github
```

Every restart may generate a new URL (you can have Fixed URL if you sign-up in ngrok)

## Contributing

Contributions of all kinds are welcome 🙌

### Ways to Contribute

You can start by picking an open issue on the
[FullstacksJS Project Board](https://github.com/orgs/fullstacksjs/projects/1).

You can also create a new issue if you believe a feature or improvement is needed, but it is recommended to first discuss the idea with other contributors in our
[Telegram group chat](https://t.me/fullstacksjs/163197).

### Contribution Workflow

1. Clone the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit and push your work:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request with a clear description of your changes.

### Gaining Access to FullstacksJS Events (Optional)

If you want your bot to receive events from the FullstacksJS GitHub organization, contact the admins in the contribution topic of our
[Telegram group chat](https://t.me/fullstacksjs/163197).
After reviewing your request, we will add your public URL to the organization’s GitHub webhooks so your bot can start receiving the corresponding events.

Note that you must already have a fixed, publicly accessible URL where your bot is running.
Refer to the Webhook Requirement
section for more details.
