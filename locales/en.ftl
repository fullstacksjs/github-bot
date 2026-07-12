# Plugin: ratelimiter
ratelimiter_onLimitExceeded = Chill out. D:

# Commands
cmd_addrepo = ✅ <b>Repository added successfully!</b>

cmd_addrepo_help =
    ✍️ <code>/addrepo</code> Guide:

    Pass the complete GitHub repository url after the command.

    Pattern:
    — <code>/addrepo &lt;github-url&gt;</code>

    Example:
    — <code>/addrepo https://github.com/fullstacksjs/github-bot</code>

cmd_discover =
    ⏳ <b>Discovery began.</b>

    This might take a few seconds.

cmd_discover_done = ✅ Discovery completed in <b>{ $duration }</b> seconds!

cmd_listrepos =
    ✨ <b>Repositories:</b>

    { $repositories }

    💎 <b>Total:</b> <code>{ $repositoriesCount }</code>

cmd_listrepos_url = — <a href="{ $url }">{ $name }</a>

cmd_listrepos_no_repo = 🌚 Nothing's getting monitored

cmd_listcontributors =
    🏆 <b>Contributors:</b>
    GitHub, Telegram, Contributions
    { $contributors }

    💎 <b>Total:</b> <code>{ $count }</code>

cmd_listcontributors_url = — <a href="{ $ghUrl }">{ $ghUsername }</a>, { $tgUsername }, { $contributions } { $isMuted }

cmd_no_contributor = 🤔 Who are you talking about?!

cmd_listcontributors_empty = 🥲 No one is here

cmd_removerepo = Repository <a href="{ $url }">{ $name }</a> removed successfully.

cmd_removerepo_not_found = Repository couldn't be found!

cmd_removerepo_help =
    ✍️ <code>/removerepo</code> Guide:

    Pass the complete GitHub repository url after the command.

    Pattern:
    — <code>/removerepo &lt;github-url&gt;</code>

    Example:
    — <code>/removerepo https://github.com/fullstacksjs/github-bot</code>

cmd_whoami =
    Hello <b>{ $name }</b>!
    I know you as <b>{ $ghUsername }</b>.
    <a href="{ $githubUrl }">{ $githubUrl }</a>

cmd_whoami_not_found =
    I've never seen you before.

cmd_whoami_no_username =
    If you don't know, why should I?

cmd_link_help =
    ✍️ <code>/link</code> Guide:

    Method 1: Reply to a user's message
    — <code>/link &lt;github-username&gt;</code>

    Method 2: Provide both usernames
    — <code>/link &lt;github-username&gt; &lt;telegram-username&gt;</code>

    Examples:
    — Reply to user: <code>/link ASafaeirad</code>
    — Direct: <code>/link ASafaeirad S_Kill</code>

cmd_link = ✅ <b>Account linked successfully!</b>

cmd_link_no_user = ⚠️ Could not find user information.

cmd_unlink_help =
    ✍️ <code>/unlink</code> Guide:
    Pass the Telegram username after the command.
    Pattern:
     — <code>/unlink &lt;telegram-username&gt;</code>
    Example:
    — <code>/unlink @S_Kill</code>

cmd_unlink = ✅ <b>Account unlinked successfully!</b>

cmd_unlink_not_found = ❌ <b>User not found!</b>

cmd_help_admin =
    This bot will monitor and notify GitHub activities within the FullstacksJS community.

    💡 Commands:

    <code>/help</code> - to see this help.
    <code>/listrepos</code> - see list of the monitored repositories.
    <code>/addrepo</code> - add an existing repository.
    <code>/removerepo</code> - remove a repository.
    <code>/link</code> - link telegram account to the github username.
    <code>/unlink</code> - unlink telegram account from github username.
    <code>/listcontributors</code> - see list of the monitored contributors.
    <code>/discover</code> - update the repository database.
    <code>/whoami</code> - show your GitHub account.
    <code>/mute</code> - mute github account.

cmd_help =
    This bot will monitor and notify GitHub activities within the FullstacksJS community.

    💡 Commands:

    <code>/help</code> - to see this help.
     <code>/listrepos</code> - see list of the monitored repositories.
     <code>/listcontributors</code> - see list of the monitored contributors.
     <code>/whoami</code> - show your GitHub account.

cmd_mute_help =
    ✍️ <code>/mute</code> Guide:

    Pass the GitHub username after the command.

    Pattern:
    — <code>/mute &lt;github-username&gt;</code>

    Example:
    — <code>/mute ASafaeirad</code>

cmd_mute_already = <b>{ $ghUsername }</b> has been muted already!

cmd_mute = 🔇 <b>User muted successfully!</b>

cmd_unmute_help =
    ✍️ <code>/unmute</code> Guide:

    Pass the GitHub username after the command.

    Pattern:
    — <code>/unmute &lt;github-username&gt;</code>

    Example:
    — <code>/unmute ASafaeirad</code>

cmd_unmute_already = <b>{ $ghUsername }</b> is not muted!

cmd_unmute = 🔊 <b>User unMuted successfully!</b>

# Events
e_issue_opened =
    🔘 Issue: <b>{ $issueTitle }</b>.

    👤 Author: <a href="{ $userUrl }">{ $user }</a> { $telegramStatus }

    — <a href="{ $issueUrl }">{ $issueUrl }</a>

    { $repoHashtag } #issue

e_pull_request_closed_merged =
    🌳 PR Merged!

    👤 Author: <a href="{ $userUrl }">{ $user }</a> { $telegramStatus }

    — <a href="{ $prUrl }">{ $prUrl }</a>

    { $repoHashtag } #pr

e_pull_request_opened =
    🌴 PR Created: <b>{ $prTitle }</b>

    👤 Author: <a href="{ $userUrl }">{ $user }</a> { $telegramStatus }!

    — <a href="{ $prUrl }">{ $prUrl }</a>

    { $repoHashtag } #pr

e_release_created =
    🚀 <b>{ $repoName }@{ $releaseTag }</b> is out!

    <a href="{ $releaseUrl }">View Release</a>

    { $repoHashtag } #release


e_release_created_with_notes =
    🚀 <b>{ $repoName }@{ $releaseTag }</b> is out!

    <b>Release notes</b>
    <blockquote>{ $notes }</blockquote>

    <a href="{ $releaseUrl }">View Release</a>

    { $repoHashtag } #release

e_repository_created =
    ✨ New repository!

    — <a href="{ $repoUrl }">{ $repoName }</a>

    { $repoHashtag } #new_repo

e_star_created =
    🌟 <a href="{ $userUrl }">{ $user }</a> { $telegramStatus } gave star number { $starNumber } to <a href="{ $repoUrl }">{ $repoName }</a>.

    { $repoHashtag } #star

e_issue_assigned =
    👥 Issue Assigned: <b>{ $issueTitle }</b>.

    👤 Assignee: <a href="{ $assigneeUrl }">{ $assignee }</a> { $telegramStatus }

    — <a href="{ $issueUrl }">{ $issueUrl }</a>

    { $repoHashtag } #assigned

e_project_item_status_changed =
    🔄 { $itemTypeIcon } { $itemType } status changed in { $repoName } / <b>{ $projectName }</b>.

    👤 User: <a href="{ $userUrl }">{ $user }</a> { $telegramStatus }
    📚 Item: <a href="{ $itemUrl }">{ $itemTitle }</a>
    👉 status: <b>{ $status }</b>

    { $repoHashtag } #project

e_comment_created =
    💬 <a href="{ $ghProfileUrl }">{ $commentAuthor }</a> { $telegramStatus } commented on <a href="{ $commentLink }">{ $repoName }#{ $number }</a>:

    <b>{ $title }</b>
    <blockquote>{ $commentPreview }</blockquote>

    { $repoHashtag } #{ $type }
