export default{
  template:`<div style="background-color:#FFFDD0 ; height:100% ; min-width:90%">
    <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:200px ; width:380px ; margin:auto" >
      <div>
          <label>Change Password</label>
          <input type="password" name="password" v-model="resource.password"  id="b" required>
       </div>
       <div>
          <button class="btn btn-success" @click="update()"> Update Password</button>
       </div>
    </div>
  </div>`,
  data(){
    return{
      resource:{
         password:null,
          
       },
       token:localStorage.getItem('auth-token'),
       user_id:localStorage.getItem('user_id'),
    }
  },
  methods:{
     async update(user_id){
       const res = await fetch (`/password/${this.user_id}`, {
          method:'PUT',
          headers:{   
             "Authentication-Token": this.token,
             "Content-Type":"application/json"
          },
          body:JSON.stringify(this.resource),
        })
        const data= await res.json().catch((e) => {})
        if(res.ok){
           alert(data.message)
           this.$router.push('/')
        }
     },
   }
 }
