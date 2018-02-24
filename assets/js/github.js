(async (org_target, members_target) => {
  org_target.empty()
  members_target.empty()

  const org_response = await fetch('https://api.github.com/orgs/sprinqler', { cache: 'force-cache' })
  if (org_response.ok) {
    const org_json = await org_response.json()
    org_target.append(`
      <a class="statistic" href="https://github.com/Sprinqler">
        <div class="value">${org_json.public_repos}</div>
        <div class="label">Public ${org_json.public_repos - 1 ? "Repos" : "Repo"}</div>
      </a>
    `)
  } else {
    org_target.append(`
      <div class="ui error message">
        <i class="ban icon"></i>Failed to get the organization information.
      </div>
    `)
  }

  const members_response = await fetch('https://api.github.com/orgs/sprinqler/members', { cache: 'force-cache' })
  if (members_response.ok) {
    const members_json = await members_response.json()
    org_target.append(`
      <a class="statistic" href="https://github.com/orgs/Sprinqler/people">
        <div class="value">${members_json.length}</div>
        <div class="label">Public ${members_json.length - 1 ? "Members" : "Member"}</div>
      </a>
    `)
    members_json.forEach(async (member, index, array) => {
      const user_response = await fetch(`https://api.github.com/user/${member.id}`, { cache: 'force-cache' })
      const user_json = await user_response.json()
      const repos = user_json.public_repos
      const followers = user_json.followers
      members_target.append(`
        <a class="card" href="${user_json.html_url}" target="blank_" alt="${user_json.login}">
          <div class="image">
            <img class="card-img-top" src="${user_json.avatar_url}" alt="${user_json.login}">
          </div>
          <div class="content">
            <span class="header">${user_json.name || user_json.login}</span>
            <div class="meta">
              <span>${user_json.login}</span>
            </div>
            <div class="description">${user_json.bio || ""}</div>
          </div>
          <div class="extra content">
            <span>
              <i class="list icon"></i>${repos} ${repos - 1 ? "Repos" : "Repo"}
            </span>
            <span class="right floated">
              <i class="user icon"></i>${followers} ${followers - 1 ? "Followers" : "Follower"}
            </span>
          </div>
        </a>
      `)
    })
  } else {
    members_target.append(`
      <div class="ui error message">
        <i class="ban icon"></i>Failed to get members information.
      </div>
    `)
  }
})($('#org-container'), $('#members-container'))
