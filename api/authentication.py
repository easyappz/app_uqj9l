from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Member


class TokenAuthentication(BaseAuthentication):
    """Custom token authentication for Member model"""
    keyword = 'Token'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed('Invalid token header. Expected format: Token <token>')
        
        token = parts[1]
        
        try:
            member = Member.objects.get(token=token)
        except Member.DoesNotExist:
            raise AuthenticationFailed('Invalid token')
        
        return (member, token)

    def authenticate_header(self, request):
        return self.keyword
