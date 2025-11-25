from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
from .models import Member, Message
from .serializers import MemberSerializer, MessageSerializer
from .authentication import TokenAuthentication


class RegisterView(APIView):
    """API endpoint for member registration"""
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        login = request.data.get('login')

        if not username or not login:
            return Response(
                {'error': 'Username and login are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Member.objects.filter(login=login).exists():
            return Response(
                {'error': 'Login already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Member.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = get_random_string(64)
        member = Member.objects.create(
            username=username,
            login=login,
            token=token
        )

        serializer = MemberSerializer(member)
        return Response(
            {
                'token': token,
                'member': serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    """API endpoint for member login"""
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        login = request.data.get('login')

        if not login:
            return Response(
                {'error': 'Login is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            member = Member.objects.get(login=login)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not member.token:
            member.token = get_random_string(64)
            member.save()

        serializer = MemberSerializer(member)
        return Response(
            {
                'token': member.token,
                'member': serializer.data
            },
            status=status.HTTP_200_OK
        )


class MeView(APIView):
    """API endpoint for getting current member data"""
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = MemberSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessagesView(APIView):
    """API endpoint for getting all messages and creating new messages"""
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        """Get all messages in chronological order"""
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        messages = Message.objects.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new message"""
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        text = request.data.get('text')

        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        message = Message.objects.create(
            member=request.user,
            text=text
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
