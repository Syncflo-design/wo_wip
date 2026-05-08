# Copyright (c) 2026, NestERP / Manifold SA and contributors
# For license information, please see license.txt
"""
Rename DocTypes shipped in v1.0/v1.1 to their cleaner v1.2 names:

  WO Operator Session    -> Operator Run
  WO Session RM Return   -> Operator Run RM Return

Idempotent. Runs as pre_model_sync so the rename completes before
Frappe re-creates "Operator Run" from the new JSON.
"""

import frappe

RENAMES = [
    # child first to avoid stale parent->child reference during the pivot
    ("WO Session RM Return", "Operator Run RM Return"),
    ("WO Operator Session",  "Operator Run"),
]


def execute():
    for old, new in RENAMES:
        if not frappe.db.exists("DocType", old):
            continue

        if frappe.db.exists("DocType", new):
            # New already present — old is an orphan, drop it.
            try:
                frappe.delete_doc("DocType", old, force=True, ignore_permissions=True)
                frappe.db.commit()
            except Exception as e:
                frappe.log_error(
                    title="wo_wip rename: orphan delete failed",
                    message=f"{old}: {e}",
                )
            continue

        try:
            # rename_doc on a DocType also renames the underlying tab<X> table,
            # preserving any existing rows.
            frappe.rename_doc("DocType", old, new, force=True, merge=False)
            frappe.db.commit()
        except Exception as e:
            # Fallback: if rename fails (e.g. permissions / locked rows in dev),
            # drop the old DocType so Frappe can create the new one fresh from JSON.
            frappe.log_error(
                title="wo_wip rename: rename failed, dropping old",
                message=f"{old}->{new}: {e}",
            )
            try:
                frappe.delete_doc("DocType", old, force=True, ignore_permissions=True)
                frappe.db.commit()
            except Exception:
                pass
