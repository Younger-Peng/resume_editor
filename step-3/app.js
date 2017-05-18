import Vue from 'vue'
import './app.less'
import AV from 'leancloud-storage'

var APP_ID = 'tNI7uBDuXYQPF3dBt0dtviNP-gzGzoHsz';
var APP_KEY = 'VLETYly8NAsOk7hM3DrFraJg';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
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
    },
    currentUser: null
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
    this.currentUser = this.getCurrentUser() || null;
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
    },
    signUp: function(){
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser
      }, (error) => {
        alert('注册失败')
      })
    },
    logIn: function(){
      AV.User.logIn(this.formData.username,this.formData.password)
        .then((loginedUser) => {
          this.currentUser = this.getCurrentUser();
        }, (error) => {
          alert('登录失败')
        })
    },
    getCurrentUser: function(){
      if(AV.User.current()){
        let {id,createAt,attributes:{username}} = AV.User.current()
        return {id,username,createAt}
      }else {
        return undefined
      }
    },
    logout: function(){
      AV.User.logOut();
      this.currentUser = null
      window.location.reload()
    }
  }


})