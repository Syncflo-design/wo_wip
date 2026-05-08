# Copyright (c) 2026, NestERP / Manifold SA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class WOOperatorSession(Document):

    def validate(self):
        if not self.accept_time:
            self.accept_time = now_datetime()

    def before_save(self):
        # If closing, record close time
        if self.session_status in ("Closed - Handover", "Closed - Run Complete"):
            if not self.close_time:
                self.close_time = now_datetime()
