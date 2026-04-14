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
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th v-for="col in columns" :key="col.key" :style="col.width ? { width: col.width } : {}">
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
                            <tr v-for="(row, index) in tableItems" :key="index">
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
        }
    },
    emits: ["update:item", "update:tableItems", "remove-item"],
    methods: {
        getOptionValue(opt) {
            return typeof opt === "object" && opt !== null ? opt.value : opt;
        },
        getOptionLabel(opt) {
            return typeof opt === "object" && opt !== null ? opt.label : opt;
        },
        removeRow(index) {
            this.$emit('remove-item', index);
        }
    }
};
</script>

<script setup>
// If using Vue 3 script setup features or components, but here we stay with Options API 
// to match the user's existing patterns in view-item-table.vue.
</script>

<style scoped>
.card {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e0e4e8 !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
}

.table-responsive {
    border-radius: inherit;
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

.form-control-sm:focus {
    border-width: 2px;
    border-color: #67748e;
    box-shadow: none;
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
