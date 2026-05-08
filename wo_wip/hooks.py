app_name        = "wo_wip"
app_title       = "WO WIP"
app_publisher   = "NestERP / Manifold SA"
app_description = "Works Order WIP operator screen for shop floor"
app_email       = "ops@syncflo.co.za"
app_license     = "MIT"
app_icon        = "octicon octicon-pulse"

# -------------------------------------------------------------
# Lifecycle hooks - bootstrap the custom "Warehouse Operator"
# role on first install and re-assert on every migrate.
# -------------------------------------------------------------
before_install = "wo_wip.install.before_install"
after_migrate  = "wo_wip.install.after_migrate"

# -------------------------------------------------------------
# Role-based home pages - operators land on the WIP page.
# -------------------------------------------------------------
role_home_page = {
    "Manufacturing User": "wo-wip",
    "Warehouse Operator": "wo-wip",
}

# -------------------------------------------------------------
# Form-script extensions on standard ERPNext doctypes.
# Adds the Start-Session and Open-WIP-Screen buttons to the
# Work Order form (Production Planner + Operator workflows).
# -------------------------------------------------------------
doctype_js = {
    "Work Order": "public/js/work_order_extensions.js",
}

# -------------------------------------------------------------
# Fixtures - export this app's Workspace only. DocTypes ship
# via JSON in their doctype/ folders, not as fixtures.
# -------------------------------------------------------------
fixtures = [
    {"doctype": "Workspace", "filters": [["module", "=", "WO WIP"]]},
]
