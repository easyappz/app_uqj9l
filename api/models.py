from django.db import models


class Member(models.Model):
    """Custom user model for application users"""
    username = models.CharField(max_length=150, unique=True)
    login = models.CharField(max_length=150, unique=True)
    token = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "members"
        ordering = ['-created_at']

    def __str__(self):
        return self.username

    @property
    def is_authenticated(self):
        """Always return True for Member instances"""
        return True

    @property
    def is_anonymous(self):
        """Always return False for Member instances"""
        return False

    def has_perm(self, perm, obj=None):
        """Return True if the member has the specified permission"""
        return True

    def has_module_perms(self, app_label):
        """Return True if the member has permissions to view the app `app_label`"""
        return True


class Message(models.Model):
    """Model for storing messages from members"""
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"Message by {self.member.username} at {self.created_at}"
