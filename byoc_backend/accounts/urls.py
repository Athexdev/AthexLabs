from django.urls import path
from .views import current_user
from .views import health_check, signup, login_user , hello_world,debesh
from .views import connect_cloud
from .views import list_cloud_accounts
from .views import list_cloud_resources, resource_action
from .views import admin_list_all_cloud_accounts, update_profile
from .views import dashboard_analytics, list_activity_logs, list_invoices, download_invoice





urlpatterns = [
    path('health/', health_check),
    path('signup/', signup),
    path('login/', login_user),
    path('hello/', hello_world),
    path('me/', current_user),
    path('debesh/',debesh),
    path('cloud/connect/', connect_cloud),
    path('cloud/accounts/', list_cloud_accounts),
    path('cloud/<int:account_id>/resources/', list_cloud_resources),
    path('cloud/<int:account_id>/resources/<str:resource_id>/action/', resource_action),
    path('admin/cloud/accounts/', admin_list_all_cloud_accounts),
    path('dashboard/analytics/', dashboard_analytics),
    path('me/update/', update_profile),
    path('activity/logs/', list_activity_logs),
    path('billing/invoices/', list_invoices),
    path('billing/invoices/<str:invoice_id>/download/', download_invoice),
]