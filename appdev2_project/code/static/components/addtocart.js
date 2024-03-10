export default{
  template:` <div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
    <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:400px ; width:400px ; margin:auto;" >
        <div>
           <p>{{ products.name }}</p>
        </div>
        <div>
           <label>Quantity</label>
           <input v-model="resource.quantity" type="number" class="form-control" name="quantity" id="quantity">
        </div>
         <div>
            <p>Rate: {{products.rate}} </p>   
        </div>
        <div style="text-align:center">
            <label>Total</label> Rs
            <input :value="total" type="number" step="any" class="form-control" name="total" id="total">
        </div>
        <div style="text-align:center">
           <button class="btn btn-success" @click ="AddtoCart()">Add to cart</button>
        </div>
             Total: {{total}} 
    </div> 
     <div class ="container" style="text-align:right"><button class="btn btn-success" @click="back()">Return to Categories</button></div>
   </div>`,
  props: {id: {
      required: true,
      type: Number, 
    },
  },
  data() {
    return {
       resource:{
          quantity:null,
          rate:null,
          total:null,
        }, 
        products:[],
        token: localStorage.getItem('auth-token'),
        product_id: this.$route.params.product_id,
    }
  },
  computed: {
     total: {
      get:function(){
          let calculatedTotal = this.resource.quantity * this.products.rate;
          return calculatedTotal ;
      } , 
      set: function(value){
          this.total=value
      }
         
   },
 },
 
 methods:{
      async AddtoCart(id){
        const res= await fetch(`/product/${this.id}/buy`, {
           method:'POST',
           headers:{
            "Authentication-Token":this.token,
             "Content-TYpe":"application/json",
            },
            body:JSON.stringify(this.resource),
           
         })
         const data= await res.json().catch((e) => {})
         if(res.ok){
              alert(data.message)
              this.$router.push('/category')
         }
       },
       back(){
          this.$router.push('/category')
       }
  },
  async mounted(id){
      const res= await fetch(`/product/${this.id}/get` , {
      headers:{
            "Authentication-Token":this.token,
        }
      })
      const data= await res.json().catch((e) => {})
      if (res.ok){
          this.products= data
      }   
   }
}
 
