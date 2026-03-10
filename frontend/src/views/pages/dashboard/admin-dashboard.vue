<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Greeting Section -->
        <div class="row mb-3">
          <div class="col-12">
            <h4 class="dash-greeting">
              <span class="wave-emoji">👋</span> Hi {{ userName }}
            </h4>
          </div>
        </div>

        <!-- Date Filter Bar -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="dash-filter-bar">
              <div class="dash-filter-group">
                <div class="dash-filter-item">
                  <input
                    type="date"
                    class="form-control dash-date-input"
                    v-model="dateFrom"
                  />
                </div>
                <div class="dash-filter-item">
                  <input
                    type="date"
                    class="form-control dash-date-input"
                    v-model="dateTo"
                  />
                </div>
                <div class="dash-filter-item">
                  <select class="form-select dash-warehouse-select" v-model="selectedWarehouse">
                    <option value="all">All Warehouses</option>
                    <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                      {{ wh.name }}
                    </option>
                  </select>
                </div>
                <div class="dash-filter-item">
                  <button class="btn btn-primary dash-apply-btn" @click="applyFilter">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stat Cards Row -->
        <div class="row mb-4">
          <!-- Stock on Hand -->
          <div class="col-xl-4 col-sm-6 col-12 d-flex">
            <div class="dash-stat-card stock-on-hand w-100">
              <div class="dash-stat-info">
                <h6 class="dash-stat-label">Stock on Hand</h6>
                <h3 class="dash-stat-value">{{ stockOnHand }}</h3>
              </div>
              <div class="dash-stat-icon">
                <img src="@/assets/img/icons/dash1.svg" alt="Stock" />
              </div>
            </div>
          </div>

          <!-- No of Stock Transfers -->
          <div class="col-xl-4 col-sm-6 col-12 d-flex">
            <div class="dash-stat-card stock-transfers w-100">
              <div class="dash-stat-info">
                <h3 class="dash-stat-value">{{ stockTransfers }}</h3>
                <h6 class="dash-stat-label">No of Stock Transfers</h6>
              </div>
              <div class="dash-stat-icon">
                <img src="@/assets/img/icons/dash2.svg" alt="Transfers" />
              </div>
            </div>
          </div>

          <!-- No of Cancelled STF -->
          <div class="col-xl-4 col-sm-12 col-12 d-flex">
            <div class="dash-stat-card cancelled-stf w-100">
              <div class="dash-stat-info">
                <h3 class="dash-stat-value">{{ cancelledSTF }}</h3>
                <h6 class="dash-stat-label">No of Cancelled STF</h6>
              </div>
              <div class="dash-stat-icon-wrap">
                <img src="@/assets/img/icons/dash3.svg" alt="Cancelled" />
                <button class="dash-refresh-btn" @click="refreshCancelled" title="Refresh">
                  <vue-feather type="refresh-cw" class="feather-16"></vue-feather>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 1: Recent Stock Transfers + Low Stock Alert -->
        <div class="row mb-4">
          <!-- Recent Stock Transfers -->
          <div class="col-xl-4 col-lg-5 col-sm-12 col-12 d-flex">
            <div class="card flex-fill dash-table-card">
              <div class="card-header">
                <h5 class="card-title mb-0">Recent Stock Transfers</h5>
              </div>
              <div class="card-body">
                <div class="dash-transfer-list">
                  <div
                    class="dash-transfer-item"
                    v-for="item in recentTransfers"
                    :key="item.id"
                  >
                    <span class="transfer-id">{{ item.code }}</span>
                    <span class="transfer-separator">—</span>
                    <span class="transfer-date">{{ item.date }}</span>
                    <span class="transfer-separator">—</span>
                  </div>
                  <div v-if="recentTransfers.length === 0" class="dash-empty-state">
                    <p>No recent stock transfers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert -->
          <div class="col-xl-8 col-lg-7 col-sm-12 col-12 d-flex">
            <div class="card flex-fill dash-table-card">
              <div class="card-header">
                <h5 class="card-title mb-0">Low Stock Alert</h5>
              </div>
              <div class="card-body p-0">
                  <table class="table dash-alert-table mb-0">
                    <thead>
                      <tr>
                        <th>Item Key</th>
                        <th>Title</th>
                        <th class="text-end">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in lowStockAlerts" :key="item.itemKey">
                        <td>
                          <a href="javascript:void(0);" class="item-key-link">{{ item.itemKey }}</a>
                        </td>
                        <td>{{ item.title }}</td>
                        <td class="text-end">
                          <span class="qty-negative">{{ item.qty }}</span>
                        </td>
                      </tr>
                      <tr v-if="lowStockAlerts.length === 0">
                        <td colspan="3" class="text-center py-3">No low stock alerts</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Stock Movement + Recent Activity -->
        <div class="row">
          <!-- Stock Movement -->
          <div class="col-xl-7 col-lg-7 col-sm-12 col-12 d-flex">
            <div class="card flex-fill dash-table-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Stock Movement</h5>
                <span class="badge dash-badge-info">{{ stockMovement.length }} items</span>
              </div>
              <div class="card-body p-0">
                  <table class="table dash-alert-table mb-0">
                    <thead>
                      <tr>
                        <th>Item Key</th>
                        <th>Title</th>
                        <th class="text-end">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in stockMovement" :key="item.itemKey">
                        <td>
                          <a href="javascript:void(0);" class="item-key-link">{{ item.itemKey }}</a>
                        </td>
                        <td>{{ item.title }}</td>
                        <td class="text-end">
                          <span :class="item.qty >= 0 ? 'qty-positive' : 'qty-negative'">
                            {{ item.qty >= 0 ? '+' : '' }}{{ item.qty }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="stockMovement.length === 0">
                        <td colspan="3" class="text-center py-3">No stock movement</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="col-xl-5 col-lg-5 col-sm-12 col-12 d-flex">
            <div class="card flex-fill dash-table-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Recent Activity</h5>
                <span class="badge dash-badge-info">Today</span>
              </div>
              <div class="card-body">
                <div class="dash-activity-list">
                  <div
                    class="dash-activity-item"
                    v-for="(activity, index) in recentActivity"
                    :key="index"
                  >
                    <div class="activity-indicator" :class="activity.type"></div>
                    <div class="activity-content">
                      <div class="activity-header">
                        <span class="activity-user">{{ activity.user }}</span>
                        <span class="activity-time">{{ activity.time }}</span>
                      </div>
                      <p class="activity-desc">{{ activity.description }}</p>
                      <span class="activity-badge" :class="'badge-' + activity.type">
                        {{ activity.label }}
                      </span>
                    </div>
                  </div>
                  <div v-if="recentActivity.length === 0" class="dash-empty-state">
                    <p>No recent activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "Mike Louis Abordo",
      dateFrom: "2026-03-01",
      dateTo: "2026-03-06",
      selectedWarehouse: "all",
      warehouses: [],

      // Stat card data
      stockOnHand: 0,
      stockTransfers: 0,
      cancelledSTF: 1,

      // Recent Stock Transfers
      recentTransfers: [
        { id: 1, code: "D-26-792", date: "Feb 20, 2026" },
        { id: 2, code: "D-26-791", date: "Feb 20, 2026" },
        { id: 3, code: "D-26-794", date: "Feb 20, 2026" },
        { id: 4, code: "D-26-797", date: "Feb 20, 2026" },
        { id: 5, code: "D-26-796", date: "Feb 20, 2026" },
      ],

      // Low Stock Alert
      lowStockAlerts: [
        {
          itemKey: "TCUSMTA25P",
          title: "The Customs Modernization & Tariff Act: Comments and Cases",
          qty: -465,
        },
        {
          itemKey: "CBRCOML26P",
          title: "Compendious Bar Reviewer on Commercial Law: Based on Bar Exam Syllabus",
          qty: -368,
        },
        {
          itemKey: "CBRPOLL26P",
          title: "Compendious Bar Reviewer on Political Law: Based on Bar Exam Syllabus",
          qty: -294,
        },
      ],

      // Stock Movement
      stockMovement: [
        {
          itemKey: "TCUSMTA25P",
          title: "The Customs Modernization & Tariff Act: Comments and Cases",
          qty: 120,
        },
        {
          itemKey: "CBRCOML26P",
          title: "Compendious Bar Reviewer on Commercial Law",
          qty: -50,
        },
        {
          itemKey: "CBRPOLL26P",
          title: "Compendious Bar Reviewer on Political Law",
          qty: 75,
        },
        {
          itemKey: "BKLAW2026",
          title: "Philippine Legal Forms and Procedures Manual",
          qty: -30,
        },
      ],

      // Recent Activity
      recentActivity: [
        {
          user: "Mike Louis Abordo",
          description: "Created stock transfer D-26-792",
          time: "2 mins ago",
          type: "transfer",
          label: "Stock Transfer",
        },
        {
          user: "Mike Louis Abordo",
          description: "Received delivery for PO-26-145",
          time: "15 mins ago",
          type: "delivery",
          label: "Delivery",
        },
        {
          user: "System",
          description: "Low stock alert triggered for TCUSMTA25P",
          time: "1 hour ago",
          type: "stock-alert",
          label: "Alert",
        },
        {
          user: "Mike Louis Abordo",
          description: "Cancelled stock transfer D-26-780",
          time: "2 hours ago",
          type: "cancelled",
          label: "Cancelled",
        },
        {
          user: "Mike Louis Abordo",
          description: "Updated item pricing for CBRCOML26P",
          time: "3 hours ago",
          type: "update",
          label: "Update",
        },
      ],
    };
  },
  methods: {
    applyFilter() {
      // TODO: Fetch dashboard data based on dateFrom, dateTo, and selectedWarehouse
      console.log("Applying filter:", {
        from: this.dateFrom,
        to: this.dateTo,
        warehouse: this.selectedWarehouse,
      });
    },
    refreshCancelled() {
      // TODO: Refresh cancelled STF count
      console.log("Refreshing cancelled STF...");
    },
  },
};
</script>

<style scoped>
/* ===== Greeting ===== */
.dash-greeting {
  font-size: 22px;
  font-weight: 700;
  color: #092c4c;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.wave-emoji {
  font-size: 26px;
  display: inline-block;
  animation: wave-hand 1.8s ease-in-out infinite;
  transform-origin: 70% 70%;
}
@keyframes wave-hand {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(14deg); }
  20%  { transform: rotate(-8deg); }
  30%  { transform: rotate(14deg); }
  40%  { transform: rotate(-4deg); }
  50%  { transform: rotate(10deg); }
  60%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

/* ===== Filter Bar ===== */
.dash-filter-bar {
  background: #fff;
  border: 1px solid #dbe0e6;
  border-radius: 8px;
  padding: 16px 20px;
}
.dash-filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.dash-filter-item {
  flex: 1;
  min-width: 160px;
}
.dash-date-input {
  border: 1px solid #dbe0e6;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #092c4c;
  background: #fff;
  height: 44px;
}
.dash-date-input:focus {
  border-color: #ff9f43;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.15);
}
.dash-warehouse-select {
  border: 1px solid #dbe0e6;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #092c4c;
  background: #fff;
  height: 44px;
  cursor: pointer;
}
.dash-warehouse-select:focus {
  border-color: #ff9f43;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.15);
}
.dash-apply-btn {
  background: #ff9f43;
  border: none;
  border-radius: 6px;
  padding: 10px 36px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  height: 44px;
  width: 100%;
  transition: all 0.2s ease;
}
.dash-apply-btn:hover {
  background: #e88d30;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 159, 67, 0.35);
}
.dash-apply-btn:active {
  transform: translateY(0);
}

/* ===== Stat Cards ===== */
.dash-stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 24px 20px;
  margin-bottom: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}
.dash-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Stock on Hand - White card */
.dash-stat-card.stock-on-hand {
  background: #fff;
  border: 1px solid #dbe0e6;
}
.dash-stat-card.stock-on-hand .dash-stat-label {
  color: #ff9f43;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.dash-stat-card.stock-on-hand .dash-stat-value {
  color: #092c4c;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 0;
}
.dash-stat-card.stock-on-hand .dash-stat-icon img {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

/* Stock Transfers - Orange card */
.dash-stat-card.stock-transfers {
  background: linear-gradient(135deg, #ff9f43 0%, #ffb347 100%);
  border: none;
}
.dash-stat-card.stock-transfers .dash-stat-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0;
}
.dash-stat-card.stock-transfers .dash-stat-value {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}
.dash-stat-card.stock-transfers .dash-stat-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.7;
}

/* Cancelled STF - Dark Navy card */
.dash-stat-card.cancelled-stf {
  background: linear-gradient(135deg, #1b2850 0%, #2a3f6f 100%);
  border: none;
}
.dash-stat-card.cancelled-stf .dash-stat-label {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0;
}
.dash-stat-card.cancelled-stf .dash-stat-value {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}
.dash-stat-card.cancelled-stf .dash-stat-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.dash-stat-card.cancelled-stf .dash-stat-icon-wrap img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.7;
}
.dash-refresh-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dash-refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* ===== Table Cards ===== */
.dash-table-card {
  border: 1px solid #dbe0e6;
  border-radius: 10px;
  overflow: hidden;
}
.dash-table-card .card-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 18px 20px;
}
.dash-table-card .card-title {
  font-size: 16px;
  font-weight: 700;
  color: #092c4c;
}

/* Badge in card headers */
.dash-badge-info {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Recent Stock Transfers List */
.dash-transfer-list {
  padding: 4px 0;
}
.dash-transfer-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 8px;
  transition: background 0.15s ease;
}
.dash-transfer-item:last-child {
  border-bottom: none;
}
.dash-transfer-item:hover {
  background: #fafbfe;
}
.transfer-id {
  font-weight: 600;
  color: #092c4c;
  font-size: 14px;
}
.transfer-date {
  color: #67748e;
  font-size: 14px;
}
.transfer-separator {
  color: #b8bcc9;
  font-size: 14px;
}

/* Low Stock Alert & Stock Movement Tables */
.dash-alert-table {
  margin-bottom: 0;
  width: 100%;
}
.dash-alert-table thead th {
  background: #fafbfe;
  color: #67748e;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 14px 20px;
  border-bottom: 1px solid #eff2f7;
  white-space: nowrap;
}
.dash-alert-table tbody td {
  padding: 14px 20px;
  font-size: 14px;
  color: #092c4c;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
  word-wrap: break-word;
}
.dash-alert-table tbody tr:last-child td {
  border-bottom: none;
}
.dash-alert-table tbody tr:hover {
  background: #fafbfe;
}
.item-key-link {
  color: #ff9f43;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}
.item-key-link:hover {
  color: #e88d30;
  text-decoration: underline;
}
.qty-negative {
  color: #ea5455;
  font-weight: 700;
  font-size: 14px;
}
.qty-positive {
  color: #28c76f;
  font-weight: 700;
  font-size: 14px;
}

/* ===== Recent Activity ===== */
.dash-activity-list {
  padding: 4px 0;
}
.dash-activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s ease;
}
.dash-activity-item:last-child {
  border-bottom: none;
}
.dash-activity-item:hover {
  background: #fafbfe;
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 6px;
}

/* Activity indicator dot with line */
.activity-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
  position: relative;
}
.activity-indicator.transfer {
  background: #ff9f43;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.2);
}
.activity-indicator.delivery {
  background: #28c76f;
  box-shadow: 0 0 0 3px rgba(40, 199, 111, 0.2);
}
.activity-indicator.stock-alert {
  background: #ea5455;
  box-shadow: 0 0 0 3px rgba(234, 84, 85, 0.2);
}
.activity-indicator.cancelled {
  background: #67748e;
  box-shadow: 0 0 0 3px rgba(103, 116, 142, 0.2);
}
.activity-indicator.update {
  background: #00cfe8;
  box-shadow: 0 0 0 3px rgba(0, 207, 232, 0.2);
}

.activity-content {
  flex: 1;
  min-width: 0;
}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.activity-user {
  font-weight: 600;
  color: #092c4c;
  font-size: 13px;
}
.activity-time {
  color: #b8bcc9;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 8px;
}
.activity-desc {
  color: #67748e;
  font-size: 13px;
  margin-bottom: 6px;
  line-height: 1.4;
}
.activity-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}
.activity-badge.badge-transfer {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}
.activity-badge.badge-delivery {
  background: rgba(40, 199, 111, 0.12);
  color: #28c76f;
}
.activity-badge.badge-stock-alert {
  background: rgba(234, 84, 85, 0.12);
  color: #ea5455;
}
.activity-badge.badge-cancelled {
  background: rgba(103, 116, 142, 0.12);
  color: #67748e;
}
.activity-badge.badge-update {
  background: rgba(0, 207, 232, 0.12);
  color: #00cfe8;
}

/* ===== Empty State ===== */
.dash-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #b8bcc9;
}
.dash-empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ===== Responsive ===== */
@media (max-width: 991px) {
  .dash-filter-group {
    flex-direction: column;
  }
  .dash-filter-item {
    width: 100%;
  }
}
@media (max-width: 575px) {
  .dash-greeting {
    font-size: 18px;
  }
  .dash-stat-card {
    padding: 18px 16px;
  }
  .dash-stat-card .dash-stat-value {
    font-size: 26px;
  }
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .activity-time {
    margin-left: 0;
  }
}
</style>
