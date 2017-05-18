import bar from './bar';
import Vue from 'vue'
import './app.less'
var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: []
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