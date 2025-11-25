from rest_framework import serializers
from .models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model"""
    class Meta:
        model = Member
        fields = ['id', 'username', 'login', 'created_at']
        read_only_fields = ['id', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model"""
    username = serializers.CharField(source='member.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'text', 'username', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']
