import Home from './components/Home.js'
import Register from './components/Register.js'
import Login from './components/Login.js'
import Users from './components/Users.js'
import Categorypage from './components/Categorypage.js'
import Products from './components/Product.js'
import Category from './components/Category.js'
import Productpage from './components/Productpage.js'
import Editcategory from './components/Editcategory.js'
import Editproduct from './components/Editproduct.js'
import Deleteproduct from './components/DeleteProduct.js'
import Deletecategory from './components/DeleteCategory.js'
import AddtoCart from './components/addtocart.js'
import EditCart from './components/editcart.js'
import Cart from './components/cart.js'
import DeleteCart from './components/deletecart.js'
import Profilepage from './components/profile.js'
import Passwordpage from './components/password.js'
const routes = [
  {path: '/', component:Home},
  {path: '/login', component:Login, name:'Login'},
  {path: '/register', component:Register, name:'Register'},
  {path: '/users',component:Users},
  {path: '/create-resource',component:Products}, 
  {path: '/create-category',component:Category},
  {path: '/profile/:user_id',component:Profilepage},
  {path: '/password/:user_id',component:Passwordpage},
  {path: '/category',component:Categorypage},
  {path: '/category/edit_category/:category_id',component:Editcategory, props:(route) => { const id = Number.parseInt(route.params.category_id);return { id }}},
  {path: '/category/delete_category/:category_id',component:Deletecategory, props:(route) => { const id = Number.parseInt(route.params.category_id);return { id }}},
  {path: '/category/products/:category_id',component:Productpage,props:(route) => { const id = Number.parseInt(route.params.category_id);return { id }}},
  {path:'/category/products/edit_products/:product_id',component:Editproduct,props:(route) => { const id = Number.parseInt(route.params.product_id);return { id }}},
  {path:'/category/products/delete_products/:product_id',component:Deleteproduct,props:(route) => { const id= Number.parseInt(route.params.product_id);return { id }}},
  {path:'/category/products/users/buy/:product_id',component:AddtoCart,props:(route) => { const id = Number.parseInt(route.params.product_id);return { id }}},
  { path:'/category/cart/products/:user_id',component:Cart,props:(route) => { const id = Number.parseInt(route.params.user_id);return { id }}},
  { path:'/category/cart/products/edit_cart/:product_id',component:EditCart, props:(route) => { const id= Number.parseInt(route.params.product_id);return { id }}},
  { path:'/category/cart/products/delete_cart/:product_id',component:DeleteCart, props:(route) => { const id= Number.parseInt(route.params.product_id);return { id }}},
  
]

export default new VueRouter({
  routes,
})


