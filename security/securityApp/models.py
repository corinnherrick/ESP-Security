from __future__ import unicode_literals

from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from multiselectfield import MultiSelectField

SKILL_CHOICES = (
        ('AD', 'Admin'),
        ('AV', 'Projector Troubleshooting'),
        ('KC', 'Knows Campus'),
        ('FA', 'First Aid Trained'),
)

class Task(models.Model):
    PRIORITY_CHOICES = (
        ('UR', 'Urgent'),
        ('ME', 'Medium'),
        ('NU', 'Not urgent, but needs to happen'),
        ('NI', 'Would be nice'),
    )

    STATUS_CHOICES = (
        ('TD', 'Todo'),
        ('IP', 'In Progress'),
        ('CP', 'Completed'),
        ('VO', 'Voided')
    )

    description = models.TextField()
    priority = models.CharField(max_length=2, choices=PRIORITY_CHOICES)
    skills = MultiSelectField(max_length=2, choices=SKILL_CHOICES, blank=True)
    min_time = models.DateTimeField()
    max_time = models.DateTimeField()
    volunteers = models.ManyToManyField('Volunteer', blank=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='TD')

    def __str__(self):
        return description

class Volunteer(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = PhoneNumberField()
    can_text = models.BooleanField()
    currently_here = models.BooleanField(default=False)
    skills = MultiSelectField(max_length=2, choices=SKILL_CHOICES, blank=True)
    shifts = models.ManyToManyField('Shift', blank=True)
    comments = models.TextField(blank=True)
    
    def __str__(self):
        return self.first_name + " " + self.last_name

class Shift(models.Model):
    time_in = models.DateTimeField()
    time_out = models.DateTimeField()
    
    def __str__(self):
        return str(self.time_in) + " - " + str(self.time_out)

