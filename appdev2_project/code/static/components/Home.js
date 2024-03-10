import UserHome from './UserHome.js'
import AdminHome from './AdminHome.js'
import SMHome from './SMHome.js'
import Search from './search.js'

export default{
   template:`<div style="background-color:#FFFDD0 ; height:90% ; min-width:90%">
   <UserHome v-if="userRole=='user'"/>
   <AdminHome v-if="userRole=='admin'"/>
   <SMHome v-if="userRole=='store_manager'"/>
   <Search />
   </div>`,
   
   data(){ 
     return{
        userRole:localStorage.getItem('roles'),
        authToken:localStorage.getItem('auth-token'),
        
     }
   },
   components:{
      UserHome,
      AdminHome,
      SMHome,
      Search,
   },
 }
