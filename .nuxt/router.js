'use strict'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const _8733e902 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\index.vue') : require('G:\\work\\csc\\pages\\index.vue')

const _1e021f82 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\csc\\home.vue') : require('G:\\work\\csc\\pages\\csc\\home.vue')

const _420f6f63 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\csc\\home\\index.vue') : require('G:\\work\\csc\\pages\\csc\\home\\index.vue')

const _4b3c33ce = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\csc\\home\\myResource.vue') : require('G:\\work\\csc\\pages\\csc\\home\\myResource.vue')

const _23d5dbc0 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\csc\\home\\allResource.vue') : require('G:\\work\\csc\\pages\\csc\\home\\allResource.vue')

const _4cc3fe39 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\csc\\login.vue') : require('G:\\work\\csc\\pages\\csc\\login.vue')

const _06a23cb2 = process.BROWSER_BUILD ? () => System.import('G:\\work\\csc\\pages\\_id.vue') : require('G:\\work\\csc\\pages\\_id.vue')



const scrollBehavior = (to, from, savedPosition) => {
  // savedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // if no children detected
    if (to.matched.length < 2) {
      // scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // if one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // if link has anchor,  scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export default new Router({
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  scrollBehavior,
  routes: [
		{
			path: "/",
			component: _8733e902,
			name: "index"
		},
		{
			path: "/csc/home",
			component: _1e021f82,
			children: [
				{
					path: "",
					component: _420f6f63,
					name: "csc-home"
				},
				{
					path: "myResource",
					component: _4b3c33ce,
					name: "csc-home-myResource"
				},
				{
					path: "allResource",
					component: _23d5dbc0,
					name: "csc-home-allResource"
				}
			]
		},
		{
			path: "/csc/login",
			component: _4cc3fe39,
			name: "csc-login"
		},
		{
			path: "/:id",
			component: _06a23cb2,
			name: "id"
		}
  ]
})
