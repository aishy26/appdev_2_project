from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()

user_role=db.Table('user_role', db.Column('ur_user_id',
          db.Integer(), db.ForeignKey('user.user_id')),db.Column('ur_role_id',db.Integer(), 
          db.ForeignKey('role.role_id')))


class User(db.Model, UserMixin):
  __tablename__='user'
  user_id= db.Column(db.Integer,primary_key=True)
  name= db.Column(db.String,unique=False, nullable=False)
  username= db.Column(db.String, unique=True, nullable=False)
  email= db.Column(db.String, unique= True, nullable=False)
  password=db.Column(db.String(255), nullable=False)
  active=db.Column(db.Boolean())
  address=db.Column(db.String,unique=False, nullable=False)
  fs_uniquifier=db.Column(db.String(255),unique=True, nullable=False)  
  last_login=db.Column(db.String,unique=False, default=" ")
  roles = db.relationship('Role',secondary="user_role", backref= db.backref('users', lazy='dynamic'))
  product=db.relationship('Cart',back_populates='user')

  
  
  def is_active(self):
      return True

  def get_id(self):
      return self.user_id

  def is_authenticated(self):
     return self.authenticated

  def is_anonymous(self):
      return False
        
  def __repr__(self):
      return f'<User:{self.username}>'
class Role(db.Model, RoleMixin):
    __tablename__= 'role'
    role_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)
  
    
    def __init__(self, name):
        self.name = name
    
    def __repr__(self):
      return f'<Role:{self.name}>'
      

class Category(db.Model):
  __tablename__='category'
  category_id= db.Column(db.Integer,primary_key=True)
  name=db.Column(db.String,unique=True, nullable=False)
  creator_id=db.Column(db.Integer,db.ForeignKey('user.user_id'), nullable=False)
  is_approved=db.Column(db.Boolean(), default=False)
  ed_approved=db.Column(db.Boolean(), default=False)
  del_approved=db.Column(db.Boolean(), default=False)
     
class Product(db.Model):
  __tablename__='product'
  product_id= db.Column(db.Integer, primary_key=True)
  name= db.Column(db.String, nullable=False)
  manufacture_date=db.Column(db.String,unique=False, nullable=False)
  expiry_date= db.Column(db.String,unique=False, nullable=False)
  rate = db.Column(db.Integer, unique=False, nullable=False)
  unit= db.Column(db.String, unique=False, nullable=False)
  quantity=db.Column(db.Integer, unique=False, nullable=False)
  units_sold=db.Column(db.Integer, default=0)
  image=db.Column(db.String, unique=False, nullable=False)
  category_id=db.Column(db.Integer,db.ForeignKey("category.category_id"), nullable=False)
  is_approved= db.Column(db.Boolean(), default=True)
  user=db.relationship('Cart',back_populates='product')
  
class Cart(db.Model):
  __tablename__='cart'
  cart_id= db.Column(db.Integer,primary_key=True)
  name= db.Column(db.String)
  c_user_id= db.Column(db.Integer,db.ForeignKey("user.user_id"), nullable=False)
  c_product_id= db.Column(db.Integer, db.ForeignKey("product.product_id"), nullable=False)
  c_category_id=db.Column(db.Integer, db.ForeignKey("category.category_id"), nullable=False)
  quantity= db.Column(db.Integer)
  total=db.Column(db.Integer)
  price=db.Column(db.Integer)
  
  user= db.relationship('User', back_populates='product')
  product= db.relationship('Product' , back_populates='user')
  
     
class Order(db.Model):
  __tablename__='order'
  order_id= db.Column(db.Integer,primary_key=True)
  o_user_id= db.Column(db.Integer,db.ForeignKey("user.user_id"), nullable=False)
  name= db.Column(db.String)
  quantity=db.Column(db.Integer)
  price=db.Column(db.Integer)
  total=db.Column(db.Integer)
  order_time=db.Column(db.String)
 
  def __init__(self,o_user_id,name,quantity,price,total,order_time):
     self.o_user_id=o_user_id
     self.name=name
     self.quantity= quantity
     self.price=price 
     self.total=total
     self.order_time=order_time
     
class List(db.Model):
  __tablename__='list'
  list_id= db.Column(db.Integer,primary_key=True)
  l_user_id= db.Column(db.Integer,db.ForeignKey("user.user_id"), nullable=False)
  name= db.Column(db.String)
  quantity=db.Column(db.Integer)
  price=db.Column(db.Integer)
  total=db.Column(db.Integer)
  order_date=db.Column(db.String)
  order_time=db.Column(db.String)
 
  def __init__(self,l_user_id,name,quantity,price,total,order_date,order_time):
     self.l_user_id=l_user_id
     self.name=name
     self.quantity= quantity
     self.price=price 
     self.total=total
     self.order_date=order_date
     self.order_time=order_time
