import io from 'socket.io-client'
import Vue from 'vue'
import store from './store'
import router from './router'

// Socket connection to the backend
const socket = io(process.env.VUE_APP_WEBSOCKET_URI, {
  autoConnect: false,
  query: {
    token: store.state.connection.connected ? store.state.connection.token : ''
  }
})

// Clear all values in local storage and go to the login page
// At login screen the form gets not autofilled.
const logout = () => {
  store.dispatch('clearConnection')

  router.push({name: 'login'})
}

// Clear only the connection values in local storage and go to login page.
// At login screen the form gets autofilled.
const resetConnection = () => {
  store.commit('isConnected', false)
  store.commit('setServerId', undefined)

  router.push({name: 'login'})
}

// When a connection error occurs logout and redirect to login page
const handleSocketError = err => {
  Vue.prototype.$toast.error(err.message, {
    timeout: 0,
    dismissable: false,
    queueable: true, // toast is not getting overwritten
    icon: 'error_outline'
  })

  resetConnection()
}

const handleTeamSpeakError = message => {
  Vue.prototype.$toast.error(message)

  logout()
}

// Register socket.io events
socket.on('reconnect', () => {
  Vue.prototype.$toast.clearQueue()

  let currentToast = Vue.prototype.$toast.getCmp()

  if(currentToast) currentToast.close() // Removes the error toast
})

socket.on('disconnect', resetConnection)
socket.on('error', handleSocketError)
socket.on('connect_error', handleSocketError)
socket.on('teamspeak-error', handleTeamSpeakError)

export default socket
