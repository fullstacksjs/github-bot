# Plugin: ratelimiter
ratelimiter_onLimitExceeded = Chill out. D:

# Commands
cmd_listrepos =
    ✨ *Repositories:*

    { $repositories }

    💎 *Total:* `{ $repositoriesCount }`

cmd_listrepos_url = — [{ $name }]({ $url })

cmd_listrepos_no_repo = 🌚 Nothing's getting monitored

cmd_whoami =
    Hello *{ $name }*\!

    { $githubUrl }

cmd_whoami_not_found =
    I've never seen you before.
