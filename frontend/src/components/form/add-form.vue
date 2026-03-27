<template>
    <form @submit.prevent="handleSubmit">
        <div class="card shadow-sm border-0">
            <div class="card-body pt-3">
                <div class="row">
                    <div v-for="field in fields" :key="field.key" :class="['mb-3', 'field-wrapper', colClass(field)]">
                        <label class="form-label">{{ field.label }}</label>

                        <!-- ── API Search field ── -->
                        <div v-if="isSearch(field)" class="search-field-wrapper ">
                            <input type="text" class="form-control mb-3" v-model="searchQueries[field.key]"
                                :placeholder="field.placeholder || `Search ${field.label}…`"
                                @input="onSearchInput(field, $event)" @keydown.escape="closeDropdown(field.key)"
                                autocomplete="off" />
                            <!-- Loading spinner inside input -->
                            <div v-if="searchLoading[field.key]" class="search-spinner" style="top: 20px;">
                                <span class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                            </div>

                            <!-- Results Table -->
                            <div class="table-responsive border rounded">
                                <table class="table mb-0">
                                    <thead>
                                        <tr>
                                            <th v-for="col in (field.tableColumns || [{ label: 'Result', key: 'label' }])"
                                                :key="col.key">
                                                {{ col.label }}
                                            </th>
                                            <th style="width: 100px;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Initial state / Empty search -->
                                        <tr
                                            v-if="!searchQueries[field.key] || searchQueries[field.key].length < (field.minChars || 1)">
                                            <td :colspan="(field.tableColumns ? field.tableColumns.length : 1) + 1"
                                                class="text-center text-muted py-4">
                                                Type to search...
                                            </td>
                                        </tr>
                                        <!-- Loading state -->
                                        <tr v-else-if="searchLoading[field.key]">
                                            <td :colspan="(field.tableColumns ? field.tableColumns.length : 1) + 1"
                                                class="text-center py-4">
                                                <span class="spinner-border spinner-border-sm text-primary me-2"></span>
                                                Searching...
                                            </td>
                                        </tr>
                                        <!-- No results state -->
                                        <tr v-else-if="searchNoResult[field.key]">
                                            <td :colspan="(field.tableColumns ? field.tableColumns.length : 1) + 1"
                                                class="text-center text-muted py-4">
                                                No results found
                                            </td>
                                        </tr>
                                        <!-- Results state -->
                                        <tr v-else v-for="result in searchResults[field.key]"
                                            :key="getOptionValue(result)">
                                            <td v-for="col in (field.tableColumns || [{ label: 'Result', key: 'label' }])"
                                                :key="col.key">
                                                {{ col.key === 'label' ? getOptionLabel(result) : (result._raw &&
                                                result._raw[col.key]) }}
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-outline-primary"
                                                    @click="selectSearchResult(field, result)">
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- ── Dropdown / Select field ── -->
                        <select v-else-if="isDropdown(field)" class="form-select form-control"
                            v-model="formData[field.key]" :disabled="field.disabled || false"
                            :class="{ 'bg-light': field.disabled }">
                            <option value="" disabled>
                                {{ field.placeholder || `Select ${field.label}` }}
                            </option>
                            <option v-for="opt in field.options" :key="getOptionValue(opt)"
                                :value="getOptionValue(opt)">
                                {{ getOptionLabel(opt) }}
                            </option>
                        </select>

                        <!-- ── Textarea field ── -->
                        <textarea v-else-if="isTextarea(field)" class="form-control" v-model="formData[field.key]"
                            :rows="field.rows || 3" :disabled="field.disabled || false"
                            :class="{ 'bg-light': field.disabled }" :placeholder="field.placeholder || ''"></textarea>

                        <!-- ── Plain input ── -->
                        <input v-else :type="field.type || 'text'" class="form-control" v-model="formData[field.key]"
                            :disabled="field.disabled || false" :class="{ 'bg-light': field.disabled }"
                            :placeholder="field.placeholder || ''" />
                    </div>
                </div><!-- end .row -->
            </div>
        </div>

        <div class="d-flex justify-content-end mb-5">
            <button type="button" class="btn btn-cancel me-2" @click="handleCancel">
                Cancel
            </button>
            <button type="submit" class="btn btn-submit">
                {{ submitLabel }}
            </button>
        </div>
    </form>
</template>

<script>
import api from "@/services/api";

export default {
    name: "AddForm",
    props: {
        title: { type: String, default: "Add New" },
        submitLabel: { type: String, default: "Submit" },
        fields: { type: Array, default: () => [] },
    },

    emits: ["create", "cancel"],

    data() {
        return {
            formData: {},
            searchQueries: {},
            searchResults: {},
            searchLoading: {},
            searchNoResult: {},
            _debounceTimers: {},
        };
    },

    watch: {
        fields: {
            handler(newFields) {
                this.initFormData(newFields);
            },
            immediate: true,
            deep: true,
        },
    },

    methods: {
        isDropdown(field) {
            return field.type === "select" || field.type === "dropdown";
        },
        isSearch(field) {
            return field.type === "search";
        },
        isTextarea(field) {
            return field.type === "textarea";
        },
        getOptionValue(opt) {
            return typeof opt === "object" && opt !== null ? opt.value : opt;
        },
        getOptionLabel(opt) {
            return typeof opt === "object" && opt !== null ? opt.label : opt;
        },
        colClass(field) {
            const n = field.col;
            if (!n || n === 12) return "col-12";
            return `col-12 col-md-${n}`;
        },
        initFormData(fields) {
            const fresh = {};
            const queries = {};
            const results = {};
            const loading = {};
            const noResult = {};

            fields.forEach((f) => {
                fresh[f.key] = f.value !== undefined && f.value !== null ? f.value : "";
                queries[f.key] = "";
                results[f.key] = [];
                loading[f.key] = false;
                noResult[f.key] = false;
            });

            this.formData = fresh;
            this.searchQueries = queries;
            this.searchResults = results;
            this.searchLoading = loading;
            this.searchNoResult = noResult;
        },

        onSearchInput(field, event) {
            const query = event.target.value;
            this.searchQueries[field.key] = query;

            this.formData[field.key] = "";
            this.searchResults[field.key] = [];
            this.searchNoResult[field.key] = false;

            const minChars = field.minChars ?? 1;
            if (query.length < minChars) return;

            clearTimeout(this._debounceTimers[field.key]);
            this._debounceTimers[field.key] = setTimeout(
                () => this.fetchSearchResults(field, query),
                field.debounce ?? 350
            );
        },

        async fetchSearchResults(field, query) {
            this.searchLoading[field.key] = true;
            this.searchNoResult[field.key] = false;

            try {
                const response = await api.get(
                    `${field.endpoint}?q=${encodeURIComponent(query)}&limit=10`
                );

                const raw = Array.isArray(response)
                    ? response
                    : response.data ?? [];

                const valueKey = field.valueKey ?? "id";
                const labelKey = field.labelKey ?? "name";

                this.searchResults[field.key] = raw.slice(0, 10).map((item) => ({
                    value: item[valueKey],
                    label: item[labelKey],
                    _raw: item,
                }));

                this.searchNoResult[field.key] = this.searchResults[field.key].length === 0;
            } catch (err) {
                console.error(`[AddForm] search error for "${field.key}":`, err);
                this.searchResults[field.key] = [];
                this.searchNoResult[field.key] = true;
            } finally {
                this.searchLoading[field.key] = false;
            }
        },

        selectSearchResult(field, result) {
            this.formData[field.key] = result.value;
            this.searchQueries[field.key] = result.label;
            this.searchResults[field.key] = [];
            this.searchNoResult[field.key] = false;
        },

        closeDropdown(key) {
            this.searchResults[key] = [];
        },

        handleSubmit() {
            this.$emit("create", { ...this.formData });
        },

        handleCancel() {
            this.$emit("cancel");
        },
    },
};
</script>

<style scoped>
.form-control,
.form-select {
    border-width: 1px;
    border-color: gray;
}

.form-control:focus,
.form-select:focus {
    border-width: 2px;
    border-color: #67748e;
}

/* ── Search field ── */
.search-field-wrapper {
    position: relative;
}

.search-spinner {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}
</style>