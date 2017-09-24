from . import views
from django.conf.urls import url
from django.views.generic import TemplateView

app_name = 'Dashboard'

urlpatterns = [

       url(r'^$', TemplateView.as_view(template_name='Dashboard.html')),
       url(r'^BMCA/$', TemplateView.as_view(template_name = 'Dashboard.html'), name='BMCA'),
       url(r'^LeapSecond/$', TemplateView.as_view(template_name='Dashboard.html'), name='LeapSecond'),
       url(r'^ATOI/$', TemplateView.as_view(template_name='Dashboard.html'), name='ATOI'),
       url(r'^Holdover/$', TemplateView.as_view(template_name='Dashboard.html'), name='Holdover'),
       url(r'^MulticastMAC/$', TemplateView.as_view(template_name='Dashboard.html'), name='MulticastMAC'),
       url(r'^All_Announce_Messages/$', views.Announce_MessageRESTListView.as_view(), name='All_Announce_Messages'),
       url(r'^Individual_Announce_Messages/(?P<pk>[0-9]+)/$', views.Announce_MessageRESTDetailView.as_view(), name='Individual_Announce_Messages'),
       url(r'^All_PDelay_Messages/$', views.PDelay_MessageRESTListView.as_view(), name='All_PDelay_Messages'),
       url(r'^Individual_PDelay_Messages/(?P<pk>[0-9]+)/$', views.PDelay_MessageRESTDetailView.as_view(), name='Individual_PDelay_Messages'),
    ]
