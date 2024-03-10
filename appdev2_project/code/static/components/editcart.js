export default{
  template:`<div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
    <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:400px ; width:400px ; margin:auto" >
        <div>
         <div>
           <p>{{carts.name}}</p>
        </div>
        <div>
           <label>Quantity</label>
           <input v-model="resource.quantity" type="number" class="form-control" name="quantity" id="quantity">
 
        </div>
        
         <div>
         
            <p>Rate:{{carts.price}} </p>
            
        </div>
        <div>
            <label>Total</label> Rs
            <input :value="total"  type="number" step="any" class="form-control" name="total" id="total">
        </div>
        <div>
           <button class="btn btn-success" @click ="EditCart()">Save</button>
        </div>
             Total: {{total}} 
     </div>
  </div> `,
  props: {id: {
      required: true,
      type: Number, 
    },
  },
  data() {
    return {
       resource:{
          quantity:null,
          price:null,
          total:null,
        }, 
        carts:[],
        token: localStorage.getItem('auth-token'),
        product_id: this.$route.params.product_id,
        user_id:localStorage.getItem('user_id')
    }
  },
  computed: {
     total: {
      get:function(){
          let calculatedTotal = this.resource.quantity * this.carts.price;
          return calculatedTotal ;
      } , 
      set: function(value){
          this.total=value
      }
         
   },
 },
 
 methods:{
      async EditCart(id){
        const res= await fetch(`/cart/${this.id}/edit`, {
           method:'PUT',
           headers:{
            "Authentication-Token":this.token,
             "Content-TYpe":"application/json",
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
  async mounted(id){
      const res= await fetch(`/cart/products/${this.id}`, {
      headers:{
            "Authentication-Token":this.token,
        }
      })
      const data= await res.json().catch((e) => {})
      if (res.ok){
          this.carts= data
      }   
   }
}
 
  
