# Generated by Django 5.1.4 on 2025-05-10 17:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trip', '0004_alter_trip_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='preferences',
        ),
    ]
