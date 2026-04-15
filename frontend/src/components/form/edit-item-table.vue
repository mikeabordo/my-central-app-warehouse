<template>
    <div>

        <!-- Summary info row (optional) -->
        <div v-if="summaryFields && summaryFields.length" class="summary-row mb-4">
            <div class="row">
                <div v-for="field in summaryFields" :key="field.key" class="col-md mb-3">
                    <div class="summary-card shadow-sm">
                        <span class="summary-label">{{ field.label }}</span>
                        <!-- Parent defines what to edit via field properties -->
                        <template v-if="field.editable">
                            <template v-if="field.type === 'select'">
                                <select v-model="item[field.key]"
                                    class="form-select border-0 p-0 fw-bold fs-5 shadow-none bg-transparent"
                                    @change="$emit('update:item', item)">
                                    <option v-for="opt in field.options" :key="getOptionValue(opt)"
                                        :value="getOptionValue(opt)">
                                        {{ getOptionLabel(opt) }}
                                    </option>
                                </select>
                            </template>
                            <template v-else-if="field.type === 'textarea'">
                                <textarea v-model="item[field.key]"
                                    class="form-control border-0 p-0 fw-600 fs-6 shadow-none bg-transparent" rows="1"
                                    style="resize: none;" :placeholder="field.placeholder || ''"
                                    @input="$emit('update:item', item)"></textarea>
                            </template>
                            <template v-else>
                                <input :type="field.type || 'text'" v-model="item[field.key]"
                                    class="form-control border-0 p-0 fw-bold fs-5 shadow-none bg-transparent"
                                    :placeholder="field.placeholder || ''" @input="$emit('update:item', item)" />
                            </template>
                        </template>
                        <span v-else class="summary-value">{{ item?.[field.key] || '—' }}</span>
                    </div>
                </div>
            </div>
        </div>


        <!-- Data table -->
        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <!-- API Search Field-->
                <div v-if="isSearchEnabled" class="p-3 border-bottom">
                    <div class="search-field-wrapper" v-click-outside="closeSearchDropdown">
                        <div class="position-relative" style="z-index: 1051;">
                            <vue-feather type="search" size="16" class="search-input-icon text-muted"></vue-feather>
                            <input v-model="searchQuery" type="text" class="form-control"
                                :placeholder="searchField.placeholder || 'Search book...'" autocomplete="off"
                                @input="onSearchInput" @keydown.escape="closeSearchDropdown" />
                            <div v-if="searchLoading" class="search-spinner">
                                <span class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                            </div>
                            <!-- Results Dropdown -->
                            <div v-if="searchResults.length" class="search-results-dropdown shadow-lg border rounded">
                                <ul class="list-unstyled mb-0">
                                    <li v-for="result in searchResults" :key="getOptionValue(result)"
                                        class="search-result-item p-2 border-bottom"
                                        @click="selectSearchResult(result)">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="result-details">
                                                <slot :name="searchField.resultSlot || 'col-book_details'"
                                                    v-bind="result._raw">
                                                    <span class="fw-bold">{{ getOptionLabel(result) }}</span>
                                                </slot>
                                            </div>
                                            <vue-feather type="plus-circle" size="16"
                                                class="text-primary"></vue-feather>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="searchNoResult" class="text-danger small mt-2">
                            No results found
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th v-for="col in columns" :key="col.key"
                                    :style="col.width ? { width: col.width } : {}">
                                    {{ col.label }}
                                </th>
                                <th v-if="allowRemove" style="width: 80px" class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!tableItems || tableItems.length === 0">
                                <td :colspan="allowRemove ? columns.length + 1 : columns.length"
                                    class="text-center text-muted py-5">
                                    No items to display.
                                </td>
                            </tr>
                            <tr v-for="(row, index) in tableItems" :key="getRowKey(row, index)">
                                <td v-for="col in columns" :key="col.key">
                                    <!-- Parent defines what to edit via col properties -->
                                    <template v-if="col.editable">
                                        <input v-if="col.type === 'number'" type="number" v-model.number="row[col.key]"
                                            class="form-control form-control-sm" style="width: 80px;" min="1"
                                            @input="$emit('update:tableItems', tableItems)" />
                                        <input v-else type="text" v-model="row[col.key]"
                                            class="form-control form-control-sm"
                                            @input="$emit('update:tableItems', tableItems)" />
                                    </template>
                                    <!-- Slot support for custom column rendering (even if not editable) -->
                                    <slot v-else :name="'col-' + col.key" v-bind="row">
                                        {{ row[col.key] ?? '—' }}
                                    </slot>
                                </td>
                                <td v-if="allowRemove" class="text-center">
                                    <button type="button" class="btn btn-sm btn-outline-danger border-0"
                                        @click="removeRow(index)">
                                        <vue-feather type="trash-2" size="16"></vue-feather>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import api from "@/services/api";

export default {
    name: "EditItemTable",
    props: {
        /**
         * The parent item object (e.g. the stock request).
         */
        item: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Optional summary fields displayed above the table.
         * Example: [{ label: "Ref", key: "refNo", editable: true }]
         */
        summaryFields: {
            type: Array,
            default: () => [],
        },
        /**
         * Column definitions for the table.
         * Each entry: { label: String, key: String, width?: String, editable?: Boolean, type?: String }
         */
        columns: {
            type: Array,
            default: () => [],
        },
        /**
         * Array of items to display in the table.
         */
        tableItems: {
            type: Array,
            default: () => [],
        },
        /**
         * Whether to show a remove action column.
         */
        allowRemove: {
            type: Boolean,
            default: false,
        },
        searchField: {
            type: Object,
            default: null,
        },
    },
    emits: ["update:item", "update:tableItems", "remove-item"],
    directives: {
        "click-outside": {
            mounted(el, binding) {
                el.clickOutsideEvent = (event) => {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value();
                    }
                };
                document.addEventListener("click", el.clickOutsideEvent);
            },
            unmounted(el) {
                document.removeEventListener("click", el.clickOutsideEvent);
            },
        },
    },
    data() {
        return {
            searchQuery: "",
            searchResults: [],
            searchLoading: false,
            searchNoResult: false,
            _debounceTimer: null,
        };
    },
    computed: {
        isSearchEnabled() {
            return !!this.searchField?.endpoint;
        },
    },
    methods: {
        getOptionValue(opt) {
            return typeof opt === "object" && opt !== null ? opt.value : opt;
        },
        getOptionLabel(opt) {
            return typeof opt === "object" && opt !== null ? opt.label : opt;
        },
        getRowKey(row, index) {
            return row?.id ?? row?.itemid ?? row?.bookitemkey ?? row?.item_key ?? index;
        },
        onSearchInput(event) {
            const query = event?.target?.value ?? this.searchQuery;
            this.searchQuery = query;
            this.searchResults = [];
            this.searchNoResult = false;

            const minChars = this.searchField?.minChars ?? 1;
            if (query.length < minChars) return;

            clearTimeout(this._debounceTimer);
            this._debounceTimer = setTimeout(() => {
                this.fetchSearchResults(query);
            }, this.searchField?.debounce ?? 350);
        },
        async fetchSearchResults(query) {
            if (!this.isSearchEnabled) return;

            this.searchLoading = true;
            this.searchNoResult = false;

            try {
                const method = (this.searchField.method || "get").toLowerCase();
                let response;

                if (method === "post") {
                    response = await api.post(this.searchField.endpoint, {
                        search: query,
                        limit: this.searchField.limit ?? 10,
                    });
                } else {
                    const fullUrl = `${this.searchField.endpoint}?search=${encodeURIComponent(query)}&limit=${this.searchField.limit ?? 10}`;
                    response = await api.get(fullUrl);
                }

                const raw = Array.isArray(response) ? response : response.data ?? [];
                const valueKey = this.searchField.valueKey ?? "id";
                const labelKey = this.searchField.labelKey ?? "name";

                this.searchResults = raw.slice(0, this.searchField.limit ?? 10).map((item) => ({
                    value: item[valueKey],
                    label: item[labelKey],
                    _raw: item,
                }));
                this.searchNoResult = this.searchResults.length === 0;
            } catch (error) {
                console.error("[EditItemTable] Search Error:", error);
                this.searchResults = [];
                this.searchNoResult = true;
            } finally {
                this.searchLoading = false;
            }
        },
        selectSearchResult(result) {
            const updatedItems = Array.isArray(this.tableItems) ? [...this.tableItems] : [];

            const isDuplicate = updatedItems.some((item) => {
                const existingId = item?.id ?? item?.itemid ?? item?.bookId ?? item?.bookid;
                return String(existingId ?? "") !== "" && String(existingId) === String(result.value);
            });

            if (!isDuplicate) {
                updatedItems.push({
                    ...result._raw,
                    qty_requested: result._raw?.qty_requested ?? result._raw?.qtyRequested ?? 0,
                    qty_fulfilled: result._raw?.qty_fulfilled ?? result._raw?.qtyFulfilled ?? 1,
                });
                this.$emit("update:tableItems", updatedItems);
            }

            this.searchQuery = "";
            this.searchResults = [];
            this.searchNoResult = false;
        },
        closeSearchDropdown() {
            this.searchResults = [];
        },
        removeRow(index) {
            this.$emit('remove-item', index);
        }
    },
};
</script>

<script setup>
// If using Vue 3 script setup features or components, but here we stay with Options API 
// to match the user's existing patterns in view-item-table.vue.
</script>

<style scoped>
.card {
    border-radius: 10px;
    overflow: visible;
    border: 1px solid #e0e4e8 !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
}

.table-responsive {
    border-radius: inherit;
    overflow: visible;
}

.table {
    border-collapse: separate;
    border-spacing: 0;
    border: none !important;
}

.table thead th {
    background-color: #f8f9fa;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #495057;
    font-weight: 700;
    padding: 14px 16px;
    border-bottom: 2px solid #edeff1;
}

.table td {
    font-size: 0.9rem;
    vertical-align: middle;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f3f5;
    border-right: 1px solid #f1f3f5;
}

.table td:last-child,
.table th:last-child {
    border-right: none;
}

/* Custom Input Styling for table */
.form-control-sm {
    border-width: 1px;
    border-color: #d2d2d2;
}

.form-control:focus,
.form-select:focus {
    border-width: 2px;
    border-color: #67748e;
}

.search-field-wrapper {
    position: relative;
    max-width: 100%;
}

.search-spinner {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.search-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 2;
}

.search-field-wrapper .form-control {
    padding-left: 38px;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    background: #fff;
    z-index: 1050;
    margin-top: 8px;
    border-radius: 8px;
}

.search-result-item {
    cursor: pointer;
    transition: background 0.2s;
}

.search-result-item:hover {
    background: #f8fafc;
}

.search-result-item:last-child {
    border-bottom: none !important;
}

.result-details {
    flex: 1;
}

/* Summary horizontal layout tweaks */
.summary-row {
    white-space: nowrap;
}

/* Ensure inputs in summary cards look clean */
.summary-card input,
.summary-card textarea,
.summary-card select {
    color: #212529;
    font-family: inherit;
}

.summary-card input::placeholder,
.summary-card textarea::placeholder {
    font-weight: 400;
    color: #adb5bd;
}
</style>
