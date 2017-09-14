from rest_framework import generics
from django.views import generic
from Dashboard.models import Announce_Message, Path_Delay_Request_Message
from .serializers import Announce_MessageSerializer

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

class Announce_MessageRESTListView(generics.ListCreateAPIView):

    queryset = Announce_Message.objects.all()
    serializer_class = Announce_MessageSerializer

class Announce_MessageRESTDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Announce_Message.objects.all()
    serializer_class = Announce_MessageSerializer


'''

class Announce_MessageList(APIView):


    def get(self, request, format=None):

        announce_messages = Announce_Message.objects.all()
        serializer = Announce_MessageSerializer(announce_messages, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):

        serializer = Announce_MessageSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Announce_MessageDetail(APIView):

    def get_object(self, pk):

        try:

            return Announce_Message.objects.get(pk=pk)

        except Announce_Message.DoesNotExist:

            raise Http404

    def get(self, request, pk, format=None):

        announce_message = self.get_object(pk)
        serializer = Announce_MessageSerializer(announce_message)

        return Response(serializer.data)

    def put(self, request, pk, format=None):

        annouce_message = self.get_object(pk)
        serializer = Announce_MessageSerializer(annouce_message, data=request.data)

        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):

        announce_message = self.get_object(pk)
        announce_message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


'''