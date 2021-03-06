<script>
import { mapActions, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import MarkdownDisplay from '~/components/form/markdown-display'
import VotesDetails from '~/components/documents-parts/votes-details'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'

export default {
  name: 'payout-view',
  mixins: [documents, format],
  components: { MarkdownDisplay, RawDisplayIcon, VoteYesNoAbstain, VotesDetails },
  props: {
    payout: { type: Object }
  },
  data () {
    return {
      profile: null
    }
  },
  computed: {
    ballotId () {
      return this.getValue(this.payout, 'system', 'ballot_id')
    },
    title () {
      return this.getValue(this.payout, 'details', 'title')
    },
    url () {
      return this.getValue(this.payout, 'details', 'url')
    },
    recipient () {
      return this.getValue(this.payout, 'details', 'recipient')
    },
    description () {
      return this.getValue(this.payout, 'details', 'description')
    },
    tokenHvoice () {
      const amount = parseFloat(this.getValue(this.payout, 'details', 'hvoice_amount'))
      return this.toAsset(amount || 0)
    },
    tokenHusd () {
      const amount = parseFloat(this.getValue(this.payout, 'details', 'hypha_amount'))
      return this.toAsset(amount || 0)
    },
    tokenHypha () {
      const amount = parseFloat(this.getValue(this.payout, 'details', 'husd_amount'))
      return this.toAsset(amount || 0)
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapActions('profiles', ['getPublicProfile']),
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  },
  watch: {
    recipient: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }} ({{ (profile && profile.publicData && profile.publicData.name) || `@${recipient}` }})
    raw-display-icon(:document="payout")
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Payout
    p Fields below display the payout for this contribution as well as % deferred salary. The payout is shown as USD equivalent and the corresponding amounts received in SEEDS, HVOICE, HYPHA and HUSD.
    .row.q-my-sm
      strong SALARY CALCULATION
    .row.q-col-gutter-xs
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHusd"
          outlined
          dense
          readonly
        )
        .hint HUSD
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHvoice"
          outlined
          dense
          readonly
        )
        .hint HVOICE
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHypha"
          outlined
          dense
          readonly
        )
        .hint HYPHA
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for this proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="recipient" :hash="this.payout.hash")
  votes-details(v-if="ballotId" :ballotId="ballotId" :size="5")
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.vote-bar
  opacity 1
.vote-text
  font-weight 600
.proposal-actions
  button
    width 100px
</style>
