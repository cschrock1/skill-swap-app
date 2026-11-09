<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Welcome, {{ user.name }}!</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>

    <div class="dashboard-grid">
      <!-- User Profile Card -->
      <div class="card profile-card">
        <h3>My Profile</h3>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Location:</strong> {{ user.location || 'Not specified' }}</p>
        <p><strong>Bio:</strong> {{ user.bio || 'No bio provided yet.' }}</p>
      </div>

      <!-- Create Listing Card -->
      <div class="card listing-form-card">
        <h3>Post a Skill Listing</h3>
        <form @submit.prevent="createListing">
          <div class="form-group">
            <label>Skill Title:</label>
            <input type="text" v-model="title" placeholder="e.g., Advanced JavaScript or Spanish Conversation" required />
          </div>
          <div class="form-group">
            <label>Category:</label>
            <input type="text" v-model="category" placeholder="e.g., Technology, Languages, Music" required />
          </div>
          <div class="form-group">
            <label>Listing Type:</label>
            <select v-model="listingType" required>
              <option value="Teach">I can Teach this</option>
              <option value="Learn">I want to Learn this</option>
            </select>
          </div>
          <div class="form-group">
            <label>Description:</label>
            <textarea v-model="description" placeholder="Describe your experience or what you are looking for..." required></textarea>
          </div>
          <button type="submit" class="submit-btn">Publish Listing</button>
          <p v-if="message" class="success-msg">{{ message }}</p>
          <p v-if="error" class="error-msg">{{ error }}</p>
        </form>
      </div>
    </div>

    <!-- Explore All Listings Section -->
    <div class="card listings-feed">
      <h3>Community Skill Listings</h3>
      <div v-if="listings.length === 0" class="no-listings">No listings posted yet. Be the first!</div>
      <div class="listings-grid">
        <div v-for="listing in listings" :key="listing.id" class="listing-item" :class="listing.listingType.toLowerCase()">
          <span class="badge" :class="listing.listingType.toLowerCase()">{{ listing.listingType }}</span>
          <h4>{{ listing.title }}</h4>
          <p class="category"><strong>Category:</strong> {{ listing.category }}</p>
          <p>{{ listing.description }}</p>
          <p class="author">Posted by: {{ listing.User?.name || 'User' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const user = ref({})
    const listings = ref([])
    const title = ref('')
    const category = ref('')
    const listingType = ref('Teach')
    const description = ref('')
    const message = ref('')
    const error = ref('')
    const router = useRouter()

    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings')
        listings.value = res.data
      } catch (err) {
        console.error('Failed to fetch listings', err)
      }
    }

    onMounted(() => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      fetchListings()
    })

    const createListing = async () => {
      error.value = ''
      message.value = ''
      try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:5000/api/listings', {
          title: title.value,
          category: category.value,
          listingType: listingType.value,
          description: description.value
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        message.value = 'Listing posted successfully!'
        title.value = ''
        category.value = ''
        description.value = ''
        fetchListings()
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to create listing'
      }
    }

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    return { user, listings, title, category, listingType, description, message, error, createListing, logout }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.logout-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 0.9em;
}
.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.success-msg { color: green; margin-top: 10px; }
.error-msg { color: red; margin-top: 10px; }

.listings-feed {
  margin-top: 20px;
}
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  margin-top: 15px;
}
.listing-item {
  background: #fdfdfd;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  position: relative;
}
.badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 3px 8px;
  font-size: 0.75em;
  font-weight: bold;
  border-radius: 4px;
  color: white;
}
.badge.teach { background-color: #007bff; }
.badge.learn { background-color: #ffc107; color: #333; }
.author { font-size: 0.85em; color: #666; margin-top: 10px; }
</style>
