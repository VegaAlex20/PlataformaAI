# serializers.py
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'role_display',
            'get_full_name',
            'get_short_name',
        )
