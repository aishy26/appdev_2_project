export default{
  template: `<div style="background-color:#FFFDD0 ; height:100% ; min-width:100%">
   <label>Click YES to confirm</label>
     <button  class="btn btn-success" @click="categorydelete()">Delete</button>
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
       category_id: this.$route.params.product_id
      
    }
  },
  methods:{
    async categorydelete(id) {
       const res= await fetch (`/api/category/${this.id}/delete`, {
         method:'DELETE',
         headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json",
         },
         body:JSON.stringify(this.resource),
      })
       const data= await res.json()
       if(res.ok){
         alert(data.message)
         this.$router.push('/')
       }
    },
  },
 }
