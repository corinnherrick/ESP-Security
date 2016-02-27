from django.contrib import admin

from .models import Volunteer, Task, Shift

admin.site.register(Volunteer)
admin.site.register(Task)
admin.site.register(Shift)
