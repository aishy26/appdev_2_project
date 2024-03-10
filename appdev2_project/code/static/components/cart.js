export default{
   template:`<div style="background-color:#FFFDD0 ; height:100% ; min-width:90%">
    <h3> Items purchased </h3>
    <div class=" container table-responsive" style="overflow-x:auto; background-color:#FFD580"> 
     <table class= "center">
      <tr>
        <th style="width:150px">Product Name</th>
        <th style="width:150px; text-align:center">Product_id</th>
        <th style="width:150px; text-align:center">Price</th>
        <th style="width:150px; text-align:center">Quantity</th>
        <th style="width:150px; text-align:center">Total</th>
        <th style="width:150px; text-align:center">Edit</th>
        <th style="width:150px; text-align:center">Delete</th>
        
      </tr>
      <tr v-for="(cart,index) in carts" :key='index' :cart="cart">
       <td style="text-align:center">{{cart.name}}</td>
       <td style="text-align:center">{{cart.c_product_id}}</td>
       <td style="text-align:center">{{cart.price}}</td>
       <td style="text-align:center">{{cart.quantity}}</td>
       <td style="text-align:center">{{cart.total}}</td>
       <td v-if="role=='user'" style="text-align:center"><router-link :to="'edit_cart/' + cart.c_product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='user'"  style="text-align:center"><router-link :to="'delete_cart/' + cart.c_product_id"><button class="btn btn-success">Delete</button></router-link></td>
      </tr>
    </table>
  <div class= "total">
       <p><h4>Total: {{ total }}</h4></p>
  </div>
  <div>
       <button class="btn btn-success" @click ="Buyall()">Buy All</button>
  </div>
  </div>
  <div style="text-align:right" ><button class="btn btn-success" @click="back()"> Return to Categories</button></div>
  </div>`,
  props: {id: {
      required: true,
      type: Number,
    }
   },
  data() {
    return {
      role: localStorage.getItem('roles'),
      authToken: localStorage.getItem('auth-token'), 
      user_id:localStorage.getItem('user_id'), 
      carts:[],
      categories:[], 

    }
     user_id: this.$route.params.user_id
  },
 computed:{
    total() {
      
        return this.carts.reduce((cart, item) => cart += parseFloat(item.total), 0)
   }
 },
 methods:{
   async Buyall(id){
       const res= await fetch (`/cart/${this.id}/final`, {
         headers:{
            "Authentication-Token":this.authToken,
         },
       })
       const data= await res.json().catch((e) => {})
       if(res.ok){
          alert(data.message)
          this.$router.go(0)
       }else{
          alert(data.message)
       }
    },
    back(){
      this.$router.push('/category')
    }
    
  },   
 async mounted(id){
     const res= await fetch(`/cart/${this.id}` , {
        headers:{
            "Authentication-Token":this.authToken,
        },
     })
     const data= await res.json().catch((e) => {})
     if (res.ok){
        this.carts=data
     }
  }
}
 

