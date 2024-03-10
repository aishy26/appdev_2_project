export default {
  template: `<div style="background-color:#FFFDD0 ; height:100% ; min-width:90%">
 <div class=" container table-responsive" style="overflow-x:auto; background-color:#FFD580">
  
  <table class="table table-bordered  display: flex; justify-content:center; align-items: center;">
   <tr>
     <th style="width:100px">Category Id</th>
     <th style="width:200px">Category Name</th>
     <th v-if="role =='admin'" style="width:150px; text-align:center" >To be Approved</th>
     <th style="width:150px; text-align:center">Product List</th>
     <th style="width:150px; text-align:center">Creator Id</th>
     <th style="width:150px; text-align:center" v-if="role!=='user'">Edit</th>
     <th style="width:150px; text-align:center" v-if="role!=='user'">Remove</th>
   </tr>
   <tr v-for="(category,index) in categories" :key='index' :category="category">
    
       <td>{{category.category_id}}</td>
        <td>{{category.name}}</td>
        <td v-if ="role =='admin'"><button v-if="!category.is_approved" class="btn btn-success" @click='approveResource(category.category_id)'>Approve_add</button></td>
        <td style="text-align:center"><router-link :to="'category/products/' +category.category_id "><button v-if="category.is_approved" class="btn btn-success">List of Products</button></router-link></td>
        <td style="text-align:center">{{category.creator_id}}</td>
        <td v-if="role!=='user'" style="text-align:center"><router-link :to="'category/edit_category/' +category.category_id "><button v-if="category.is_approved" class="btn btn-success">Edit</button></router-link><button v-if="!category.ed_approved && role=='admin'"class="btn btn-success"@click='approveed(category.category_id)'>Approve_ed</button></td>
        <td v-if="role!=='user'" style="text-align:center"><router-link :to="'category/delete_category/' + category.category_id"><button v-if="category.is_approved" class="btn btn-success">Delete</button></router-link><button v-if="!category.del_approved && role=='admin'"class="btn btn-success"@click='approvedel(category.category_id)'>Approve_del</button></td>
   </tr> 
 </table>
 <div v-if="role=='user'" style="text-align:right"><router-link :to="'category/cart/products/' +user_id"><button class="btn btn-success">View Cart</button></router-link></div>
 </div>
 <div style="text-align:right" ><button class="btn btn-success" @click="home()"> Return Home</button></div>
 </div>
 `,
  props: ['category'],
  data() {
    return {
      role: localStorage.getItem('roles'),
      authToken: localStorage.getItem('auth-token'),
      user_id:localStorage.getItem('user_id'),
      categories:[],
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
        this.$router.push('/')
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
        this.$router.push('/')
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
        this.$router.push('/')
      }else {
        alert(data.message)
      }
    },
    home(){
       this.$router.push('/')
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
   }, 
  
}
      

   
