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

    { $githubUrl }

cmd_whoami_not_found =
    I've never seen you before.

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