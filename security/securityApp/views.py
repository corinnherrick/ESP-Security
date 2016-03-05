from django.conf import settings
from django.shortcuts import render
from django.views.generic.base import TemplateView
from .forms import TaskForm

class AppView(TemplateView):
    template_name = "securityApp/index.html"

    def get_context_data(self, **kwargs):
        context = super(AppView, self).get_context_data(**kwargs)
        context['STATIC_URL'] = settings.STATIC_URL
        return context

