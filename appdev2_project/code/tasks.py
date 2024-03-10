from celery import shared_task
from model import Product, User, Role, user_role,List
import flask_excel as excel
from mail_service import send_message
from jinja2 import Template
from datetime import  datetime, timedelta

@shared_task(ignore_result=False)
def create_resource_csv():
   products=Product.query.with_entities(Product.name,Product.quantity, Product.units_sold).all()
   csv_output=excel.make_response_from_query_sets(products,["name","quantity","units_sold"],"csv")
   filename="test.csv"
   with open(filename, 'wb') as f:
     f.write(csv_output.data)
   return filename

@shared_task(ignore_result=True)
def purchase_report(to,subject):
     users=User.query.filter(User.roles.any(name='user')).all()
     for user in users:
        l=List.query.filter(List.l_user_id==user.user_id).all()
        k=[]
        total=0
        for i in l: 
            d1=datetime.strptime(i.order_date, '%Y-%m-%d')
            d2=datetime.now()
            if d1.month==d2.month:
               k.append((i.name, i.quantity,i.total,i.order_date))
               total+=i.total
        with open('report.html', 'r') as f:
            template=Template(f.read())
            send_message(user.email, subject, template.render(order=k, total=total))
     return "ok"
 
@shared_task(ignore_result=True)
def daily_reminder(to,subject):
     users=User.query.filter(User.roles.any(name='user')).all()
     for user in users:
         d1=user.last_login
         date_format = '%Y-%m-%d %H:%M:%S.%f'
         d2=datetime.now()
         d1= datetime.strptime(d1, date_format)
         #d2=d2.date()
         #d1=d1.date()
         c= d2-d1
         c= c.total_seconds()/60
         #if c.days > 1:
         if c > 5:
           send_message(user.email, subject, "Please visit the website for new deals and offers")
     return "ok"  
