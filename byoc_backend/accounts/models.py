from django.db import models
from django.contrib.auth.models import User




class CloudAccount(models.Model):
    CLOUD_CHOICES = [
        ('aws', 'AWS'),
        ('gcp', 'GCP'),
        ('azure', 'Azure'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='cloud_accounts'
    )
    cloud_provider = models.CharField(
        max_length=10,
        choices=CLOUD_CHOICES
    )
    account_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.cloud_provider}"


class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"


class Invoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    invoice_id = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('paid', 'Paid'), ('pending', 'Pending'), ('overdue', 'Overdue')])
    issue_date = models.DateField()
    due_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.invoice_id}"



