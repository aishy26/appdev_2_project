export default {
  template: `<div style="background-color:#FFFDD0 ; height:100% ; min-width:100%">
  <div class=" container table-responsive" style="background-color:#FFD580 ; overflow-x:auto;">
  <table class="table table-bordered">
   <tr>
     <th style="width:150px">Product Name</th>
     <th style="width:150px; text-align:center">Image</th>
     <th style="width:150px; text-align:center">Manufacture Date</th>
     <th style="width:150px; text-align:center">Expiry Date</th>
     <th style="width:150px; text-align:center">Rate/unit</th>
     <th style="width:150px; text-align:center">Unit</th>
     <th v-if="role !=='user'" style="width:150px; text-align:center">Quantity</th>
     <th v-if="role !=='user'" style="width:150px; text-align:center">Category_Id</th>
     <th style="width:150px; text-align:center" v-if="role =='store_manager'">Edit</th>
     <th style="width:150px; text-align:center" v-if="role=='store_manager'">Remove</th>
     <th style="width:200px; text-align:center" v-if="role=='user'">Buy </th>
     <th style="width:200px; text-align:center" v-else-if="role=='user'">Out of stock </th>
   </tr>
   <tr v-for="(product,index) in products" :key='index' :product="product">
       <td style="text-align:center">{{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">{{product.manufacture_date}}</td>
       <td style="text-align:center">{{product.expiry_date}}</td>
       <td style="text-align:center">{{product.rate}}</td>
       <td style="text-align:center">{{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">{{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">{{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0" style="text-align:center"><router-link :to="'users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link><td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
 </table>
 <div style="text-align:right" ><button class="btn btn-success" @click="category()"> Return to Categories</button></div>
 </div>
 </div>
 `,
  props: {id: {
      required: true,
      type: Number,
    }
   },
  data() {
    return {
      role: localStorage.getItem('roles'),
      authToken: localStorage.getItem('auth-token'),
      products:[],
      categories:[], 
    }
     category_id: this.$route.params.category_id
  },
  methods:{
     category(){
        this.$router.push('/category')
     }
  },
  async mounted(id){
     const res= await fetch(`/api/products/${this.id}` , {
        headers:{
            "Authentication-Token":this.authToken,
        },
     })
     const data= await res.json().catch((e) => {})
     if (res.ok){
        this.products= data
     }else{
        alert(data.message) 
     }
  }, 
 
}

