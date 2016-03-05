from django.contrib import admin

from .models import Volunteer, Task, Shift, Skill

admin.site.register(Volunteer)
admin.site.register(Task)
admin.site.register(Shift)
admin.site.register(Skill)
