<template>
  <div class="auth-container">
    <h2>Join Skill Swap</h2>
    <form @submit.prevent="handleRegister">
      <div><label>Name:</label><input type="text" v-model="name" required /></div>
      <div><label>Email:</label><input type="email" v-model="email" required /></div>
      <div><label>Password:</label><input type="password" v-model="password" required /></div>
      <div><label>Bio:</label><textarea v-model="bio"></textarea></div>
      <div><label>Location:</label><input type="text" v-model="location" /></div>
      <button type="submit">Register</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
export default {
  setup() {
    const name = ref(''); const email = ref(''); const password = ref(''); const bio = ref(''); const location = ref(''); const error = ref('')
    const router = useRouter()
    const handleRegister = async () => {
      try {
        const res = await axios.post('https://skill-swap-app-3is6.onrender.com/api/auth/register', { name: name.value, email: email.value, password: password.value, bio: bio.value, location: location.value })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        router.push('/dashboard')
      } catch (err) {
        error.value = err.response?.data?.message || 'Registration failed'
      }
    }
    return { name, email, password, bio, location, error, handleRegister }
  }
}
</script>
