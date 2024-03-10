export default  {
  template:`
  <div class='d-flex justify-content-center' style="margin-top:20vh ; background-color:#FFFDD0 ; height:90% ; min-width:90%">
   <div style="background-color:#FFD580; padding: 80px; border-radius: 15px; height:300px" >
     <div class='text-danger'>{{error}}</div>
     <label for="username" class="form-label">Username</label>
     <input type="text" class="form-control" id="username" v-model="cred.username">
     <label for="password" class="form-label">Password</label>
     <input type="password" class="form-control" id="password" v-model="cred.password">
     <button class="btn btn-primary mt-3" @click='login'>Login</button>
    </div>
  </div>`
  ,
  data(){
    return{
      cred:{
         username: null,
         password: null,
      },
      error: null
    }
  },
  methods:{
    async login() {
      const res= await fetch('/user_login' , {
         method: 'POST',
         headers: {
           "Content-Type":"application/json"
        },
        body: JSON.stringify(this.cred),
      })
      const data= await res.json()     
      if(res.ok){
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('roles', data.roles)
        localStorage.setItem('user_id', data.user_id)
        this.$router.push({path:'/', query:{role: data.roles}})
      }else {
        this.error=data.message
      }
    },
  },
}
