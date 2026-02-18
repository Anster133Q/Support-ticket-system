from google import genai
import os
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets

from django.db.models import Q

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        if p.get("category"):
            qs = qs.filter(category=p["category"])
        if p.get("priority"):
            qs = qs.filter(priority=p["priority"])
        if p.get("status"):
            qs = qs.filter(status=p["status"])
        if p.get("search"):
            qs = qs.filter(
                Q(title__icontains=p["search"]) |
                Q(description__icontains=p["search"])
            )
        return qs


@api_view(["POST"])
def classify_view(request):
    desc = request.data.get("description", "")

    if not desc.strip():
        return Response(
            {"error": "Description is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing GEMINI_API_KEY")

        client = genai.Client(api_key=api_key)

        prompt = f"""
Classify this support ticket.
Return ONLY JSON:
{{"suggested_category":"billing","suggested_priority":"low"}}
Categories: billing technical account general
Priorities: low medium high critical
Text: {desc}
"""

        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = resp.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)

        if "suggested_category" not in result or "suggested_priority" not in result:
            raise ValueError("Invalid format")

        return Response(result)

    except Exception as e:
        print("AI classify error:", e)
        return Response({
            "suggested_category": "general",
            "suggested_priority": "low"
        })


@api_view(["GET"])
def stats_view(request):
    data = {
        "by_status": {
            k: Ticket.objects.filter(status=k).count()
            for k, _ in Ticket.STATUS_CHOICES
        },
        "by_priority": {
            k: Ticket.objects.filter(priority=k).count()
            for k, _ in Ticket.PRIORITY_CHOICES
        },
        "by_category": {
            k: Ticket.objects.filter(category=k).count()
            for k, _ in Ticket.CATEGORY_CHOICES
        }
    }
    return Response(data)
