// Copyright (c) 2026, NestERP / Manifold SA and contributors
// For license information, please see license.txt
//
// Form-script extension: adds WIP-related buttons to the Work Order form.
// Loaded via hooks.doctype_js on every Work Order form load.

frappe.ui.form.on("Work Order", {
    refresh(frm) {
        if (frm.is_new()) return;

        // Only show on workable WOs - hide for completed/cancelled/stopped.
        const workable = ["Not Started", "In Process"];
        if (!workable.includes(frm.doc.status)) return;

        // ── Start Operator Run ─────────────────────────
        // Opens a fresh "Operator Run" form with this WO pre-filled.
        // Production planner picks the operator + saves; operator can also
        // self-start from here.
        frm.add_custom_button(
            __("Start Operator Run"),
            () => {
                frappe.new_doc("Operator Run", {
                    work_order:     frm.doc.name,
                    session_status: "Open",
                    accept_time:    frappe.datetime.now_datetime(),
                });
            },
            __("WIP")
        );

        // ── Open WIP Screen ────────────────────────────────
        // Jumps to the operator-friendly /app/wo-wip page, deep-linked
        // straight into THIS work order's detail view.
        frm.add_custom_button(
            __("Open WIP Screen"),
            () => {
                frappe.route_options = { wo: frm.doc.name };
                frappe.set_route("wo-wip");
            },
            __("WIP")
        );
    },
});
