import os
import bcrypt
from werkzeug.exceptions import HTTPException
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask import make_response, url_for, jsonify
import json
from flask import Flask, request, send_file
from flask_restful import Resource, Api, reqparse
from flask_restful import fields, marshal_with, marshal
from flask import render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
from flask_login import LoginManager,login_user, logout_user, login_required	
from flask_security import SQLAlchemyUserDatastore , Security, UserMixin ,RoleMixin, login_required,auth_required,current_user, roles_required, hash_password, roles_accepted
from model import *
from worker import celery_init_app
from tasks import create_resource_csv
from celery import shared_task
import flask_excel as excel
from flask_caching import Cache
from celery.result import AsyncResult
from celery.schedules import crontab
from tasks import daily_reminder
from tasks import purchase_report
app = Flask(__name__)
current_dir = os.path.abspath(os.path.dirname(__file__))
app.config["CACHE_TYPE"]="RedisCache"
app.config["SECURITY_TOKEN_AUTHENTICATION_HEADER"]="Authentication-token"
app.config["SQLALCHEMY_DATABASE_URI"] ="sqlite:///"+os.path.join(current_dir, "mad2.sqlite3")
app.config["SECRET_KEY"] = "sedfrtgh@@@yyh!!"
app.config["SECURITY_PASSWORD_SALT"]="thisissalt"
app.config["CACHE_REDIS_HOST"]="localhost"
app.config["CACHE_REDIS_PORT"]=6379
app.config["CACHE_REDIS_DB"]=3
app.config["CACHE_DEFAULT_TIMEOUT"]=300
CORS(app)
db.init_app(app)
app.app_context().push()
api=Api(app)
datastore= SQLAlchemyUserDatastore(db,User,Role)  
app.security=Security(app,datastore)
cache=Cache()
cache.init_app(app)
excel.init_excel(app)
celery_app=celery_init_app(app) 

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
   sender.add_periodic_task(
        crontab(hour=16, minute=27),
        purchase_report.s('ram@gmail.com', 'dailytest'),
    )
   sender.add_periodic_task(
        crontab(hour=16 , minute=27),
       daily_reminder.s('ram@gmail.com', 'reminder'),
   )
   
    
db.create_all()
datastore.find_or_create_role(name="admin")
datastore.find_or_create_role(name="store_manager")
datastore.find_or_create_role(name="user")
db.session.commit()

if not datastore.find_user(email="admin@gmail.com"):
  datastore.create_user(name="admin", username="admin_01", email="admin@gmail.com", password=generate_password_hash("admin_01_2023"), address= "Mumbai" ,roles=["admin"])
  
db.session.commit()
   
@app.get('/')
def home():
  return render_template('index.html')
    
@app.post('/user_login')
def login():
  data=request.get_json()
  username=data.get("username")
  pa=data.get("password")
  user=datastore.find_user(username=username)
  u=User.query.filter(User.username==username).first()
  if not user:
     return jsonify({'message':"User not found"}), 404
  if not user.active:
     return jsonify({'message':"User has not been authorised yet"}),403
  if check_password_hash(user.password, pa):
     u.last_login=datetime.now()
     db.session.add(u)
     db.session.commit()
     return  jsonify({"token":user.get_auth_token(),"username":user.username,"user_id":user.user_id,"roles":user.roles[0].name,"active":user.active}), 200
  else:
     return jsonify({'message':"wrong password"}), 400
     
@app.post('/create_user')
def register():
  data=request.get_json()
  name=data.get("name")
  username=data.get("username")
  email=data.get("email")
  password=data.get("password")
  address=data.get("address")
  role= data.get("role")
  if datastore.find_user(email=email):
      return jsonify({'message':"User already exists"}),403
  if datastore.find_user(email=email):
      return jsonify({'message':"Username already exists.Try a new one"}), 403
  if role=="user":
     datastore.create_user(name=name, username=username, email=email, password=generate_password_hash(password), address=address ,roles=["user"])
     db.session.commit()
  elif role=="store_manager":
     datastore.create_user(name=name, username=username, email=email, password=generate_password_hash(password), address=address ,roles=["store_manager"], active=False)
     db.session.commit()
  return jsonify({'message':"User registered"})
       
@app.get('/activate/user/<int:user_id>')
@auth_required("token")
@roles_required("admin")
def activate(user_id):
  sm= User.query.get(user_id)
  if not sm or "store_manager" not in sm.roles:
     return jsonify({"message":"Store manager not found"}), 404
  sm.active= True
  db.session.commit()
  return jsonify({"message":"User Activated"})

@app.get('/category/<int:category_id>/approve')
@auth_required("token")
@roles_required("admin")
def category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category Not found"}), 404
    category.is_approved = True
    db.session.commit()
    return jsonify({"message": "Approved"})
    
@app.get('/category/<int:category_id>/edit')
@auth_required("token")
@roles_required("admin")
def approveed_category(category_id):
    category = Category.query.get(category_id)
    product=Product.query.filter(Product.category_id==category_id).all()
    if not category:
        return jsonify({"message": "Category Not found"}), 404
    category.ed_approved = True
    db.session.commit()
    for i in product:
        i.is_approved=True
        db.session.add(i)
        db.session.commit()
    return jsonify({"message": "Approved edit"})
    
@app.get('/category/<int:category_id>/delete')
@auth_required("token")
@roles_required("admin")
def delete_category(category_id):
    category = Category.query.get(category_id)
    product=Product.query.filter(Product.category_id==category_id).all()
    if not category:
        return jsonify({"message": "Category Not found"}), 404
    category.del_approved = True
    for i in product:
        i.is_approved=True
        db.session.delete(i)
        db.session.commit()
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Approved delete"})
    
@app.get('/product/<int:product_id>/get')
@auth_required("token")
def products(product_id):
    p= Product.query.get(product_id)
    if not p:
        return jsonify({"message": "Product Not found"}), 404
    return jsonify({"name":p.name, "rate":p.rate}), 200
    
@app.put('/profile/<int:user_id>') 
@auth_required("token")
@roles_required("user")
def profile(user_id):
   u=User.query.filter(User.user_id==user_id).first()
   data=request.get_json()
   u.name=data.get("name")
   u.address=data.get("address")
   db.session.add(u)
   db.session.commit()
   return jsonify({"message":"Profile updated"})
  
   
@app.put("/password/<int:user_id>") 
@auth_required("token")
@roles_required("user")
def change_password(user_id):
    u=User.query.filter(User.user_id==user_id).first() 
    data=request.get_json()
    pas=data.get("password")
    password= generate_password_hash(pas)
    u.password=password
    db.session.add(u)
    db.session.commit()
    return jsonify({"message":"Password updated"})  
      
@app.put('/cart/<int:product_id>/edit')
def edit_cart(product_id):
    user_id=current_user.user_id
    c= Cart.query.filter(Cart.c_user_id==user_id).filter(Cart.c_product_id==product_id).first()
    p=Product.query.filter(Product.product_id==product_id).first()
    o=Order.query.filter(Order.o_user_id==user_id).filter(Order.name==c.name).first()
    data=request.get_json()
    quantity=data.get("quantity")
    if float(quantity)> c.quantity:
       p.quantity=p.quantity-(float(quantity)-c.quantity)
    else:
       p.quantity= p.quantity+(c.quantity-float(quantity))
    db.session.add(p)
    db.session.commit()
    c.quantity= quantity
    c.total= float(c.price)*float(quantity)
    o.quantity=quantity
    o.order_time=datetime.now()
    o.total=float(c.price)*float(quantity)
    db.session.add(c)
    db.session.add(o)
    db.session.commit()
    return jsonify({"message":"Cart edited"})
 
              
@app.delete("/cart/<int:product_id>/delete")
def delete_cart(product_id):
    user_id=current_user.user_id
    c= Cart.query.filter(Cart.c_user_id==user_id).filter(Cart.c_product_id==product_id).first()
    p= Product.query.filter(Product.product_id==product_id).first()
    o=Order.query.filter(Order.o_user_id==user_id).filter(Order.name==c.name).first()
    quantity=c.quantity
    if c:
       db.session.delete(c)
       db.session.delete(o)
       db.session.commit() 
       p.quantity=p.quantity + quantity
       db.session.add(p)
       db.session.commit()
       return jsonify({"message":"Cart product deleted"}), 200
    return jsonify({"message":"Cart product not found"}), 404     
  
product_fields={
    "product_id":fields.Integer,
    "name":fields.String,
    "manufacture_date":fields.String,
    "expiry_date" : fields.String,
    "rate": fields.Integer,
    "unit":fields.String,
    "quantity":fields.Integer,
    "image":fields.String,
    "category_id":fields.Integer,
   } 
   
@app.get("/products")
def list_products():
   p=Product.query.filter(Product.is_approved==True).all()
   if p:
      return marshal(p, product_fields)
   return jsonify({"message":"Products not found"})
   
              
@app.post("/product/<int:product_id>/buy")
def buy_product(product_id):
    p=Product.query.filter(Product.product_id==product_id).first()
    data=request.get_json()
    quantity= data.get("quantity")
    price=p.rate
    total= float(price)*float(quantity)
    order_time=datetime.now()
    name=p.name
    category_id=p.category_id
    user_id=current_user.user_id
    ca=Cart(c_user_id=user_id, name=name, c_product_id=product_id ,c_category_id=category_id,quantity=quantity,total=total,price=price)
    o=Order(o_user_id=user_id,name=name,quantity=quantity,price=price,total=total,order_time=order_time)
    db.session.add(ca)
    db.session.add(o)
    db.session.commit()
    a=p.quantity
    b=quantity
    p.quantity=a-float(b)
    db.session.add(p)
    db.session.commit()
    return jsonify ({"message":"Added to cart"})
      
   
@app.get('/cart/<int:user_id>/final')
@auth_required("token")
@roles_required("user")
def buy_all(user_id):
    user_id=current_user.user_id
    c= Cart.query.filter(Cart.c_user_id==user_id).all()
    if c:
      for i in c:
        p=Product.query.filter(Product.product_id==i.c_product_id).first()
        p.units_sold=i.quantity
        db.session.add(p)
        db.session.commit()
        db.session.delete(i)
        db.session.commit()
    else:
        return jsonify({"message": "No items in carts"}), 404
    o= Order.query.filter(Order.o_user_id==user_id).all()
    d=datetime.now().strftime("%Y-%m-%d")
    t=datetime.now().strftime("%H:%M")
    total=0
    l=[]
    for i in o:
       li=List(user_id,i.name,i.quantity,i.price,i.total,d,t)
       db.session.add(li)
       db.session.commit()
       l.append((i.name,i.quantity,i.total))
       total+=i.total
       db.session.delete(i)
       db.session.commit()
    return jsonify({"message":"Items purchased Successfully"})
    

cart_fields={
    "c_product_id":fields.Integer,
    "c_category_id":fields.Integer,
    "name":fields.String,
    "price":fields.Integer,
    "quantity":fields.Integer,
    "total":fields.Integer,
}        
  
@app.get('/cart/<int:user_id>')
@auth_required("token")
@roles_required("user")
def cart(user_id):
    c=Cart.query.filter(Cart.c_user_id==user_id).all()
    if c:
       return marshal(c,cart_fields)
    return jsonify({"messgage":"No products found"})
    
    
@app.get('/cart/products/<int:product_id>')
@auth_required("token")
@roles_required("user")
def editcart(product_id):
    user_id=current_user.user_id
    c=Cart.query.filter(Cart.c_user_id==user_id).filter(Cart.c_product_id==product_id).first()
    if c:
       return jsonify({"name":c.name, "price":c.price})
    return jsonify({"message":"Product not found in cart"})
       
    

@app.get('/download-csv')
def download_csv():
   task=create_resource_csv.delay()
   return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
  res= AsyncResult(task_id)
  if res.ready():
     filename=res.result
     return send_file(filename,as_attachment=True), 200
  else:
     return jsonify({"message": "Task Pending"}), 404
    
    
user_fields={
    "user_id":fields.Integer,
    "email":fields.String,
    "active":fields.Boolean,
}


@app.get('/user_list')
@auth_required("token")
@roles_required("admin")
def all_users():
  user=User.query.all()
  if len(user)==0:
     return jsonify({"message":"No users found"}), 404
  return marshal(user, user_fields)
  
  
         
output_field2={
    "category_id":fields.Integer,
    "name":fields.String,
    "creator_id":fields.Integer,
    "is_approved":fields.Boolean,
    "ed_approved":fields.Boolean,
    "del_approved":fields.Boolean,
   }
   
   
create_category_parser= reqparse.RequestParser()
create_category_parser.add_argument("name")
create_category_parser.add_argument("creator_id")


create_update_c_parser= reqparse.RequestParser()
create_update_c_parser.add_argument("name")
create_update_c_parser.add_argument("creator_id")

  
class CategoryAPI(Resource):
   @auth_required("token")
   @cache.cached(timeout=10)
   def get(self):
      if "admin" in current_user.roles:
            category = Category.query.all()
      else:
         category = Category.query.filter(Category.is_approved == True).filter(Category.ed_approved==True).filter(Category.del_approved==True).all()
      if len(category) > 0:
            return marshal(category, output_field2)
      else:
            return {"message": "No Category Found"},404
   
   @auth_required("token")
   @roles_accepted("admin","store_manager")     
   def put(self, category_id):
      args=create_update_c_parser.parse_args()
      name=args.get("name")
      creator_id=current_user.user_id
      u= User.query.get(creator_id)
      cat= Category.query.filter(Category.category_id==category_id).first()
      product=Product.query.filter(Product.category_id==category_id).all()
      if cat:
          cat.name=name
          if "admin" in u.roles:
             db.session.add(cat)
             db.session.commit()
             return {"message":"Category edited"}
          if "store_manager" in u.roles:
             cat.ed_approved=False
             db.session.add(cat)
             db.session.commit()
             for i in product:
                i.is_approved=False
                db.session.add(i)
                db.session.commit()
             return {"message":"Category edited after approval"}
              
      return {"message":"Category does not exist"}
       
   
   @auth_required("token")
   @roles_accepted("admin", "store_manager")  
   def post(self):
      args=create_category_parser.parse_args()
      name=args.get("name")
      creator_id= current_user.user_id
      cat= Category.query.filter(Category.name==name).first()
      u= User.query.get(creator_id)
      if cat:
         return {"message":"Category already exists"}, 403
      if "admin" in u.roles:
         c=Category(name=name,creator_id=creator_id, is_approved=True,ed_approved=True, del_approved=True)
         db.session.add(c)
         db.session.commit()
         return {"message":"Category added"}, 200
      if "store_manager" in u.roles:
         c=Category(name=name,creator_id=creator_id, is_approved=False,ed_approved=True, del_approved=True)
         db.session.add(c)
         db.session.commit()
         return {"message":"Category added after approval"}, 200
         
   
   @auth_required("token")
   @roles_accepted("admin", "store_manager")  
   def delete(self,category_id):
      cat= db.session.query(Category).filter(Category.category_id==category_id).first()
      product=db.session.query(Product).filter(Product.category_id==category_id).all() 
      creator_id= current_user.user_id
      u= User.query.get(creator_id)
      if "admin" in u.roles:
       if product:
         for i in product:
             db.session.delete(i)
             db.session.commit()
             db.session.delete(cat)
             db.session.commit()
       else:
          db.session.delete(cat)
          db.session.commit()
       return {"message":"Category deleted"}
      if "store_manager" in u.roles:
          cat.del_approved=False
          db.session.add(cat)
          db.session.commit()
          for i in product:
             i.is_approved=False
             db.session.add(i)
             db.session.commit()
          return {"message":"Category will be deleted after approval"}
          
      
api.add_resource(CategoryAPI, '/api/category','/api/category/<int:category_id>/edit','/api/category/<int:category_id>/delete')  

output_field3={
    "product_id":fields.Integer,
    "name":fields.String,
    "manufacture_date":fields.String,
    "expiry_date" : fields.String,
    "rate": fields.Integer,
    "unit":fields.String,
    "quantity":fields.Integer,
    "image":fields.String,
    "category_id":fields.Integer,
   }
   
create_product_parser= reqparse.RequestParser()
create_product_parser.add_argument("name")
create_product_parser.add_argument("manufacture_date")
create_product_parser.add_argument("expiry_date")
create_product_parser.add_argument("unit")
create_product_parser.add_argument("rate")
create_product_parser.add_argument("quantity")
create_product_parser.add_argument("image")
create_product_parser.add_argument("category_id")


create_update_p_parser= reqparse.RequestParser()
create_update_p_parser.add_argument("name")
create_update_p_parser.add_argument("manufacture_date")
create_update_p_parser.add_argument("expiry_date")
create_update_p_parser.add_argument("rate")
create_update_p_parser.add_argument("unit")
create_update_p_parser.add_argument("quantity")
create_update_p_parser.add_argument("image")
create_update_p_parser.add_argument("category_id")
  
class ProductAPI(Resource):
   @auth_required("token")
   def get(self, category_id):
      products= Product.query.filter(Product.category_id==category_id).filter(Product.is_approved==True).all()
      if len(products) > 0:
           return marshal(products, output_field3)
      else:
           return {"message": "No Product Found"},404
      return {"message":"Category to be approved"}
          
     
   @auth_required("token")
   @roles_required("store_manager")  
   def put(self,product_id):
      p= Product.query.filter(Product.product_id==product_id).first()
      args=create_update_p_parser.parse_args()
      name=args.get("name")
      manufacture_date=args.get("manufacture_date")
      expiry_date=args.get("expiry_date")
      rate=args.get("rate")
      unit=args.get("unit")
      quantity=args.get("quantity")
      category_id=args.get("category_id")
      image=args.get("image")
      if p:
         p.name=name
         p.manufacture_date=manufacture_date
         p.expiry_date=expiry_date
         p.rate=rate
         p.unit=unit
         p.quantity=quantity
         p.category_id=category_id
         p.image=image
         db.session.add(p)
         db.session.commit()
         return {"message":"Product is updated"}, 200
      return {"message":"Product does not exist"}, 404
      
      
   @auth_required("token")
   @roles_required("store_manager") 
   def post(self):
      args=create_product_parser.parse_args()
      name=args.get("name")
      manufacture_date=args.get("manufacture_date")
      expiry_date=args.get("expiry_date")
      rate=args.get("rate")
      unit=args.get("unit")
      quantity=args.get("quantity")
      image=args.get("image")
      category_id=args.get("category_id")
      c=Category.query.filter(Category.category_id==category_id).first()
      p=Product.query.filter(Product.name==name).first()
      if p:
          return {"message":"Product Already exists"}
      if c.is_approved == True and c.ed_approved==True and c.del_approved==True :
         products=Product(name=name,manufacture_date=manufacture_date,expiry_date=expiry_date,rate=rate,
                          unit=unit,quantity=quantity,image=image,category_id=category_id)
         db.session.add(products)
         db.session.commit()
         return {"message":"Products added"}, 200
      else:
         return{"message":"Category not yet approved"}
         
     
   @auth_required("token")
   @roles_required("store_manager") 
   def delete(self,product_id):
        p=Product.query.filter(Product.product_id==product_id).first()
        if p:
           db.session.delete(p)
           db.session.commit()
           return {"message":"Product is deleted"}, 200
        else:
           return {"message":"Product not found"}, 404
      
api.add_resource(ProductAPI,'/api/products','/api/products/<int:category_id>','/api/products/edit/<int:product_id>','/api/products/delete/<int:product_id>')





      
if __name__ == '__main__':
  app.run(host='0.0.0.0', port =5000)
   

