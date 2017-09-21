from . import views
from django.conf.urls import url

app_name = 'Dashboard'

urlpatterns = [

       url(r'^$', views.Announce_MessageListView.as_view(template_name='Timing_Testbed_Dashboard/Dashboard.html')),
       url(r'^BMCA/$', views.Announce_MessageListView.as_view(template_name = 'Timing_Testbed_Dashboard/Dashboard.html'), name='BMCA'),
       url(r'^LeapSecond/$', views.Announce_MessageListView.as_view(template_name='Timing_Testbed_Dashboard/Dashboard.html'), name='LeapSecond'),
       url(r'^ATOI/$', views.Announce_MessageListView.as_view(template_name='Timing_Testbed_Dashboard/Dashboard.html'), name='ATOI'),
       url(r'^Holdover/$', views.Announce_MessageListView.as_view(template_name='Timing_Testbed_Dashboard/Dashboard.html'), name='Holdover'),
       url(r'^MulticastMAC/$', views.P_Delay_Request_MessageListView.as_view(template_name='Timing_Testbed_Dashboard/Dashboard.html'), name='MulticastMAC'),
       url(r'^All_Announce_Messages/$', views.Announce_MessageRESTListView.as_view(), name='All_Announce_Messages'),
       url(r'^Individual_Announce_Messages/(?P<pk>[0-9]+)/$', views.Announce_MessageRESTDetailView.as_view(), name='Individual_Announce_Messages'),
       url(r'^All_PDelay_Messages/$', views.PDelay_MessageRESTListView.as_view(), name='All_PDelay_Messages'),
       url(r'^Individual_PDelay_Messages/(?P<pk>[0-9]+)/$', views.PDelay_MessageRESTDetailView.as_view(), name='Individual_PDelay_Messages'),
    ]
