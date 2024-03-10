export default{
  template:`
  <div class='d-flex justify-content-center' style="margin-top:20vh ; background-color:#FFFDD0 ; height:90% ; min-width:90%">
  <div style="background-color:#FFD580; padding: 80px; border-radius: 15px; height:600px" >
     <label for="name" class="form-label">Name</label>
     <input type="text" class="form-control" id="name" v-model="reg.name">
     <label for="username" class="form-label">Username</label>
     <input type="text" class="form-control" id="username" v-model="reg.username">
     <label for="email" class="form-label">Email</label>
     <input type="email" class="form-control" id="email" v-model="reg.email">
     <label for="password" class="form-label">Password</label>
     <input type="password"  id="password" class="form-control" v-model="reg.password">
     <label for="address" class="form-label">Address</label>
     <input type="text" class="form-control" id="address" v-model="reg.address">
     <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="user" id="role" value="user" v-model="reg.role">
        <label class="form-check-label" for="user">User</label>
     </div>
     <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="store_manager" id="role" value="store_manager" v-model="reg.role">
        <label class="form-check-label" for="store_manager">Store Manager</label>
     </div>
     <button class="btn btn-primary mt-3" @click='save'>Save</button>
   </div>
  </div>`
  ,
  data(){
    return{
      reg:{
         name:null,
         username: null,
         email:null,
         password: null,
         address:null,
         role:null
      },
    }
  },
  methods:{
    async save() {
      const res= await fetch('/create_user' , {
        method: 'POST', 
        headers: {
           "Content-Type":"application/json"
        },
        body: JSON.stringify(this.reg),
      })
      const data= await res.json().catch((e) => {})   
      if(res.ok){
         alert(data.message)
         this.$router.push({path:'/login'})
      }
    },
  },
}
