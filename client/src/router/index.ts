import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/movies',
      name: 'profile-movies',
      component: () => import('@/views/SwipedMoviesList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/FriendsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/friends/requests',
      name: 'friends-requests',
      component: () => import('@/views/FriendRequestsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/friends/search',
      name: 'friends-search',
      component: () => import('@/views/FriendSearchView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('@/views/FeedView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/parties',
      name: 'parties',
      component: () => import('@/views/PartiesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/parties/:id',
      name: 'parties-party',
      component: () => import('@/views/PartyView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/parties/:id/invite',
      name: 'parties-party-invite',
      component: () => import('@/views/PartyInviteView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: 'feed' }
  }
})

export default router
