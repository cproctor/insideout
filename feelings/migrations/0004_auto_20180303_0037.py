# Generated by Django 2.0.2 on 2018-03-03 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feelings', '0003_auto_20180228_1312'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='person',
            name='pet_name',
        ),
        migrations.AddField(
            model_name='classroom',
            name='food',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='classroom',
            name='play',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='classroom',
            name='water',
            field=models.IntegerField(default=0),
        ),
    ]
