<template>
    <div>
        <layout-header></layout-header>
        <layout-sidebar></layout-sidebar>
        <div class="page-wrapper">
            <div class="content">
                <!-- minimal breadcrumb -->
                <nav aria-label="breadcrumb" class="mb-4 d-none d-md-flex">
                    <div class="minimal-breadcrumb">


                        <router-link to="/stock-transfer/pending-transfer" class="mb-item">
                            Pending Transfer
                        </router-link>

                        <div class="mb-separator">
                            <vue-feather type="chevron-right" size="16"></vue-feather>
                        </div>

                        <div class="mb-item active">
                            Add New Transfer
                        </div>
                    </div>
                </nav>
                <div class="page-header justify-content-between">
                    <div class="page-title">
                        <h4>Add New Transfer</h4>
                        <h6>Create a new stock transfer request</h6>
                    </div>

                    <!-- back button -->
                    <div class="page-btn">
                        <router-link to="/stock-transfer/pending-transfer" class="btn btn-added btn-dark">
                            <vue-feather type="arrow-left" class="me-2"></vue-feather>Back to Pending Transfer
                        </router-link>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <add-form submitLabel="Submit Transfer" :fields="fields" :summaryFields="summaryFields"
                            :loading="loading" @create="submitTransfer"
                            @cancel="$router.push('/stock-transfer/pending-transfer')">
                            <template #col-item_key="row">
                                {{ row.booktype }}:{{ row.bookitemkey }}
                            </template>
                            <template #col-product_details="row">
                                <div class="d-flex flex-column gap-1">
                                    <span class="fw-bold text-dark fs-6">{{ row.title || '—' }}</span>
                                    <div class="text-secondary small d-flex flex-column">
                                        <span v-if="row.author">Author: {{ row.author }}</span>
                                        <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                                        <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                                    </div>
                                </div>
                            </template>
                        </add-form>
                    </div>
                </div>
            </div>
        </div>
        <success-modal :visible="successModalVisible" title="Transfer Created"
            message="The stock transfer request has been successfully created and is now pending."
            @close="$router.push('/stock-transfer/pending-transfer')"
            @update:visible="successModalVisible = $event" />
    </div>
</template>

<script>
import AddForm from "@/components/form/add-form.vue";
import api from "@/services/api";
import SuccessModal from "@/components/modal/success-modal.vue";

export default {
    name: "AddNewTransfer",
    components: {
        AddForm,
        SuccessModal,
    },
    data() {
        return {
            nextSTFNo: "",
            branchOptions: [],
            loading: false,
            successModalVisible: false,
        };
    },
    computed: {
        fields() {
            return [
                {
                    // Keep the key aligned with the STF backend contract:
                    // `/warehouse/stf/items` returns `{ info, lines }`, and add/update endpoints expect `lines` too.
                    key: "lines",
                    label: "Product Name",
                    type: "search",
                    required: true,
                    placeholder: "Search product by name or code…",
                    method: "get",
                    endpoint: "/books/search",
                    labelKey: "name", // IMPORTANT: Must match the property from backend (e.g., "title", "name", "itemName")
                    valueKey: "id",   // IMPORTANT: Must be the unique ID property from backend (e.g., "id", "book_id")
                    minChars: 1,
                    debounce: 350,
                    col: 12,
                    tableColumns: [
                        { label: "Item Key", key: "item_key" },
                        { label: "Product Details", key: "product_details" },
                        { label: "Quantity", key: "qty", editable: true },
                    ],
                },
            ];
        },
        summaryFields() {
            return [
                {
                    key: "ref",
                    label: "Reference",
                    type: "text",
                    disabled: true,
                    value: this.nextSTFNo,
                },
                // {
                //     key: "fromBranch",
                //     label: "From Location",
                //     type: "select",
                //     placeholder: "Select From",
                //     options: this.branchOptions,
                // },
                {
                    key: "toId",
                    label: "To Location",
                    type: "select",
                    placeholder: "Select To",
                    options: this.branchOptions,
                },
                {
                    key: "remarks",
                    label: "Memo",
                    type: "textarea",
                    placeholder: "Enter memo...",
                },
            ];
        },
    },
    created() {
        this.getNextSTFNo();
        this.fetchBranches();
    },
    methods: {
        async getNextSTFNo() {
            try {
                const responseData = await api.get("/warehouse/stf/next");
                this.nextSTFNo =
                    responseData?.stfNo ||
                    responseData?.data?.stfNo ||
                    responseData?.nextSTFNo ||
                    responseData?.data?.nextSTFNo ||
                    responseData?.ref ||
                    responseData?.data?.ref ||
                    responseData?.data ||
                    "";
            } catch (error) {
                console.error("Failed to fetch next STF No:", error);
            }
        },
        async fetchBranches() {
            try {
                const responseData = await api.get("/warehouse/departments");
                // NOTE: Backend responses here have historically varied in shape (array vs { data: [] } vs nested keys).
                // We defensively extract the first array we can find so the dropdown always has options.
                const arrayOfOptions = [
                    responseData,
                    responseData?.data,
                ];

                const raw = arrayOfOptions.find(Array.isArray) ?? [];

                this.branchOptions = raw
                    .map((b) => ({
                        // Prefer a stable identifier for the backend (usually `id`/`branchId`).
                        // Using names like `branchstorename` as the value can cause 400s if the API validates IDs.
                        value:
                            b?.id ??
                            "",
                        // Label is what the user sees in the dropdown.
                        label:
                            b?.branchstorename ??
                            "",
                    }))
                    .map((opt) => ({
                        ...opt,
                        // If the API doesn't provide a display name, show the identifier instead of rendering "blank" items.
                        label: opt.label !== "" ? opt.label : String(opt.value ?? ""),
                    }))
                    // Avoid rendering truly empty entries if the API returns partial objects.
                    .filter((opt) => opt.value !== "");
            } catch (error) {
                console.error("Failed to fetch branches:", error);
            }
        },
        async submitTransfer(formData) {
            this.loading = true;
            // `add-form.vue` emits UI-friendly shapes; the backend expects a strict payload,
            // so we map and sanitize here (same pattern used in `frontend/reference.md`).
            console.log("[STF] Raw formData:", formData);

            // Minimal validation (AddForm doesn't enforce `required` on submit).
            if (!formData?.toId) {
                console.error("[STF] Missing required field: toId");
                this.loading = false;
                return;
            }

            const items = (formData.lines || []).map((line) => {
                const rawId =
                    line?.id ??
                    line?.value;

                const parsedId = parseInt(rawId, 10);
                return {
                    bookId: Number.isNaN(parsedId) ? rawId : parsedId,
                    qty: line?.qty || 1,
                };
            });

            const payload = {
                // Backend naming is inconsistent across endpoints (`toId` vs `toBranch`).
                // We send both to keep the request compatible while the contract is clarified.
                toId: formData.toId,
                toBranch: formData.toId,
                // The next reference is shown to the user; some backends require it as `stfNo` on create.
                stfNo: formData?.stfNo ?? formData?.ref ?? this.nextSTFNo,
                remarks: formData.remarks,
                // Backend STF add expects `items` (same mapping pattern as `frontend/reference.md`).
                // We also include `lines` for compatibility with other STF endpoints that use `{ info, lines }`.
                items,
                lines: items,
            };

            if (!payload.items.length) {
                console.error("[STF] Please add at least one product line before submitting.");
                this.loading = false;
                return;
            }

            console.log("[STF] Final payload:", payload);

            try {
                await api.post("/warehouse/stf/add", payload);
                this.successModalVisible = true;
            } catch (error) {
                // `api.js` attaches `status` and `data` to thrown errors; include them for faster backend debugging.
                console.error("Transfer submission failed:", {
                    message: error?.message,
                    status: error?.status,
                    data: error?.data,
                });
            } finally {
                this.loading = false;
            }
        },
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
    font-weight: 100;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    padding-bottom: 2px;
    font-style: italic;
}

.mb-item:hover:not(.active) {
    color: #FF9F43;
}

.mb-item.active {
    color: #1e293b;
    font-weight: 500;
    border-bottom: 1px solid #FF9F43;
}

.mb-separator {
    display: flex;
    align-items: center;
    margin: 0 12px;
    color: #abb2ba;
    font-weight: 500;
}
</style>
