<script>
import { mapGetters, mapMutations } from 'vuex'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'
import RoleForm from '~/pages/roles/components/role-form'
import RoleProposalView from '~/pages/roles/components/role-proposal-view'
import RoleView from '~/pages/roles/components/role-view'
import AssignmentForm from '~/pages/assignments/components/assignment-form'
import AssignmentProposalView from '~/pages/assignments/components/assignment-proposal-view'
import AssignmentView from '~/pages/assignments/components/assignment-view'
import ProfileForm from '~/pages/profiles/edit/profile-edit'
import PayoutForm from '~/pages/payouts/components/payout-form'
import PayoutProposalView from '~/pages/payouts/components/payout-proposal-view'
import PayoutView from '~/pages/payouts/components/payout-view'
import ProfileRequired from '~/pages/profiles/components/profile-required-side'
import BadgeForm from '~/pages/badges/components/badge-form'
import BadgeProposalView from '~/pages/badges/components/badge-proposal-view'
import BadgeView from '~/pages/badges/components/badge-view'
import BadgeAssignmentForm from '~/pages/badges/components/badge-assignment-form'
import BadgeAssignmentProposalView from '~/pages/badges/components/badge-assignment-proposal-view'

export default {
  name: 'right-sidebar',
  components: {
    RightMenuNotifications,
    RoleForm,
    RoleProposalView,
    RoleView,
    AssignmentForm,
    AssignmentProposalView,
    AssignmentView,
    ProfileForm,
    PayoutForm,
    PayoutProposalView,
    PayoutView,
    ProfileRequired,
    BadgeForm,
    BadgeProposalView,
    BadgeView,
    BadgeAssignmentForm,
    BadgeAssignmentProposalView
  },
  data () {
    return {
      display: false
    }
  },
  computed: {
    ...mapGetters('layout', ['isShowRightSidebar', 'rightSidebarType', 'contentData'])
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar'])
  },
  watch: {
    isShowRightSidebar: {
      immediate: true,
      handler (val) {
        this.display = val
      }
    }
  }
}
</script>

<template lang="pug">
q-drawer(
  v-model="display"
  side="right"
  overlay
  bordered
  :width="$q.platform.is.desktop ? 500 : '100%'"
  behavior="mobile"
  @hide="setShowRightSidebar(false)"
  no-swipe-close
  no-swipe-open
)
  right-menu-notifications(v-show="rightSidebarType === 'notifications'")
  role-form(
    v-if="rightSidebarType === 'roleForm'"
    :draft="contentData"
  )
  role-proposal-view(
    v-if="rightSidebarType === 'roleProposalView'"
    :proposal="contentData"
  )
  role-view(
    v-if="rightSidebarType === 'roleView'"
    :role="contentData"
  )
  assignment-form(
    v-if="rightSidebarType === 'assignmentForm'"
    :draft="contentData"
  )
  assignment-proposal-view(
    v-if="rightSidebarType === 'assignmentProposalView'"
    :proposal="contentData"
  )
  assignment-view(
    v-if="rightSidebarType === 'assignmentView'"
    :assignment="contentData"
  )
  profile-form(v-if="rightSidebarType === 'profileForm'")
  payout-form(
    v-if="rightSidebarType === 'payoutForm'"
    :draft="contentData"
  )
  payout-proposal-view(
    v-if="rightSidebarType === 'payoutProposalView'"
    :proposal="contentData"
  )
  payout-view(
    v-if="rightSidebarType === 'payoutView'"
    :payout="contentData"
  )
  profile-required(
    v-if="rightSidebarType === 'profileRequired'"
  )
  badge-form(
    v-if="rightSidebarType === 'badgeForm'"
    :draft="contentData"
  )
  badge-proposal-view(
    v-if="rightSidebarType === 'badgeProposalView'"
    :proposal="contentData"
  )
  badge-view(
    v-if="rightSidebarType === 'badgeView'"
    :badge="contentData"
  )
  badge-assignment-form(
    v-if="rightSidebarType === 'badgeAssignmentForm'"
    :draft="contentData"
  )
  badge-assignment-proposal-view(
    v-if="rightSidebarType === 'badgeAssignmentProposalView'"
    :proposal="contentData"
  )
</template>

<style lang="stylus" scoped>

</style>
