export default{
   template:
   `<div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
     <div style="text-align:center; background-color:#FFD580; padding: 80px; border-radius:15px; height:600px ; width:380px ; margin:auto" >
      <div>
        <label>Product name</label>
        <input type="text" name="name" id="a" v-model="resource.name" required>
      </div>
      <div>
        <label>Manufacture Date</label>
        <input type="date" name="m_date" id="b" v-model="resource.manufacture_date"required>
      </div>
      <div>
        <label>Expiry Date</label>
        <input type="date" name="e_date" id="c" v-model="resource.expiry_date" required>
      </div>
      <div>
        <label>Rate/unit</label>
        <input type="number"min=0 step='any' name="rate" v-model="resource.rate" id="d" required>
      </div>
      <div>
        <label>Unit</label>
          <select name= "unit"  id= "e"v-model="resource.unit">
             <option value="Rs/kg">Rs/kg</option>
             <option value="Rs/g">Rs/gram</option>
             <option value="Rs/dozen">Rs/dozen</option>
             <option value="Rs/litre">Rs/litre</option>
          </select>
      </div>
      <div>
        <label>Quantity</label>
        <input type="number" min=0 step='any' name="quantity"  id="f"  v-model="resource.quantity" required>
      </div>
      <div>
        <label>Category Id</label>
        <input type="number" name="id" id="g" v-model="resource.category_id" required>
      </div>
      <div>
        <label>Product Image</label>
        <input type="text" name="image" id="g" v-model="resource.image" required>
      </div>
      <div>
        <button  class="btn btn-success" @click= "createResource">Save</button>
      </div>
    </div>
     <div class ="container" style="text-align:right"><button class="btn btn-success" @click="back()">Return to Categories</button></div>
   </div>`,
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
    }
  },
  methods:{
    async createResource() {
       const res= await fetch ('/api/products', {
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
         this.$router.go('/')
      }
    },
    back(){
       this.$router.push('/category')
    }
  },
}
           
   
   
   
