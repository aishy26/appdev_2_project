export default{
   template:
   `<div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
    <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:200px ; width:380px ; margin:auto" >
      <div>
        <label>Name</label>
        <input type="text" name="name" id="a" v-model="resource.name" required>
      </div>
      <div>
        <button class="btn btn-success" @click="updateCategory()">Save</button>
      </div>
    </div>
      <div style="text-align:right"><button class="btn btn-success" @click="back()">  Return to categories</button></div>
   </div>
   </div>`,
   props: {id: {
      required: true,
      type: Number,
    }
   },
   data(){
    return{
      resource:{
         name: null,
      },
      token: localStorage.getItem('auth-token'),
      category_id: this.$route.params.category_id
      
    }
  },
  methods:{
    
    async updateCategory(id) {
       const res= await fetch (`/api/category/${this.id}/edit`, {
         method:'PUT',
         headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json",
         },
         body:JSON.stringify(this.resource),
      })
       const data= await res.json()
       if(res.ok){
         alert(data.message)
         this.$router.go(0)
      }
    },
    back(){
       this.$router.push('/category')
    }
    
  },
  
}
 
