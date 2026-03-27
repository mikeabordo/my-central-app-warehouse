<template>
    <div>
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <div class="row">
                    <div v-for="field in fields" :key="field.key" :class="['mb-3', colClass(field)]">
                        <label class="form-label fw-bold text-muted small text-uppercase">{{ field.label }}</label>
                        <div class="view-field-value p-2 border rounded bg-light">
                            {{ item && field && field.key ? (item[field.key] || '—') : '—' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ViewItem",
    props: {
        /**
         * The data object whose keys are read by the fields array.
         */
        item: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Array of field definitions to render.
         * Each entry: { label: String, key: String, col?: Number }
         */
        fields: {
            type: Array,
            default: () => [],
        },
    },
    emits: ["close"],
    methods: {
        colClass(field) {
            const n = field.col || 6; // Default to 2 columns in a row
            return `col-12 col-md-${n}`;
        },
    },
};
</script>

<style scoped>
.view-field-value {
    min-height: 38px;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #333;
}

.form-label {
    margin-bottom: 0.4rem;
    letter-spacing: 0.5px;
}
</style>