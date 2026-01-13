from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from .models import CloudAccount, ActivityLog, Invoice


def log_activity(user, action, details=None):
    ActivityLog.objects.create(user=user, action=action, details=details)

def debesh(requests):
    return JsonResponse({
        "message":"hello user !!! how are you ?"
    })
def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "BYOC backend is running Well"
    })

def hello_world(request):
    return JsonResponse({
        "message": "api test sahi hai!"
    })

@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON body"},
            status=400
        )

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"error": "User already exists"},
            status=400
        )

    User.objects.create_user(
        username=username,
        password=password
    )

    return JsonResponse(
        {"message": "User created successfully"},
        status=201
    )

@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON body"},
            status=400
        )

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required"},
            status=400
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse(
            {"error": "Invalid credentials"},
            status=401
        )

    refresh = RefreshToken.for_user(user)
    
    log_activity(user, "User Login", "User logged in successfully")

    return JsonResponse({
        "message": "Login successful",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user

    return Response({
        "id": user.id,
        "username": user.username
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connect_cloud(request):
    user = request.user

    cloud_provider = request.data.get('cloud_provider')
    account_name = request.data.get('account_name')

    valid_providers = ["aws", "gcp", "azure"]

    if cloud_provider not in valid_providers:
        return Response({
            "success": False,
            "error": "Invalid cloud provider"
        }, status=400)

    if not cloud_provider or not account_name:
        return Response({
        "success": False,
        "error": "cloud_provider and account_name are required"
    }, status=400)


    cloud_account = CloudAccount.objects.create(
        user=user,
        cloud_provider=cloud_provider,
        account_name=account_name
    )

    log_activity(user, "Connected Cloud Account", f"Connected {cloud_provider} account: {account_name}")

    return Response({
    "success": True,
    "data": {
        "id": cloud_account.id,
        "cloud_provider": cloud_account.cloud_provider,
        "account_name": cloud_account.account_name
    }
}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cloud_accounts(request):
    user = request.user

    cloud_accounts = CloudAccount.objects.filter(user=user)

    data = []
    for account in cloud_accounts:
        data.append({
            "id": account.id,
            "cloud_provider": account.cloud_provider,
            "account_name": account.account_name,
            "created_at": account.created_at
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cloud_resources(request, account_id):
    user = request.user

    try:
        account = CloudAccount.objects.get(id=account_id, user=user)
    except CloudAccount.DoesNotExist:
        return Response({
    "success": False,
    "error": "Cloud account not found or not yours"
}, status=404)

    if account.cloud_provider == 'aws':
        resources = [
            {"id": "ec2-001", "type": "EC2 Instance", "status": "running"},
            {"id": "ec2-002", "type": "EC2 Instance", "status": "stopped"}
        ]
    elif account.cloud_provider == 'gcp':
        resources = [
            {"id": "vm-10", "type": "Compute VM", "status": "running"}
        ]
    else:
        resources = [
            {"id": "az-01", "type": "Azure VM", "status": "running"}
        ]


    return Response({
    "success": True,
    "data": {
        "account": account.account_name,
        "provider": account.cloud_provider,
        "resources": resources
    }
})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_all_cloud_accounts(request):
    user = request.user

    if not user.is_staff:
        return Response({
            "success": False,
            "error": "Admin access only"
        }, status=403)

    accounts = CloudAccount.objects.all()

    data = []
    for acc in accounts:
        data.append({
            "id": acc.id,
            "user": acc.user.username,
            "provider": acc.cloud_provider,
            "account_name": acc.account_name
        })

    return Response({
        "success": True,
        "data": data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    user = request.user
    accounts = CloudAccount.objects.filter(user=user)

    # Mock aggregation logic
    total_cost = 0
    resource_distribution = {"EC2": 0, "RDS": 0, "S3": 0, "Lambda": 0}
    cost_history = [
        {"month": "Jan", "cost": 0},
        {"month": "Feb", "cost": 0},
        {"month": "Mar", "cost": 0},
        {"month": "Apr", "cost": 0},
        {"month": "May", "cost": 0},
        {"month": "Jun", "cost": 0},
    ]

    for account in accounts:
        # Simulate data based on provider
        if account.cloud_provider == 'aws':
            total_cost += 120.50
            resource_distribution["EC2"] += 5
            resource_distribution["RDS"] += 2
            resource_distribution["S3"] += 10
            for i, data in enumerate(cost_history):
                data["cost"] += (100 + i * 10) # Increasing trend
        elif account.cloud_provider == 'gcp':
            total_cost += 85.20
            resource_distribution["EC2"] += 3 # Mapping Compute Engine to generic EC2/Compute category
            resource_distribution["Lambda"] += 5 # functions
            for i, data in enumerate(cost_history):
                data["cost"] += (80 + i * 5)
        elif account.cloud_provider == 'azure':
            total_cost += 95.00
            resource_distribution["RDS"] += 1
            resource_distribution["EC2"] += 4
            for i, data in enumerate(cost_history):
                data["cost"] += (90 + i * 8)
    
    return Response({
        "success": True,
        "data": {
            "total_cost": round(total_cost, 2),
            "resource_distribution": [
                {"name": k, "value": v} for k, v in resource_distribution.items() if v > 0
            ],
            "cost_history": cost_history
        }
    })






@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resource_action(request, account_id, resource_id):
    user = request.user
    
    try:
        account = CloudAccount.objects.get(id=account_id, user=user)
    except CloudAccount.DoesNotExist:
        return Response({
            "success": False,
            "error": "Cloud account not found or not yours"
        }, status=404)

    action = request.data.get('action') # start, stop, reboot

    if action not in ['start', 'stop', 'reboot']:
        return Response({
            "success": False,
            "error": "Invalid action. Must be start, stop, or reboot."
        }, status=400)

    # Mocking the action delay and success
    import time
    # time.sleep(1) # Simulate network delay if needed, but keeping it fast for now

    # In a real app, we would call boto3 or google-cloud-sdk here.
    # For now, we just return the new expected status.
    
    new_status = "running"
    if action == "stop":
        new_status = "stopped"
    elif action == "start":
        new_status = "running"
    elif action == "reboot":
        new_status = "running"
    
    log_activity(user, f"Resource {action}", f"Initiated {action} on {resource_id} (Account: {account.account_name})")

    return Response({
        "success": True,
        "message": f"Successfully initiated {action} on {resource_id}",
        "new_status": new_status
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    # Update basic info
    if 'username' in data:
        if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
            return Response({"success": False, "error": "Username already taken"}, status=400)
        user.username = data['username']
    
    if 'email' in data:
        user.email = data['email']

    # Update password if provided
    if 'new_password' in data and data['new_password']:
        if 'current_password' not in data:
            return Response({"success": False, "error": "Current password required to change password"}, status=400)
        
        if not user.check_password(data['current_password']):
            return Response({"success": False, "error": "Incorrect current password"}, status=400)
        
        user.set_password(data['new_password'])

    user.save()

    return Response({
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_activity_logs(request):
    user = request.user
    logs = ActivityLog.objects.filter(user=user).order_by('-created_at')[:50] # Last 50 actions

    data = []
    for log in logs:
        data.append({
            "id": log.id,
            "action": log.action,
            "details": log.details,
            "created_at": log.created_at
        })
    
    return Response({
        "success": True,
        "data": data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_invoices(request):
    user = request.user
    invoices = Invoice.objects.filter(user=user).order_by('-issue_date')

    data = []
    if not invoices.exists():
        # Mock data for demonstration if DB is empty
        data = [
            {
                "id": 1,
                "invoice_id": "INV-2024-001",
                "amount": 120.50,
                "status": "paid",
                "issue_date": "2024-01-01",
                "due_date": "2024-01-15"
            },
            {
                "id": 2,
                "invoice_id": "INV-2024-002",
                "amount": 85.20,
                "status": "pending",
                "issue_date": "2024-02-01",
                "due_date": "2024-02-15"
            }
        ]
    else:
        for inv in invoices:
            data.append({
                "id": inv.id,
                "invoice_id": inv.invoice_id,
                "amount": float(inv.amount),
                "status": inv.status,
                "issue_date": inv.issue_date,
                "due_date": inv.due_date
            })

    return Response({
        "success": True,
        "data": data
    })


from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import io

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, invoice_id):
    user = request.user
    
    # Try to find the invoice
    invoice_data = None
    try:
        inv = Invoice.objects.get(invoice_id=invoice_id, user=user)
        invoice_data = {
            "invoice_id": inv.invoice_id,
            "amount": float(inv.amount),
            "status": inv.status,
            "issue_date": str(inv.issue_date),
            "due_date": str(inv.due_date)
        }
    except Invoice.DoesNotExist:
        # Check mock data as fallback
        mock_invoices = [
            {
                "invoice_id": "INV-2024-001",
                "amount": 120.50,
                "status": "paid",
                "issue_date": "2024-01-01",
                "due_date": "2024-01-15"
            },
            {
                "invoice_id": "INV-2024-002",
                "amount": 85.20,
                "status": "pending",
                "issue_date": "2024-02-01",
                "due_date": "2024-02-15"
            }
        ]
        for m in mock_invoices:
            if m["invoice_id"] == invoice_id:
                invoice_data = m
                break
    
    if not invoice_data:
        return Response({"error": "Invoice not found"}, status=404)

    # Create PDF
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 24)
    p.setFillColor(colors.HexColor("#0f172a")) # Slate 900
    p.drawString(50, height - 50, "AthexLabs")
    
    p.setFont("Helvetica", 10)
    p.setFillColor(colors.HexColor("#64748b")) # Slate 500
    p.drawString(50, height - 70, "Cloud Management Platform")

    p.setFont("Helvetica-Bold", 30)
    p.setFillColor(colors.HexColor("#3b82f6")) # Blue 500
    p.drawRightString(width - 50, height - 60, "INVOICE")

    # Divider
    p.setStrokeColor(colors.HexColor("#e2e8f0"))
    p.line(50, height - 90, width - 50, height - 90)

    # Invoice Details
    y = height - 130
    p.setFont("Helvetica-Bold", 12)
    p.setFillColor(colors.black)
    p.drawString(50, y, f"Invoice ID: {invoice_data['invoice_id']}")
    p.drawRightString(width - 50, y, f"Date: {invoice_data['issue_date']}")

    y -= 20
    p.setFont("Helvetica", 12)
    p.drawString(50, y, f"Bill To: {user.username}")
    p.drawRightString(width - 50, y, f"Due Date: {invoice_data['due_date']}")

    # Table Header
    y -= 50
    p.setFillColor(colors.HexColor("#f1f5f9")) # Slate 100
    p.rect(50, y - 5, width - 100, 25, fill=1, stroke=0)
    
    p.setFont("Helvetica-Bold", 10)
    p.setFillColor(colors.black)
    p.drawString(60, y + 2, "DESCRIPTION")
    p.drawRightString(width - 60, y + 2, "AMOUNT")

    # Table Row
    y -= 30
    p.setFont("Helvetica", 10)
    p.drawString(60, y, "Cloud Infrastructure Services")
    p.drawRightString(width - 60, y, f"${invoice_data['amount']:.2f}")

    # Divider
    y -= 20
    p.setStrokeColor(colors.HexColor("#e2e8f0"))
    p.line(50, y, width - 50, y)

    # Total
    y -= 30
    p.setFont("Helvetica-Bold", 14)
    p.drawRightString(width - 60, y, f"Total: ${invoice_data['amount']:.2f}")
    
    # Status Badge
    y -= 40
    status_color = colors.green if invoice_data['status'] == 'paid' else colors.orange
    p.setFillColor(status_color)
    p.setFont("Helvetica-Bold", 12)
    p.drawRightString(width - 60, y, f"Status: {invoice_data['status'].upper()}")

    # Footer
    p.setFont("Helvetica", 8)
    p.setFillColor(colors.HexColor("#94a3b8"))
    p.drawString(50, 50, "Thank you for choosing AthexLabs.")
    p.drawRightString(width - 50, 50, "support@athexlabs.com")

    p.showPage()
    p.save()

    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_{invoice_id}.pdf"'
    return response
