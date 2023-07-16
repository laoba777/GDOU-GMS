import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
	state: {
        orderForm: {},
		
	},
	mutations: {
		setOrderForm(state, orderForm1) {
			state.orderForm = orderForm1
		},
		

	},
	actions: {
	},

}