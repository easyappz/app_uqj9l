from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    MeView,
    MessagesView
)

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/me', MeView.as_view(), name='me'),
    path('messages', MessagesView.as_view(), name='messages'),
]
