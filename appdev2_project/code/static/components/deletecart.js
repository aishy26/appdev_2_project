export default{
  template: `<div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
   <label>Click YES to confirm</label>
     <button  class="btn btn-success" @click="cartdelete()">Delete</button>
   </div>`,
   props: {id: {
      required: true,
      type: Number,
    }
   },
   data(){
    return{
       resource:{
         c_user_id: null,
         c_product_id: null,
         c_category_id: null,
         name: null,
         quantity: null,
         price:null,
         total:null
       },
       token: localStorage.getItem('auth-token'),
       product_id: this.$route.params.product_id,
       user_id: localStorage.getItem('user_id'),
      
    }
  },
  methods:{
    async cartdelete(id) {
       const res= await fetch (`/cart/${this.id}/delete`, {
         method:'DELETE',
         headers:{
            "Authentication-Token":this.token,
            "Content-Type":"application/json",
         },
         body:JSON.stringify(this.resource),
      })
       const data= await res.json().catch((e) => {})
       if(res.ok){
         alert(data.message)
         this.$router.push(`/category/cart/products/${this.user_id}`)
       }
    },
  },
 }
  
