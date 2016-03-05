from tastypie.resources import ModelResource
from tastypie import fields
from securityApp.models import Task, Volunteer, Shift, Skill
from tastypie.authorization import Authorization

class TaskResource(ModelResource):
    skills = fields.ManyToManyField('securityApp.api.resources.SkillResource', 'skills', null=True, full=True)
    volunteers = fields.ManyToManyField('securityApp.api.resources.VolunteerResource', 'volunteers', null=True, full=True)
    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()

class VolunteerResource(ModelResource):
    class Meta:
        queryset = Volunteer.objects.all()
        resource_name = 'volunteer'
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()
        filtering = {
            "currently_here": {'exact',},
            }

class ShiftResource(ModelResource):
    class Meta:
        queryset = Shift.objects.all()
        resource_name = 'shift'
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()

class SkillResource(ModelResource):
    class Meta:
        queryset = Skill.objects.all()
        resource_name = 'skill'
        allowed_methods = ['get']
        authorization = Authorization()
