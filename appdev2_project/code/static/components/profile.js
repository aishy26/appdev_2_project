export default{
 template:`
    <div style="background-color:#FFFDD0 ; height:100% ; min-width:90%">
     <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:300px ; width:380px ; margin:auto" >
       <div>
          <label>Name</label>
          <input type="text" name="name" v-model="resource.name" id="name" required>
       </div>     
       <div>
          <label>Address</label>
          <input type="text" name="address" v-model="resource.address" id="address" required>
       </div>
       <div>
          <button class="btn btn-success" @click="update()">Update</button> <button  class="btn btn-success" @click="password()">Change Password</button>
       </div>
     </div>
     <div style="text-align:right" ><button class="btn btn-success" @click="home()"> Return Home</button></div>
   </div>`,
 
 data(){
    return{
      resource:{
         name:null,
         address:null,
          
       },
       token:localStorage.getItem('auth-token'),
       user_id:localStorage.getItem('user_id'),
    }
  },
  methods:{
     async update(user_id){
       const res = await fetch (`/profile/${this.user_id}`, {
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
     password(){
        this.$router.push(`/password/${this.user_id}`)
     },
     home(){
        this.$router.push('/')
     }
  },
  
 }
