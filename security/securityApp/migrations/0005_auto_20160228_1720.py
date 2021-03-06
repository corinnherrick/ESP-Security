# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-28 22:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('securityApp', '0004_auto_20160227_0203'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('necessary', models.BooleanField(default=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='task',
            name='skills',
        ),
        migrations.RemoveField(
            model_name='volunteer',
            name='skills',
        ),
        migrations.AddField(
            model_name='task',
            name='skills',
            field=models.ManyToManyField(blank=True, to='securityApp.Skill'),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='skills',
            field=models.ManyToManyField(blank=True, to='securityApp.Skill'),
        ),
    ]
