export default{
  template: `<div style="background-color:#FFFDD0 ; height:100% ; min-width:100%">
   <label>Click YES to confirm</label>
     <button  class="btn btn-success" @click="productdelete()">Delete</button>
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
         manufacture_date: null,
         expiry_date: null,
         rate: null,
         unit: null,
         quantity: null,
         category_id:null,
         image:null
       },
       token: localStorage.getItem('auth-token'),
       product_id: this.$route.params.product_id
      
    }
  },
  methods:{
    async productdelete(id) {
       const res= await fetch (`/api/products/delete/${this.id}`, {
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
         this.$router.push('/category')
       }
    },
  },
 }
  
