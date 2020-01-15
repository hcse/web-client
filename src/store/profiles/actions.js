export const connectProfileApi = async function ({ commit }) {
  await this.$ppp.authApi().signIn()
  localStorage.setItem('profileApiConnected', true)
  commit('setConnected', true)
}

export const getProfile = async function () {
  const profile = await this.$ppp.profileApi().getProfile('BASE_AND_APP')
  if (!profile) return null
  if (profile.publicData.avatar) {
    profile.publicData.avatar = await this.$ppp.profileApi().getImageUrl(profile.publicData.avatar, profile.publicData.s3Identity)
  }
  if (profile.publicData.cover) {
    profile.publicData.cover = await this.$ppp.profileApi().getImageUrl(profile.publicData.cover, profile.publicData.s3Identity)
  }
  return profile
}

export const getPublicProfile = async function (context, username) {
  const profile = (await this.$ppp.profileApi().getProfiles([username]))[username]
  if (!profile) return null
  if (profile.publicData.avatar) {
    profile.publicData.avatar = await this.$ppp.profileApi().getImageUrl(profile.publicData.avatar, profile.publicData.s3Identity)
  }
  if (profile.publicData.cover) {
    profile.publicData.cover = await this.$ppp.profileApi().getImageUrl(profile.publicData.cover, profile.publicData.s3Identity)
  }
  return profile
}

export const getTokensAmounts = async function (context, account) {
  const tokens = {
    hvoice: 0,
    hypha: 0,
    seeds: 0
  }

  let result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: account,
    table: 'voters'
  })

  if (result && result.rows) {
    const row = result.rows.find(r => /HVOICE$/.test(r.liquid))
    if (row) {
      tokens.hvoice = parseFloat(row.liquid).toFixed(2)
    }
  }

  result = await this.$api.getTableRows({
    code: 'hyphatokens1',
    scope: account,
    table: 'accounts'
  })

  if (result && result.rows) {
    let row = result.rows.find(r => /HYPHA$/.test(r.balance))
    if (row) {
      tokens.hypha = parseInt(row.balance)
    }
    row = result.rows.find(r => /SEEDS$/.test(r.balance))
    if (row) {
      tokens.seeds = parseFloat(row.balance).toFixed(8)
    }
  }

  return tokens
}

export const saveProfile = async function ({ state, dispatch }, { mainForm, aboutForm, detailsForm }) {
  if (!state.connected) {
    await dispatch('connectProfileApi')
  }
  let s3Identity
  if (mainForm.avatarFile) {
    mainForm.avatar = await this.$ppp.profileApi().uploadImage(mainForm.avatarFile)
    s3Identity = (await this.$ppp.authApi().userInfo()).id
  }
  if (detailsForm.coverFile) {
    detailsForm.cover = await this.$ppp.profileApi().uploadImage(detailsForm.coverFile)
    s3Identity = (await this.$ppp.authApi().userInfo()).id
  }
  await this.$ppp.profileApi().register({
    emailAddress: mainForm.email,
    smsNumber: mainForm.phoneNumber,
    commPref: mainForm.contactMethod,
    publicData: {
      name: mainForm.name,
      timeZone: detailsForm.timeZone,
      avatar: mainForm.avatar,
      cover: detailsForm.cover,
      s3Identity,
      tags: detailsForm.tags,
      bio: aboutForm.bio,
      customFields: detailsForm.customFields
    }
  })
}
