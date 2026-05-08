app_name        = "wo_wip"
app_title       = "WO WIP"
app_publisher   = "NestERP / Manifold SA"
app_description = "Works Order WIP operator screen for shop floor"
app_version     = "1.0.0"
app_icon        = "octicon octicon-pulse"
app_color       = "#1F4E79"

# Role home page
role_home_page = {
    "Manufacturing User": "wo-wip",
    "Warehouse Operator": "wo-wip",
}

# Fixtures — export workspace with this module
fixtures = [
    {"doctype": "Workspace", "filters": [["module", "=", "WO WIP"]]},
    {"doctype": "Custom DocType", "filters": [["module", "=", "WO WIP"]]},
]

# DocTypes defined in this app
override_doctype_class = {}

doc_events = {}
