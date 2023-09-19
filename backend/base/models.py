from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', symmetrical=True)
    blocked = models.ManyToManyField('self', symmetrical=True, related_name='blocked_by')
    
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'


class Chat(models.Model):
    participants = models.ManyToManyField(Contact, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    is_group_chat = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
    
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(Contact, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20)
    text = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='message_photos/', blank=True, null=True)
    file = models.FileField(upload_to='message_files/', blank=True, null=True)
    audio = models.FileField(upload_to='message_audio/', blank=True, null=True) 
    timestamp = models.DateTimeField(auto_now_add=True)    
    
    def __str__(self):
        return f'{self.chat} - {self.sender}'