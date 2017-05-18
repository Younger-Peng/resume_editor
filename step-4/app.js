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
    actionType: 'logIn',
    formData: {
      username: '',
      password: ''
    },
    currentUser: null
  },
  created: function(){
    this.currentUser = this.getCurrentUser() || null;
    this.fetchTodos()
  },
  methods: {
    fetchTodos: function(){
      if(this.currentUser){
        var query = new AV.Query('AllTodos');
        query.find()
          .then((todos) => {
            let avAllTodos = todos[0];
            let id = avAllTodos.id
            this.todoList = JSON.parse(avAllTodos.attributes.content);
            this.todoList.id = id;
          }, function(error){
            console.error(error);
          })
      }
  },
    updateTodos: function(){
      let dataString = JSON.stringify(this.todoList);
      let avTodos = AV.Object.createWithoutData('AllTodos',this.todoList.id);
      avTodos.set('content',dataString);
      avTodos.save().then(() => {
        console.log('更新成功')
      })
    },
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList);
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      var acl = new AV.ACL();
      acl.setReadAccess(AV.User.current(), true)
      acl.setWriteAccess(AV.User.current(), true)
      avTodos.set('content',dataString);
      avTodos.setACL(acl);
      avTodos.save().then((todo) => {
        this.todoList.id = todo.id
        console.log('保存成功')
      }, function(error){
        console.log('保存失败')
      })
    },
    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos();
      }
    },
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createAt: new Date(),
        done: false
      })
      this.newTodo = ''
      this.saveOrUpdateTodos();
    },
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
      this.saveOrUpdateTodos() //不能用saveTodos了
    },
    signUp: function(){
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser
      }, (error) => {
        console.log('注册失败')
      })
    },
    logIn: function(){
      AV.User.logIn(this.formData.username,this.formData.password)
        .then((loginedUser) => {
          this.currentUser = this.getCurrentUser();
          this.fetchTodos()
        }, (error) => {
          console.log('登录失败')
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