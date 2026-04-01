<template>
    <div>


        <!-- Summary info row (optional, shown when item exists) -->
        <div v-if="summaryFields && summaryFields.length" class="summary-row mb-4">
            <div class="row">
                <div v-for="field in summaryFields" :key="field.key" class="col-md mb-3">
                    <div class="summary-card shadow-sm">
                        <span class="summary-label">{{ field.label }}</span>
                        <span class="summary-value">{{ item?.[field.key] || '—' }}</span>
                    </div>
                </div>
            </div>
        </div>


        <!-- Data table -->
        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th v-for="col in columns" :key="col.key"
                                    :style="col.width ? { width: col.width } : {}">
                                    {{ col.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!tableItems || tableItems.length === 0">
                                <td :colspan="columns.length" class="text-center text-muted py-5">
                                    No items to display.
                                </td>
                            </tr>
                            <tr v-for="(row, index) in tableItems" :key="index">
                                <td v-for="col in columns" :key="col.key">
                                    <!-- Slot support for custom column rendering -->
                                    <slot :name="'col-' + col.key" v-bind="row">
                                        {{ row[col.key] ?? '—' }}
                                    </slot>
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
    name: "ViewDetail",
    props: {
        /**
         * The parent item object (e.g. the stock request).
         * Used to populate the optional summary row at the top.
         */
        item: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Optional summary fields displayed above the table.
         * Example: [{ label: "Reference #", key: "RSNo" }, { label: "Status", key: "status" }]
         */
        summaryFields: {
            type: Array,
            default: () => [],
        },
        /**
         * Column definitions for the table.
         * Each entry: { label: String, key: String, width?: String }
         */
        columns: {
            type: Array,
            default: () => [],
        },
        tableItems: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style scoped>
.card {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e0e4e8 !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
}

/* Fix for rounded corners clipping/glitch */
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
    border-top: none;
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

.table tbody tr:last-child td {
    border-bottom: none;
}
</style>