export default{
  template:`<div style="background-color:#FFFDD0 ; height:100% ; min-width:100%">
  <div v-if="error">{{error}}</div>
  <div class=" container table-responsive" style="background-color:#FFD580 ; overflow-x:auto;">
   <table class="table table-bordered">
   <tr>
     <th style="width:150px ;text-align:center">User Email</th>
     <th style="width:150px; text-align:center">Approve</th>
   </tr>
   <tr v-for="(user,index) in all_users">
     <td style="text-align:center">{{ user.email }} </td>
     <td style="text-align:center"><button class="btn btn-primary" v-if="!user.active" @click="approve(user.user_id)"> Approve </button></td>
   </tr>
  </div.
  </div>`,
  data(){
    return{
       all_users:[],
       token:localStorage.getItem('auth-token'),
       error:null,
    }
  },
  methods:{
     async approve(id){
       const res = await fetch (`/activate/user/${id}`, {
          headers:{   
             "Authentication-Token": this.token,
          },
        })
        const data= await res.json().catch((e) => {})
        if(res.ok){
           alert(data.message)
           this.$router.push('/')
        }
     },
  },
  async mounted(){
    const res = await fetch ("/user_list", {
      headers:{   
         "Authentication-Token": this.token,
      },
   })   
    const data= await res.json().catch((e) => {})
    if(res.ok){
      this.all_users= data
    }else{
        this.error= res.status
      
    }
  },
 }

