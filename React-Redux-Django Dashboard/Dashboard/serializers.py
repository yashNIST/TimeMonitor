from rest_framework import serializers
from .models import Announce_Message

class Announce_MessageSerializer(serializers.ModelSerializer):

    class Meta:

        model = Announce_Message
        fields = '__all__'