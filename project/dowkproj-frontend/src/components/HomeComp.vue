<script setup>
import { ref, onMounted } from '@vue/runtime-core'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const imgFetchErr = ref('')
const imgUrl = ref('')
const todoList = ref([])
const todoListFetchErr = ref('')
const newTodoField = ref('')
const todoAddErr = ref('')

const fetchImgFromAPI = async () => {
  try {
    const img = await axios.get(backendUrl + "/dailyimg", {
      responseType: "blob",
    })
    imgUrl.value = URL.createObjectURL(img.data)
    imgFetchErr.value = ''
  } catch (err) {
    imgFetchErr.value = 'Error fetching daily image.'
    console.log(err)
  }
}

const fetchTodosFromApi = async () => {
  try {
    const res = await axios.get(backendUrl + '/todos', {
      responseType: 'json'
    })
    todoList.value = res.data
    todoListFetchErr.value = ''
  } catch (err) {
    todoListFetchErr.value = 'Error fetching todo list.'
    console.log(err)
  }
}

const addTodo = async () => {
  try {
    const res = await axios.post(backendUrl + "/todos", { content: newTodoField.value })
    todoList.value.push(res.data)
    todoAddErr.value = ''
  } catch (err) {
    todoAddErr.value = 'Error adding new todo!'
  }
  newTodoField.value = ''
}

onMounted(async () => {
  fetchImgFromAPI()
  fetchTodosFromApi()
})

</script>

<template>
  <div>
    Below is the daily picture:
    <img class="dailyimg" :src="imgUrl">
    <p class="errorText" v-if="imgFetchErr">{{ imgFetchErr }}</p>

    <p>Add a new todo with this form:</p>
    <form @submit.prevent="addTodo" class="todoform">
      <input type="text" v-model="newTodoField">
      <input type="submit" value="Submit new todo!">
    </form>
    <p class="errorText" v-if="todoAddErr">{{ todoAddErr }}</p>

    <p>Existing todos:</p>
    <p class="errorText" v-if="todoListFetchErr">{{ todoListFetchErr }}</p>
    <ul>
      <li v-for="todo in todoList" :key="todo.id">
        {{ todo.content }} -- Created on {{ todo.date }}
      </li>
      <p v-if="todoList.length == 0">No existing todos!</p>
    </ul>
  </div>
</template>

<style>
.dailyimg {
  height: 100%;
  max-height: 600px;
}
.errorText {
  color: red;
}
</style>