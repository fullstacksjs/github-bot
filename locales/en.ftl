# Plugin: ratelimiter
ratelimiter_onLimitExceeded = Chill out. D:

# Shared
insufficient_permissions = 🔪 You're *not allowed* to perform such an action\.

# Commands
cmd_addrepo = ✅ *Repository added successfully*\!

cmd_addrepo_help =
    ✍️ `/addrepo` Guide:

    Pass the complete GitHub repository url after the command\.

    Pattern:
    — `/addrepo <github-url>`

    Example:
    — `/addrepo https://github.com/fullstacksjs/github-bot`

cmd_discover =
    ⏳ *Discovery began*\.

    This might take a few seconds\.

cmd_discover_done = ✅ Discovery completed in { $duration } seconds\!

cmd_listrepos =
    ✨ *Repositories:*

    { $repositories }

    💎 *Total:* `{ $repositoriesCount }`

cmd_listrepos_url = — [{ $name }]({ $url })

cmd_listrepos_no_repo = 🌚 Nothing's getting monitored

cmd_listcontributors =
    🏆 *Contributors:*
    GitHub, Telegram, Contributions
    { $contributors }

    💎 *Total:* `{ $count }`

cmd_listcontributors_url = — [{ $ghUsername }]({ $ghUrl }), { $tgUsername }, { $contributions }

cmd_listcontributors_empty = 🥲 No one is here

cmd_removerepo = Repository [{ $name }]({ $url }) removed successfully\.

cmd_removerepo_not_found = Repository couldn't be found\!

cmd_removerepo_help =
    ✍️ `/removerepo` Guide:

    Pass the complete GitHub repository url after the command\.

    Pattern:
    — `/removerepo <github-url>`

    Example:
    — `/removerepo https://github.com/fullstacksjs/github-bot`

cmd_whoami =
    Hello *{ $name }*\!
    I know you as *{ $ghUsername }*\.
    { $githubUrl }

cmd_whoami_not_found =
    I've never seen you before.

cmd_whoami_no_username =
    If you don't know, why should I?

cmd_link_help =
    ✍️ `/link` Guide:

    Pass the Telegram username and GitHub username after the command\.

    Pattern:
    — `/link <telegram-username> <github-username>`

    Example:
    — `/link @S_Kill ASafaeirad`

cmd_link = ✅ *Account linked successfully*\!

cmd_unlink_help =
    ✍️ `/unlink` Guide:
    Pass the Telegram username after the command\.
    Pattern:
    — `/link <telegram-username>`
    Example:
    — `/link @S_Kill`

cmd_unlink = ✅ *Account unlinked successfully*\!

cmd_unlink_not_found = ❌ *User not found*\!

cmd_help_admin =
    This bot will monitor and notify GitHub activities within the FullstacksJS community.

    💡 Commands:
     
     /help - to see this help.
     /listrepos - see list of the monitored repositories.
     /addrepo - add an existing repository.
     /removerepo - remove a repository.
     /link - link telegram account to the github username.
     /unlink - unlink telegram account from github username.
     /listcontributors - see list of the monitored contributors.
     /discover - update the repository database.
     /whoami - show your GitHub account.

cmd_help =
    This bot will monitor and notify GitHub activities within the FullstacksJS community.

    💡 Commands:
     
     /help - to see this help.
     /listrepos - see list of the monitored repositories.
     /listcontributors - see list of the monitored contributors.
     /whoami - show your GitHub account.
 

# Events
e_issue_opened =
    🔘 Issue: *{ $issueTitle }*\.

    👤 Author: [{ $user }]({ $userUrl })

    — { $issueUrl }

e_pull_request_closed_merged =
    🌳 PR Merged\!

    👤 Author: [{ $user }]({ $userUrl })

    — { $prUrl }

e_pull_request_opened =
    🌴 PR Created: *{ $prTitle }*

    👤 Author: [{ $user }]({ $userUrl })\!

    — { $prUrl }

e_release_created =
    🎉 *{ $repoName } { $releaseTag }*
    — { $releaseUrl }

    #release

e_repository_created =
    ✨ New repository\!

    — [{ $repoName }]({ $repoUrl })

e_star_created =
    🌟 [{ $user }]({ $userUrl }) starred [{ $repoName }]({ $repoUrl })\.


e_pull_request_review_requested =
    ✨ PR Review Requested\!

    👤 Requester: [{ $requester }]({ $requesterUrl })

    — { $prUrl }

    Reviewers:
    { $reviewers }

e_pull_request_reviewer = — [{ $reviewer }]({ $reviewerUrl })
