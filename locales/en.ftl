# Plugin: ratelimiter
ratelimiter_onLimitExceeded = Chill out. D:

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

cmd_listcontributors_url = — [{ $ghUsername }]({ $ghUrl }), { $tgUsername }, { $contributions } { $isMuted }

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

    Method 1: Reply to a user's message
    — `/link <github-username>`

    Method 2: Provide both usernames
    — `/link <github-username> <telegram-username>`

    Examples:
    — Reply to user: `/link ASafaeirad`
    — Direct: `/link ASafaeirad S_Kill`

cmd_link = ✅ *Account linked successfully*\!

cmd_link_no_user = ⚠️ Could not find user information\.

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
     /mute - mute github account.

cmd_help =
    This bot will monitor and notify GitHub activities within the FullstacksJS community.

    💡 Commands:
     
     /help - to see this help.
     /listrepos - see list of the monitored repositories.
     /listcontributors - see list of the monitored contributors.
     /whoami - show your GitHub account.
 
cmd_mute_help =
    ✍️ `/mute` Guide:

    Pass the GitHub username after the command\.

    Pattern:
    — `/mute <github-username>`

    Example:
    — `/mute ASafaeirad`

cmd_mute_already = *{ $ghUsername }* has been muted already\!

cmd_mute = 🔇 *User muted successfully*\!

# Events
e_issue_opened =
    🔘 Issue: *{ $issueTitle }*\.

    👤 Author: [{ $user }]({ $userUrl })

    — { $issueUrl }

    { $repoHashtag } \#issue

e_pull_request_closed_merged =
    🌳 PR Merged\!

    👤 Author: [{ $user }]({ $userUrl })

    — { $prUrl }

    { $repoHashtag } \#pr

e_pull_request_opened =
    🌴 PR Created: *{ $prTitle }*

    👤 Author: [{ $user }]({ $userUrl })\!

    — { $prUrl }

    { $repoHashtag } \#pr

e_release_created =
    🎉 *{ $repoName } { $releaseTag }*
    — { $releaseUrl }

    { $repoHashtag } \#release

e_repository_created =
    ✨ New repository\!

    — [{ $repoName }]({ $repoUrl })

    { $repoHashtag } \#new_repo

e_star_created =
    🌟 [{ $user }]({ $userUrl }) gave star number { $starNumber } to [{ $repoName }]({ $repoUrl })\.

    { $repoHashtag } \#star

e_issue_assigned =
    👥 Issue Assigned: *{ $issueTitle }*\.

    👤 Assignee: [{ $assignee }]({ $assigneeUrl })

    — { $issueUrl }

    { $repoHashtag } \#assigned

