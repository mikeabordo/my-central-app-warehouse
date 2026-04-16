<template>
    <div>
        <layout-header></layout-header>
        <layout-sidebar></layout-sidebar>

        <div class="page-wrapper">
            <div class="content">
                <!-- Breadcrumb (matches the stock-transfer "backPath/backLabel" pattern) -->
                <nav aria-label="breadcrumb" class="mb-4 d-none d-md-flex">
                    <div class="minimal-breadcrumb">
                        <router-link :to="backPath" class="mb-item">
                            {{ backLabel }}
                        </router-link>
                        <div class="mb-separator">
                            <vue-feather type="chevron-right" size="16"></vue-feather>
                        </div>
                        <div class="mb-item active">Fulfill {{ backLabel }}</div>
                    </div>
                </nav>

                <!-- Page Header -->
                <div class="page-header justify-content-between">
                    <div class="page-title">
                        <h4>Fulfill Order Details</h4>
                    </div>
                    <div class="page-btn d-flex gap-2">
                        <router-link :to="backPath" class="btn btn-added btn-dark d-flex align-items-center">
                            <vue-feather type="arrow-left" class="me-2" size="18"></vue-feather>Back to Order List
                        </router-link>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <edit-detail v-else :item="item" @update:item="item = $event" :summaryFields="summaryFields"
                            :columns="columns" :tableItems="tableItems" :searchField="searchField"
                            @update:tableItems="tableItems = $event">
                            <template #col-item_key="row">
                                <span class="fw-bold text-dark fs-6">{{ row.booktype }}</span>:{{ row.bookitemkey }}
                            </template>
                            <template #col-book_details="row">
                                <div class="d-flex flex-column gap-1">
                                    <span class="fw-bold text-dark fs-6">{{
                                        row.title || "—"
                                    }}</span>
                                    <div class="text-secondary small d-flex flex-column">
                                        <span v-if="row.author">Author: {{ row.author }}</span>
                                        <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                                        <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                                    </div>
                                </div>
                            </template>
                            <template #col-qty_requested="row">
                                {{ row.qtyRequested ?? "—" }}
                            </template>
                        </edit-detail>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-added btn-gradient warm d-flex align-items-center"
                                :disabled="loading" @click="submitFulfillment">
                                <vue-feather type="check-square" class="me-2" size="18"></vue-feather>Submit Fulfillment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EditDetail from "@/components/form/edit-item-table.vue";
import api from "@/services/api";

export default {
    name: "FulfillOrder",
    components: {
        EditDetail,
    },
    props: {
        // Used by the breadcrumb/back button; passed via router query.
        backPath: {
            type: String,
            default: "/branch-fulfillment/order-list",
        },
        backLabel: {
            type: String,
            default: "Order List",
        },
        // Route param now carries the generated STF number.
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            item: {},
            searchField: {
                key: "lines",
                label: "Book",
                placeholder: "Search book by name or code...",
                method: "get",
                endpoint: "/books/search",
                labelKey: "name",
                valueKey: "id",
                minChars: 1,
                debounce: 350,
                limit: 10,
                resultSlot: "col-book_details",
            },
            summaryFields: [
                { label: "Stock Transfer No.", key: "stfNo" },
                { label: "Origin", key: "fromBranch" },
                { label: "Date Created", key: "createdAt" },
                { label: "Memo", key: "remarks" },
                { label: "Status", key: "status" },
            ],
            columns: [
                { label: "Item Key", key: "item_key", width: "25%" },
                { label: "Book Details", key: "book_details", width: "40%" },
                { label: "Qty Requested", key: "qty_requested", width: "15%" },
                { label: "Qty Fulfilled", key: "qty_fulfilled", width: "20%", editable: true, type: "number" },
            ],
            tableItems: [],
        };
    },
    created() {
        this.fetchOrderDetails();
    },
    methods: {
        normalizeQuantity(value) {
            const numericValue = Number(value);
            if (!Number.isFinite(numericValue) || numericValue < 0) {
                return 0;
            }

            return numericValue;
        },
        async fetchOrderDetails() {
            this.loading = true;
            const stfNo = this.id;
            try {
                const responseData = await api.get(
                    `/warehouse/stf/items?stfNo=${stfNo}&status=pending`,
                );

                const info = responseData?.info ?? {};
                this.item = {
                    ...info,
                    stfNo: info?.stfNo || stfNo,
                };
                const lines = Array.isArray(responseData?.lines)
                    ? responseData.lines
                    : [];

                this.tableItems = lines.map(line => ({
                    ...line,
                    qtyRequested:
                        line.qtyRequested ??
                        0,
                    qty_fulfilled:
                        line.qtyDelivered ??
                        0,
                }));
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                this.loading = false;
            }
        },
        async submitFulfillment() {
            const lines = Array.isArray(this.tableItems) ? this.tableItems : [];

            if (!lines.length) {
                window.Swal?.fire({
                    icon: "warning",
                    title: "No items to fulfill",
                    text: "Add at least one fulfillment line before submitting.",
                });
                return;
            }

            const payload = {
                ...this.item,
                stfNo: this.item?.stfNo || this.id,
                status: "processing",
                lines: lines.map((line) => ({
                    ...line,
                    qtyDelivered: this.normalizeQuantity(
                        line.qty_fulfilled ?? line.qtyDelivered ?? 0,
                    ),
                })),
            };

            console.group("[FulfillOrder] submitFulfillment");
            console.log("Route STF id:", this.id);
            console.log("Current item:", this.item);
            console.log("Table items:", lines);
            console.log("POST /warehouse/stf/fulfill payload:", payload);

            this.loading = true;
            try {
                const responseData = await api.post("/warehouse/stf/fulfill", payload);
                console.log("POST /warehouse/stf/fulfill response:", responseData);
                this.item = {
                    ...this.item,
                    status: "processing",
                };

                await window.Swal?.fire({
                    icon: "success",
                    title: "Fulfillment submitted",
                    text: "The transfer is now marked as processing.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                this.$router.push(this.backPath || "/stock-transfer/pending-transfer");
            } catch (error) {
                console.error("Failed to submit fulfillment:", error);
                console.log("Fulfillment error status:", error?.status);
                console.log("Fulfillment error data:", error?.data);
                console.log("Fulfillment error message:", error?.message);
                window.Swal?.fire({
                    icon: "error",
                    title: "Submit failed",
                    text: error?.data?.message || error?.message || "Unable to submit fulfillment right now.",
                });
            } finally {
                this.loading = false;
                console.groupEnd();
            }
        }
    },
};
</script>

<style scoped>
.minimal-breadcrumb {
    display: inline-flex;
    align-items: center;
    background: transparent;
    padding: 0;
}

.mb-item {
    display: flex;
    align-items: center;
    color: #64748b;
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    padding-bottom: 2px;
    font-style: italic;
}

.mb-item:hover:not(.active) {
    color: #ff9f43;
}

.mb-item.active {
    color: #1e293b;
    font-weight: 500;
    border-bottom: 1px solid #ff9f43;
}

.mb-separator {
    display: flex;
    align-items: center;
    margin: 0 12px;
    color: #abb2ba;
    font-weight: 500;
}
</style>
