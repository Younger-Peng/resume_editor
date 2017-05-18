import Vue from 'vue'
import './app.less'
import AV from 'leancloud-storage'

var APP_ID = 'tNI7uBDuXYQPF3dBt0dtviNP-gzGzoHsz';
var APP_KEY = 'VLETYly8NAsOk7hM3DrFraJg';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})
var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!'
}).then(function(object){
  alert('LeanCloud Rocks!')
})

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',
    formData: {
      username: '',
      password: ''
    }
  },
  created: function(){
    window.onbeforeunload = () => {
      let newTodoString = JSON.stringify(this.newTodo)
      let todoListString = JSON.stringify(this.todoList);
      window.localStorage.setItem('myTodos',todoListString);
      window.localStorage.setItem('lastTodo',newTodoString)
    }
    let oldTodoListString = window.localStorage.getItem('myTodos')
    let lastTodoString = window.localStorage.getItem('lastTodo')
    let oldData = JSON.parse(oldTodoListString)
    let lastTodo = JSON.parse(lastTodoString)
    this.todoList = oldData || [];
    this.newTodo = lastTodo || '';
  },
  methods: {
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createAt: new Date(),
        done: false
      })
      this.newTodo = ''
    },
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
    }
  }
})