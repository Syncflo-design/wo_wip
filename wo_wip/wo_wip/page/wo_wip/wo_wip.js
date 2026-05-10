frappe.pages["wo-wip"].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: "Works Order — WIP",
        single_column: true,
    });

    const page = wrapper.page;
    wrapper.$wowip = new WOWipPage(page, wrapper);
};

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const CSS = `
<style>
:root {
  --navy:   #1F4E79;
  --navy2:  #2E75B6;
  --green:  #1D6F42;
  --amber:  #B45309;
  --red:    #B91C1C;
  --bg:     #F0F4F8;
  --card:   #FFFFFF;
  --border: #CBD5E1;
  --text:   #1E293B;
  --muted:  #64748B;
}
.ww-wrap { padding: 16px; background: var(--bg); min-height: 100vh; font-family: inherit; }

/* ── WO Cards ── */
.ww-wo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 16px; }
.ww-wo-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 10px;
  padding: 20px; cursor: pointer; transition: box-shadow .15s, transform .1s;
}
.ww-wo-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12); transform: translateY(-2px); }
.ww-wo-card .ww-item-name { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.ww-wo-card .ww-wo-num   { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
.ww-wo-card .ww-stat-row { display: flex; gap: 20px; margin-bottom: 10px; }
.ww-wo-card .ww-stat { text-align: center; }
.ww-wo-card .ww-stat .val { font-size: 22px; font-weight: 700; color: var(--navy); }
.ww-wo-card .ww-stat .lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; }
.ww-progress-track { background: #E2E8F0; border-radius: 4px; height: 8px; margin-top: 6px; }
.ww-progress-bar   { background: var(--navy2); border-radius: 4px; height: 8px; transition: width .4s; }
.ww-badge {
  display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px;
  font-weight: 600; text-transform: uppercase; margin-bottom: 10px;
}
.ww-badge.not-started { background: #FEF3C7; color: #92400E; }
.ww-badge.in-process  { background: #D1FAE5; color: #065F46; }

/* ── Detail View ── */
.ww-detail-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
}
.ww-back-btn {
  background: none; border: 1px solid var(--border); border-radius: 6px;
  padding: 8px 14px; cursor: pointer; font-size: 14px; color: var(--navy);
}
.ww-back-btn:hover { background: var(--bg); }
.ww-detail-title { font-size: 20px; font-weight: 700; color: var(--navy); }
.ww-detail-sub   { font-size: 13px; color: var(--muted); }

/* ── Totals Grid ── */
.ww-totals {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;
}
.ww-total-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 8px;
  padding: 16px; text-align: center;
}
.ww-total-card .big { font-size: 32px; font-weight: 800; }
.ww-total-card .lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; margin-top: 4px; }
.ww-total-card.produced .big { color: var(--navy); }
.ww-total-card.rejected .big { color: var(--red); }
.ww-total-card.good     .big { color: var(--green); }
.ww-total-card.remaining .big { color: var(--amber); }

/* ── Session Log ── */
.ww-sessions-wrap { background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; }
.ww-sessions-head { padding: 14px 18px; font-weight: 600; color: var(--navy); border-bottom: 1px solid var(--border); font-size: 14px; }
.ww-session-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 18px; border-bottom: 1px solid #F1F5F9;
}
.ww-session-row:last-child { border-bottom: none; }
.ww-session-row .op-name { font-weight: 600; color: var(--text); }
.ww-session-row .op-time { font-size: 12px; color: var(--muted); }
.ww-session-row .op-stats { font-size: 13px; color: var(--text); text-align: right; }
.ww-session-status {
  display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
}
.ww-session-status.open { background: #D1FAE5; color: #065F46; }
.ww-session-status.closed { background: #E2E8F0; color: #475569; }

/* ── Action Buttons ── */
.ww-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.ww-btn {
  flex: 1; min-width: 140px; padding: 16px 20px; border: none; border-radius: 8px;
  font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity .15s, transform .1s;
  color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;
}
.ww-btn:hover { opacity: .88; transform: translateY(-1px); }
.ww-btn:active { transform: translateY(0); }
.ww-btn.accept    { background: var(--green); }
.ww-btn.handover  { background: var(--amber); }
.ww-btn.complete  { background: var(--navy); }
.ww-btn.qc        { background: var(--navy2); }
.ww-btn:disabled  { opacity: .4; cursor: not-allowed; transform: none; }

/* ── Modal ── */
.ww-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 2000;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.ww-modal {
  background: var(--card); border-radius: 12px; width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.3);
}
.ww-modal-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
}
.ww-modal-head h3 { margin: 0; font-size: 18px; color: var(--navy); font-weight: 700; }
.ww-modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted); }
.ww-modal-body  { padding: 20px 24px; }
.ww-field { margin-bottom: 18px; }
.ww-field label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.ww-field input, .ww-field textarea {
  width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 6px;
  font-size: 15px; box-sizing: border-box; color: var(--text);
}
.ww-field input:focus, .ww-field textarea:focus { outline: 2px solid var(--navy2); border-color: transparent; }
.ww-rm-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
.ww-rm-table th { background: #F8FAFC; font-size: 12px; font-weight: 600; color: var(--muted); padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); }
.ww-rm-table td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
.ww-rm-table td input { width: 90px; padding: 6px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 14px; }
.ww-modal-foot { padding: 16px 24px 20px; display: flex; gap: 10px; border-top: 1px solid var(--border); }
.ww-modal-btn {
  flex: 1; padding: 14px; border: none; border-radius: 8px; font-size: 15px;
  font-weight: 700; cursor: pointer; color: #fff;
}
.ww-modal-btn.handover  { background: var(--amber); }
.ww-modal-btn.complete  { background: var(--green); }
.ww-modal-btn.cancel    { background: #94A3B8; }

/* ── Empty / Loading ── */
.ww-empty  { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 15px; }
.ww-loader { text-align: center; padding: 60px 20px; color: var(--muted); }
.ww-spinner {
  display: inline-block; width: 36px; height: 36px; border: 3px solid var(--border);
  border-top-color: var(--navy2); border-radius: 50%; animation: spin .7s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── QC Link Row ── */
.ww-qc-link { font-size: 13px; color: var(--navy2); cursor: pointer; text-decoration: underline; }

/* Responsive */
@media (max-width: 600px) {
  .ww-totals { grid-template-columns: repeat(2,1fr); }
  .ww-actions { flex-direction: column; }
  .ww-btn { min-width: unset; }
}
</style>
`;

/* ─────────────────────────────────────────────
   Main class
───────────────────────────────────────────── */
class WOWipPage {
    constructor(page, wrapper) {
        this.page    = page;
        this.wrapper = wrapper;
        this.state   = { view: "list", wo: null, sessions: [], rmItems: [] };

        // inject styles
        if (!document.getElementById("ww-styles")) {
            const el = document.createElement("div");
            el.id = "ww-styles";
            el.innerHTML = CSS;
            document.head.appendChild(el);
        }

        this.container = document.createElement("div");
        this.container.className = "ww-wrap";
        // Frappe v16: page.body is a jQuery object (not a DOM element).
        // v15 had wrapper.main as a raw element. Wrap in $() so jQuery's
        // .append() handles both cases regardless of desk version.
        const $mount = $((page && page.body) || (wrapper && wrapper.main) || wrapper);
        $mount.append(this.container);

        // Refresh button in header
        page.set_secondary_action("Refresh", () => this.render(), "refresh");

        // Deep-link from Work Order form: frappe.route_options = { wo: "MFG-WO-..." }
        // → land directly in that WO's detail view instead of the list.
        const route_options = frappe.route_options || {};
        if (route_options.wo) {
            const wo_name = route_options.wo;
            frappe.route_options = null; // consume so a later render() doesn't re-trigger
            this.deepLinkToWO(wo_name);
            return;
        }

        this.render();
    }

    async deepLinkToWO(wo_name) {
        this.container.innerHTML = `<div class="ww-loader"><div class="ww-spinner"></div><div>Loading work order…</div></div>`;
        try {
            const woRes = await frappe.call({
                method: "frappe.client.get",
                args: { doctype: "Work Order", name: wo_name },
            });
            const wo = woRes.message;
            if (!wo) throw new Error(`Work order ${wo_name} not found`);
            await this.loadDetailData(wo);
            this.goDetail(wo);
        } catch (e) {
            this.container.innerHTML = `<div class="ww-empty">⚠️ Could not open ${frappe.utils.escape_html(wo_name)}.<br><small>${e.message || e}</small></div>`;
        }
    }

    /* ── Routing ── */
    render() {
        if (this.state.view === "list") {
            this.renderList();
        } else {
            this.renderDetail();
        }
    }

    goList() {
        this.state.view = "list";
        this.state.wo   = null;
        this.render();
    }

    goDetail(wo) {
        this.state.view = "detail";
        this.state.wo   = wo;
        this.render();
    }

    /* ── WO List ── */
    async renderList() {
        this.container.innerHTML = `<div class="ww-loader"><div class="ww-spinner"></div><div>Loading work orders…</div></div>`;

        let wos;
        try {
            wos = await frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Work Order",
                    filters: [["status", "in", ["Not Started", "In Process"]]],
                    fields: [
                        "name", "item_name", "item_code", "status",
                        "qty", "produced_qty", "expected_delivery_date",
                        "planned_start_date"
                    ],
                    order_by: "planned_start_date asc",
                    limit: 50,
                },
            });
            wos = wos.message || [];
        } catch(e) {
            this.container.innerHTML = `<div class="ww-empty">⚠️ Could not load work orders.<br><small>${e.message||e}</small></div>`;
            return;
        }

        if (!wos.length) {
            this.container.innerHTML = `<div class="ww-empty">✅ No open work orders right now.</div>`;
            return;
        }

        const cards = wos.map(wo => {
            const pct  = wo.qty > 0 ? Math.min(100, Math.round((wo.produced_qty / wo.qty) * 100)) : 0;
            const remaining = Math.max(0, wo.qty - wo.produced_qty);
            const badgeClass = wo.status === "In Process" ? "in-process" : "not-started";
            return `
            <div class="ww-wo-card" data-wo="${frappe.utils.escape_html(wo.name)}">
              <div class="ww-item-name">${frappe.utils.escape_html(wo.item_name || wo.item_code)}</div>
              <div class="ww-wo-num">${frappe.utils.escape_html(wo.name)}</div>
              <span class="ww-badge ${badgeClass}">${frappe.utils.escape_html(wo.status)}</span>
              <div class="ww-stat-row">
                <div class="ww-stat"><div class="val">${flt(wo.qty, 0)}</div><div class="lbl">Target</div></div>
                <div class="ww-stat"><div class="val">${flt(wo.produced_qty, 0)}</div><div class="lbl">Produced</div></div>
                <div class="ww-stat"><div class="val">${remaining}</div><div class="lbl">Remaining</div></div>
                <div class="ww-stat"><div class="val">${pct}%</div><div class="lbl">Progress</div></div>
              </div>
              <div class="ww-progress-track"><div class="ww-progress-bar" style="width:${pct}%"></div></div>
            </div>`;
        }).join("");

        this.container.innerHTML = `<div class="ww-wo-grid">${cards}</div>`;

        // Bind card clicks
        this.container.querySelectorAll(".ww-wo-card").forEach(card => {
            card.addEventListener("click", async () => {
                const wo = wos.find(w => w.name === card.dataset.wo);
                if (wo) {
                    await this.loadDetailData(wo);
                    this.goDetail(wo);
                }
            });
        });
    }

    /* ── Load detail data ── */
    async loadDetailData(wo) {
        const [sessRes, woFull] = await Promise.all([
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Operator Run",
                    filters: [["work_order", "=", wo.name]],
                    fields: [
                        "name", "operator", "session_status",
                        "accept_time", "close_time",
                        "produced_qty", "reject_count"
                    ],
                    order_by: "accept_time asc",
                    limit: 100,
                },
            }),
            frappe.call({
                method: "frappe.client.get",
                args: { doctype: "Work Order", name: wo.name },
            }),
        ]);

        this.state.sessions = (sessRes.message || []);
        const woDoc = woFull.message || {};

        // Build RM items from required_items
        this.state.rmItems = (woDoc.required_items || []).map(r => ({
            item_code:    r.item_code,
            item_name:    r.item_name || r.item_code,
            required_qty: r.required_qty || 0,
            uom:          r.uom || "",
        }));

        // Recalculate totals from sessions
        const totalProduced = this.state.sessions.reduce((s, r) => s + (r.produced_qty || 0), 0);
        const totalRejects  = this.state.sessions.reduce((s, r) => s + (r.reject_count || 0), 0);
        wo.produced_qty_live = totalProduced;
        wo.reject_count_live = totalRejects;
    }

    /* ── Detail View ── */
    renderDetail() {
        const wo       = this.state.wo;
        const sessions = this.state.sessions;

        const totalProduced = sessions.reduce((s, r) => s + (r.produced_qty || 0), 0);
        const totalRejects  = sessions.reduce((s, r) => s + (r.reject_count || 0), 0);
        const netGood       = Math.max(0, totalProduced - totalRejects);
        const remaining     = Math.max(0, (wo.qty || 0) - totalProduced);

        const openSession   = sessions.find(s => s.session_status === "Open");
        const isMySession   = openSession && openSession.operator === frappe.session.user;
        const canAccept     = !openSession;
        const canClose      = !!isMySession;

        const sessionRows = sessions.length === 0
            ? `<div style="padding:16px 18px;color:var(--muted);font-size:13px;">No sessions yet — press Accept to begin.</div>`
            : sessions.map(s => {
                const isClosed = s.session_status !== "Open";
                const statusLabel = isClosed ? "Closed" : "Open";
                const statusClass = isClosed ? "closed" : "open";
                const closeInfo   = isClosed
                    ? `<div class="op-time">Closed: ${frappe.datetime.str_to_user(s.close_time) || "—"}</div>`
                    : "";
                return `
                <div class="ww-session-row">
                  <div>
                    <div class="op-name">${frappe.utils.escape_html(s.operator)}</div>
                    <div class="op-time">Accepted: ${frappe.datetime.str_to_user(s.accept_time) || "—"}</div>
                    ${closeInfo}
                  </div>
                  <div class="op-stats">
                    <span class="ww-session-status ${statusClass}">${statusLabel}</span><br>
                    Produced: <strong>${flt(s.produced_qty, 0)}</strong> &nbsp;|&nbsp; Rejects: <strong>${s.reject_count || 0}</strong>
                  </div>
                </div>`;
            }).join("");

        this.container.innerHTML = `
          <div class="ww-detail-header">
            <button class="ww-back-btn" id="ww-back">← Back</button>
            <div>
              <div class="ww-detail-title">${frappe.utils.escape_html(wo.item_name || wo.item_code)}</div>
              <div class="ww-detail-sub">${frappe.utils.escape_html(wo.name)} &nbsp;·&nbsp; Target: ${flt(wo.qty, 0)}</div>
            </div>
          </div>

          <div class="ww-totals">
            <div class="ww-total-card produced">
              <div class="big" id="ww-produced">${flt(totalProduced, 0)}</div>
              <div class="lbl">Produced Gross</div>
            </div>
            <div class="ww-total-card rejected">
              <div class="big" id="ww-rejects">${totalRejects}</div>
              <div class="lbl">Rejected</div>
            </div>
            <div class="ww-total-card good">
              <div class="big" id="ww-good">${flt(netGood, 0)}</div>
              <div class="lbl">Net Good</div>
            </div>
            <div class="ww-total-card remaining">
              <div class="big" id="ww-remaining">${flt(remaining, 0)}</div>
              <div class="lbl">Remaining</div>
            </div>
          </div>

          <div class="ww-actions">
            <button class="ww-btn accept"   id="ww-btn-accept"   ${canAccept ? "" : "disabled"}>✅ Accept Run</button>
            <button class="ww-btn handover" id="ww-btn-handover" ${canClose  ? "" : "disabled"}>🔄 Shift Handover</button>
            <button class="ww-btn complete" id="ww-btn-complete" ${canClose  ? "" : "disabled"}>🏁 Complete Run</button>
            <button class="ww-btn qc"       id="ww-btn-qc">🔍 Log QC</button>
          </div>

          <div class="ww-sessions-wrap">
            <div class="ww-sessions-head">Operator Session Log</div>
            ${sessionRows}
          </div>
        `;

        // Back
        document.getElementById("ww-back").addEventListener("click", () => this.goList());

        // Accept
        document.getElementById("ww-btn-accept").addEventListener("click", () => this.doAccept(wo));

        // Handover
        document.getElementById("ww-btn-handover").addEventListener("click", () => {
            if (canClose) this.openCloseModal(wo, openSession, "handover");
        });

        // Complete
        document.getElementById("ww-btn-complete").addEventListener("click", () => {
            if (canClose) this.openCloseModal(wo, openSession, "complete");
        });

        // QC shortcut
        document.getElementById("ww-btn-qc").addEventListener("click", () => {
            frappe.new_doc("Quality Inspection", { reference_type: "Work Order", reference_name: wo.name });
        });
    }

    /* ── Accept ── */
    async doAccept(wo) {
        frappe.confirm(
            `Accept run for <strong>${frappe.utils.escape_html(wo.name)}</strong>?<br>This will open a session under your name.`,
            async () => {
                try {
                    await frappe.call({
                        method: "frappe.client.insert",
                        args: {
                            doc: {
                                doctype:        "Operator Run",
                                work_order:     wo.name,
                                operator:       frappe.session.user,
                                session_status: "Open",
                                accept_time:    frappe.datetime.now_datetime(),
                                produced_qty:   0,
                                reject_count:   0,
                            }
                        }
                    });

                    // If WO is Not Started → update to In Process
                    if (wo.status === "Not Started") {
                        await frappe.call({
                            method: "frappe.client.set_value",
                            args: {
                                doctype: "Work Order",
                                name: wo.name,
                                fieldname: "status",
                                value: "In Process",
                            }
                        });
                        wo.status = "In Process";
                    }

                    frappe.show_alert({ message: "Session accepted ✅", indicator: "green" });
                    await this.loadDetailData(wo);
                    this.renderDetail();
                } catch(e) {
                    frappe.msgprint({ title: "Error", message: e.message || String(e), indicator: "red" });
                }
            }
        );
    }

    /* ── Close Modal (Handover / Complete) ── */
    openCloseModal(wo, session, type) {
        const isHandover = type === "handover";
        const title = isHandover ? "Shift Handover" : "Complete Run";
        const btnClass = isHandover ? "handover" : "complete";
        const btnLabel = isHandover ? "🔄 Hand Over" : "🏁 Complete Run";

        // RM return rows
        const rmRows = this.state.rmItems.map((rm, i) => `
          <tr>
            <td>${frappe.utils.escape_html(rm.item_name)}</td>
            <td style="color:var(--muted)">${flt(rm.required_qty,2)} ${frappe.utils.escape_html(rm.uom)}</td>
            <td><input type="number" min="0" step="0.001" class="ww-rm-return-qty" data-idx="${i}" placeholder="0"></td>
            <td style="color:var(--muted)">${frappe.utils.escape_html(rm.uom)}</td>
          </tr>`).join("");

        const rmSection = this.state.rmItems.length > 0 ? `
          <div class="ww-field">
            <label>RM Returns to Store</label>
            <table class="ww-rm-table">
              <thead><tr><th>Item</th><th>Required Qty</th><th>Return Qty</th><th>UOM</th></tr></thead>
              <tbody>${rmRows}</tbody>
            </table>
          </div>` : "";

        const overlay = document.createElement("div");
        overlay.className = "ww-modal-overlay";
        overlay.innerHTML = `
          <div class="ww-modal">
            <div class="ww-modal-head">
              <h3>${title}</h3>
              <button class="ww-modal-close" id="ww-close-x">✕</button>
            </div>
            <div class="ww-modal-body">
              <div class="ww-field">
                <label>Produced Qty (this shift)</label>
                <input type="number" id="ww-modal-produced" min="0" step="1" placeholder="0">
              </div>
              <div class="ww-field">
                <label>Reject Count (this shift)</label>
                <input type="number" id="ww-modal-rejects" min="0" step="1" placeholder="0">
              </div>
              ${rmSection}
              <div class="ww-field">
                <label>Activity Notes ${isHandover ? "(required for handover)" : "(optional)"}</label>
                <textarea id="ww-modal-notes" rows="4" placeholder="Describe any issues, settings changes, observations…"></textarea>
              </div>
            </div>
            <div class="ww-modal-foot">
              <button class="ww-modal-btn cancel" id="ww-modal-cancel">Cancel</button>
              <button class="ww-modal-btn ${btnClass}" id="ww-modal-submit">${btnLabel}</button>
            </div>
          </div>`;

        document.body.appendChild(overlay);

        const remove = () => document.body.removeChild(overlay);

        document.getElementById("ww-close-x").addEventListener("click", remove);
        document.getElementById("ww-modal-cancel").addEventListener("click", remove);
        document.getElementById("ww-modal-submit").addEventListener("click", async () => {
            const producedQty  = parseFloat(document.getElementById("ww-modal-produced").value) || 0;
            const rejectCount  = parseInt(document.getElementById("ww-modal-rejects").value)   || 0;
            const notes        = document.getElementById("ww-modal-notes").value.trim();

            if (isHandover && !notes) {
                frappe.msgprint({ title: "Notes Required", message: "Please add activity notes before handing over.", indicator: "orange" });
                return;
            }

            // Build RM returns
            const rmReturns = [];
            document.querySelectorAll(".ww-rm-return-qty").forEach(inp => {
                const idx = parseInt(inp.dataset.idx);
                const qty = parseFloat(inp.value) || 0;
                if (qty > 0) {
                    const rm = this.state.rmItems[idx];
                    rmReturns.push({
                        item_code:    rm.item_code,
                        item_name:    rm.item_name,
                        required_qty: rm.required_qty,
                        return_qty:   qty,
                        uom:          rm.uom,
                    });
                }
            });

            const newStatus = isHandover ? "Closed - Handover" : "Closed - Run Complete";

            try {
                await frappe.call({
                    method: "frappe.client.set_value",
                    args: {
                        doctype:   "Operator Run",
                        name:      session.name,
                        fieldname: {
                            session_status: newStatus,
                            produced_qty:   producedQty,
                            reject_count:   rejectCount,
                            activity_notes: notes,
                            close_time:     frappe.datetime.now_datetime(),
                        }
                    }
                });

                // Save RM returns if any
                if (rmReturns.length > 0) {
                    const sessDoc = await frappe.call({
                        method: "frappe.client.get",
                        args: { doctype: "Operator Run", name: session.name }
                    });
                    if (sessDoc.message) {
                        sessDoc.message.rm_returns = rmReturns;
                        await frappe.call({
                            method: "frappe.client.save",
                            args: { doc: sessDoc.message }
                        });
                    }
                }

                // If complete run → update WO status
                if (!isHandover) {
                    await frappe.call({
                        method: "frappe.client.set_value",
                        args: {
                            doctype: "Work Order",
                            name: wo.name,
                            fieldname: "produced_qty",
                            value: this.state.sessions.reduce((s,r) => s + (r.produced_qty||0), 0) + producedQty,
                        }
                    });
                }

                remove();
                frappe.show_alert({ message: isHandover ? "Handover recorded ✅" : "Run completed ✅", indicator: "green" });
                await this.loadDetailData(wo);
                this.renderDetail();

            } catch(e) {
                frappe.msgprint({ title: "Error", message: e.message || String(e), indicator: "red" });
            }
        });

        // Close on overlay click
        overlay.addEventListener("click", e => { if (e.target === overlay) remove(); });
    }
}

/* helper - safe float formatting */
function flt(val, decimals) {
    const n = parseFloat(val) || 0;
    return decimals === 0 ? Math.round(n).toLocaleString() : n.toFixed(decimals);
}
