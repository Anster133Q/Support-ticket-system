from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, stats_view, classify_view

router = DefaultRouter()
router.register("tickets", TicketViewSet)

urlpatterns = [
    path("tickets/classify/", classify_view),
    path("tickets/stats/", stats_view),
] + router.urls
