from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.dispatch import receiver

User = get_user_model()

@receiver(post_save, sender=User)
def assign_user_group(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'profesor':
            group, _ = Group.objects.get_or_create(name='Profesor')
        else:
            group, _ = Group.objects.get_or_create(name='Estudiante')
        
        instance.groups.add(group)
