# Generated by Django 4.2.5 on 2023-09-25 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_alter_chat_title_alter_contact_blocked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='title',
            field=models.CharField(default='', max_length=255),
        ),
    ]
