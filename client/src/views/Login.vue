<template>
  <div class="auth-container">
    <h2>Login to Skill Swap</h2>
    <form @submit.prevent="handleLogin">
      <div><label>Email:</label><input type="email" v-model="email" required /></div>
      <div><label>Password:</label><input type="password" v-model="password" required /></div>
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()
    const handleLogin = async () => {
      try {
        const res = await axios.post('https://skill-swap-app-3is6.onrender.com/api/auth/login', { email: email.value, password: password.value })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        router.push('/dashboard')
      } catch (err) {
        error.value = err.response?.data?.message || 'Invalid email or password'
      }
    }
    return { email, password, error, handleLogin }
  }
}
</script>
<style scoped>
.auth-container { max-width: 400px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.auth-container div { margin-bottom: 15px; }
.auth-container label { display: block; margin-bottom: 5px; }
.auth-container input { width: 100%; padding: 8px; box-sizing: border-box; }
.error { color: red; font-size: 0.9em; }
</style>
