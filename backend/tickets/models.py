from django.db import models

class Ticket(models.Model):

    CATEGORY = [
        ("billing","billing"),
        ("technical","technical"),
        ("account","account"),
        ("general","general"),
    ]

    PRIORITY = [
        ("low","low"),
        ("medium","medium"),
        ("high","high"),
        ("critical","critical"),
    ]

    STATUS = [
        ("open","open"),
        ("in_progress","in_progress"),
        ("resolved","resolved"),
        ("closed","closed"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY)
    priority = models.CharField(max_length=20, choices=PRIORITY)
    status = models.CharField(max_length=20, choices=STATUS, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
