import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
	state: {
		// 菜单列表
		menuList: [],
		// 权限列表
		permList: [],
		// 是否已经加载过路由
		hasRoutes: false,
		// 可编辑的标签页
		editableTabsValue: 'Index',
		editableTabs: [{
			title: '首页',
			name: 'Index',
		}],
		currentPage:{
			title: '首页',
		}
	},
	mutations: {
		setMenuList(state, menus) {
			state.menuList = menus
		},
		setPermList(state, perms) {
			state.permList = perms
		},
		changeRouteStatus(state, hasRoutes) {
			state.hasRoutes = hasRoutes
		},

		addTab(state, tab) {

			let index = state.editableTabs.findIndex(e => e.name === tab.name)

			if (index === -1) {
				state.editableTabs.push({
					title: tab.title,
					name: tab.name,
				});
			}

			state.editableTabsValue = tab.name;
			state.currentPage = tab
		},

		resetState: (state) => {
			state.menuList = []
			state.permList = []

			state.hasRoutes = false
			state.editableTabsValue = 'Index'
			state.editableTabs = [{
				title: '首页',
				name: 'Index',
			}]
		}

	},
	actions: {
	},

}