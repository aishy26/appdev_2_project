export default{
  template:`<div style="background-color:#FFD580">
 <div style="text-align:right ; margin-top:2vh"><button class="btn btn-success" @click='categorylist()'>Categories</button><div v-if="role=='user'"><button class="btn btn-success" @click='profile()'>Update Profile</button></div></div>
 <div class="search-wrapper panel-heading col-sm-12">
    <label>Category Search</label>
    <input type="text" v-model="cat" placeholder="Search Category" /> <br> <br>
 </div>
 <div class="search-wrapper panel-heading col-sm-12">
    <label>Product Search</label>
    <input type="text" v-model="prod" placeholder="Search Product" /> <br> <br>
 </div>  
 <div class="search-wrapper panel-heading col-sm-12">
    <label>Price Search</label>
    <input type="number" v-model="p_price" placeholder="Search price" /> <br> <br>
 </div>  
 <div class="search-wrapper panel-heading col-sm-12">
    <label>Manufacture date Search</label>
    <input type="date" v-model="m_date" placeholder="Search manufacture date" /> <br> <br>
 </div>
 <div class="search-wrapper panel-heading col-sm-12">
    <label>Expiry date Search</label>
    <input type="date" v-model="e_date" placeholder="Search expiry date" /> <br> <br>
 </div>
 <div v-if="cat!==null">
  <div class=" container table-responsive" style="overflow-x:auto;">
   <table class="table table-bordered">
    <tr v-for="(category,index) in filteredItems" :key="category">
       <td>category_id: {{category.category_id}}</td>
        <td>name: {{category.name}}</td>
        <td v-if ="role =='admin'"><button v-if="!category.is_approved" class="btn btn-success" @click='approveResource(category.category_id)'>Approve_add</button></td>
        <td style="text-align:center"><router-link :to="'category/products/' +category.category_id "><button v-if="category.is_approved" class="btn btn-success">List of Products</button></router-link></td>
        <td style="text-align:center">creator_id: {{category.creator_id}}</td>
        <td v-if="role!=='user'" style="text-align:center"><router-link :to="'category/edit_category/' +category.category_id "><button v-if="category.is_approved" class="btn btn-success">Edit</button></router-link><button v-if="!category.ed_approved && role=='admin'"class="btn btn-success"@click='approveed(category.category_id)'>Approve_ed</button></td>
        <td v-if="role!=='user'" style="text-align:center"><router-link :to="'category/delete_category/' + category.category_id"><button v-if="category.is_approved" class="btn btn-success">Delete</button></router-link><button v-if="!category.del_approved && role=='admin'"class="btn btn-success"@click='approvedel(category.category_id)'>Approve_del</button></td>
   </tr> 
  </table>
 </div>
 </div>
 <div v-if="prod!==null"> 
  <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filteredProducts" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
 </div>
 </div>
 <div v-if="p_price!==0 && m_date==null && e_date==null"> 
 <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filteredPrice" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
 </div>
 </div>
 <div v-if="m_date!==null && e_date==null && p_price==0"> 
  <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filteredMdate" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
 </div>
 </div>
 <div v-if="e_date!==null && m_date==null && p_price==0"> 
 <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filteredEdate" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
 </div>
 </div>
 <div v-if="e_date!==null && m_date!==null && p_price==0"> 
 <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filtereddate" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
 </div>
 </div>
 <div v-if="p_price!==0 && m_date!==null && e_date!==null"> 
 <div class=" container table-responsive" style="overflow-x:auto;">
  <table class="table table-bordered">
   <tr v-for="(product,index) in filteredprice_date" :key="product">
       <td style="text-align:center">name: {{product.name}}</td>
       <td style="text-align:center"><br><img v-bind:src="'/static/Images/' + product.image" style="max-width:100%; height:auto"/></br></td>
       <td style="text-align:center">manufacture_date: {{product.manufacture_date}}</td>
       <td style="text-align:center">expiry_date: {{product.expiry_date}}</td>
       <td style="text-align:center">Rate: {{product.rate}}</td>
       <td style="text-align:center">Unit: {{product.unit}}</td>
       <td style="text-align:center" v-if="role !=='user'">quantity: {{product.quantity}}</td>
       <td style="text-align:center" v-if="role !=='user'">category_id: {{product.category_id}}</td>
       <td v-if="role=='store_manager'" style="text-align:center"><router-link :to="'category/products/edit_products/' +product.product_id"><button class="btn btn-success">Edit</button></router-link></td>
      <td v-if="role=='store_manager'"  style="text-align:center"><router-link :to="'category/products/delete_products/' +product.product_id"><button class="btn btn-success">Delete</button></router-link></td>
      <td v-if="role =='user' && product.quantity >0 " style="text-align:center"><router-link :to="'category/products/users/buy/'+product.product_id"><button class=" btn btn-success">Buy</button></router-link></td>
      <td v-else-if="role =='user'" style="text-align:center">Out of Stock</td>
   </tr>
  </table>
  </div>
 </div>
</div>`,
 props: ['category', 'product'],
 data(){
    return {
      role: localStorage.getItem('roles'),
      authToken: localStorage.getItem('auth-token'),
      user_id:localStorage.getItem('user_id'),
      categories:[],
      products:[],
      cat:null,
      prod:null,
      p_price:0,
      m_date:null,
      e_date:null,
    }
 },
 computed:{
   filteredItems() {
     if (this.cat) {
       return this.categories.filter(c => {return c.name.toLowerCase().indexOf(this.cat.toLowerCase()) != -1;}) 
      }
   },
   filteredProducts(){
     if (this.prod){
         return this.products.filter(p => {return p.name.toLowerCase().indexOf(this.prod.toLowerCase()) != -1;});
      }
   },  
   filteredPrice(){
     if (this.p_price){
          return this.products.filter(p => {return p.rate < this.p_price});
      }
   },
   filteredMdate(){
     if (this.m_date){
          return this.products.filter(p => {return p.manufacture_date < this.m_date});
      }
   }, 
   filteredEdate(){
     if (this.e_date){
          return this.products.filter(p => {return p.expiry_date > this.e_date});
      }
   },
   filtereddate(){
     if (this.m_date && this.e_date){
          return this.products.filter(p => {return p.expiry_date > this.e_date && p.manufacture_date < this.m_date});
      }
   } ,
   filteredprice_date(){
     if (this.p_price && this.m_date && this.e_date){
          return this.products.filter(p => {return p.expiry_date > this.e_date && p.manufacture_date < this.m_date && p.rate < this.p_price});
      }
   } 
    
 },
 methods: {
    async approveResource(category_id) {
      const res = await fetch(`/category/${category_id}/approve`, {
        headers: {
          'Authentication-Token': this.authToken,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        this.$router.go(0)
      }else {
        alert(data.message)
      }
    },
    async approveed(category_id) {
      const res = await fetch(`/category/${category_id}/edit`, {
        headers: {
          'Authentication-Token': this.authToken,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        this.$router.go(0)
      }else {
        alert(data.message)
      }
    },
    async approvedel(category_id) {
      const res = await fetch(`/category/${category_id}/delete`, {
        headers: {
          'Authentication-Token': this.authToken,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        this.$router.go(0)
      }else {
        alert(data.message)
      }
    },
    categorylist(){
       this.$router.push('/category')
    },
    profile(){
       this.$router.push(`/profile/${this.user_id}`)
    }
  },
 async mounted(){ 
     const res= await fetch('/api/category' , {
        headers:{
            "Authentication-Token":this.authToken,
        },
     })
     const data= await res.json()
     if (res.ok){
        this.categories= data
     }else{
       alert(data.message) 
     }
     const pres= await fetch('/products' , {
        headers:{
            "Authentication-Token":this.authToken,
        },
     })
     const pdata= await pres.json()
     if (pres.ok){
        this.products= pdata
     }else{
       alert(pdata.message) 
     }
   }, 
}
