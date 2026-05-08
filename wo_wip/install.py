# Copyright (c) 2026, NestERP / Manifold SA and contributors
# For license information, please see license.txt
"""
Install / migrate hooks for wo_wip.

The DocType permission rows in this app reference a custom
"Warehouse Operator" role that is not part of stock ERPNext.
We create it here so that:

* `before_install` — runs before DocType sync, so by the time
  the perm rows are written the Role row exists.
* `after_migrate`  — runs on every `bench migrate`, so the role
  is re-asserted if a future ops action removes it.

Both paths are idempotent.
"""

import frappe

WAREHOUSE_OPERATOR_ROLE = "Warehouse Operator"


def before_install():
    _ensure_warehouse_operator_role()


def after_migrate():
    _ensure_warehouse_operator_role()


def _ensure_warehouse_operator_role():
    if frappe.db.exists("Role", WAREHOUSE_OPERATOR_ROLE):
        return

    frappe.get_doc(
        {
            "doctype": "Role",
            "role_name": WAREHOUSE_OPERATOR_ROLE,
            "desk_access": 1,
            "two_factor_auth": 0,
            "disabled": 0,
        }
    ).insert(ignore_permissions=True)
    frappe.db.commit()
