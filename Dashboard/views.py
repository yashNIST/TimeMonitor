from rest_framework import generics
from django.views import generic
from Dashboard.models import Announce_Message, Path_Delay_Request_Message
from .serializers import Announce_MessageSerializer

class Announce_MessageRESTListView(generics.ListCreateAPIView):

    queryset = Announce_Message.objects.all()
    serializer_class = Announce_MessageSerializer

class Announce_MessageRESTDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Announce_Message.objects.all()
    serializer_class = Announce_MessageSerializer

class PDelay_MessageRESTListView(generics.ListCreateAPIView):

    queryset = Path_Delay_Request_Message.objects.all()
    serializer_class = Announce_MessageSerializer

class PDelay_MessageRESTDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Path_Delay_Request_Message.objects.all()
    serializer_class = Announce_MessageSerializer
    
'''


class Announce_MessageListView(generic.ListView):

    model = Announce_Message
    def __init(self, template_name):

        super(Announce_MessageListView).__init__()
        self.template_name = template_name

class P_Delay_Request_MessageListView(generic.ListView):

    model = Path_Delay_Request_Message
    def __init(self, template_name):

        super(P_Delay_Request_MessageListView).__init__()
        self.template_name = template_name
'''
