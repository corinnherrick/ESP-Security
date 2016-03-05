from django.conf.urls import url
from django.conf.urls import patterns

from .views import AppView

urlpatterns = patterns('', 
        url(r'', AppView.as_view(), name='app_view'),

)
