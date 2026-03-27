<template>
    <div>
        <layout-header></layout-header>
        <layout-sidebar></layout-sidebar>
        <div class="page-wrapper">
            <div class="content">
                <div class="page-header justify-content-between">
                    <div class="page-title">
                        <h4>Add New Transfer</h4>
                        <h6>Create a new stock transfer request</h6>
                    </div>
                    <div class="page-btn">
                        <router-link to="/stock-transfer/pending-transfer" class="btn btn-added btn-dark">
                            <vue-feather type="arrow-left" class="me-2"></vue-feather>Back to Pending Transfer
                        </router-link>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <add-form
                            :submitLabel="'Submit Transfer'"
                            :fields="fields"
                            @create="submitTransfer"
                            @cancel="$router.push('/stock-transfer/pending-transfer')"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddForm from "@/components/form/add-form.vue";
import api from "@/services/api";

export default {
    name: "AddNewTransfer",
    components: {
        AddForm,
    },
    data() {
        return {
            nextSTFNo: "",
            branchOptions: [],
        };
    },
    computed: {
        fields() {
            return [
                {
                    key: "ref",
                    label: "Reference No",
                    type: "text",
                    required: true,
                    disabled: true,
                    value: this.nextSTFNo,
                    col: 12,
                },
                {
                    key: "item_id",
                    label: "Item",
                    type: "search",
                    required: true,
                    placeholder: "Search item by name or code…",
                    endpoint: "/items/search",
                    labelKey: "name",
                    valueKey: "id",
                    minChars: 1,
                    debounce: 350,
                    col: 12,
                    tableColumns: [
                        { label: "Product", key: "itemKey" },
                        { label: "SKU", key: "sku" },
                        { label: "Edition", key: "edition" },
                        { label: "ISBN", key: "isbn" },
                        { label: "Quantity", key: "qty" },
                    ],
                },
                {
                    key: "fromBranch",
                    label: "From Location",
                    type: "select",
                    required: true,
                    placeholder: "Select from location",
                    col: 6,
                    options: this.branchOptions,
                },
                {
                    key: "toBranch",
                    label: "To Location",
                    type: "select",
                    required: true,
                    placeholder: "Select to location",
                    col: 6,
                    options: this.branchOptions,
                },
                {
                    key: "remarks",
                    label: "Remarks",
                    type: "textarea",
                    placeholder: "Enter remarks or notes",
                    rows: 4,
                    col: 12,
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
                const responseData = await api.get("/warehouse/branches");
                const raw = Array.isArray(responseData)
                    ? responseData
                    : responseData?.data ?? [];
                this.branchOptions = raw.map((b) => ({
                    value: b.id || b.branchId || b.value,
                    label: b.name || b.branchName || b.label,
                }));
            } catch (error) {
                console.error("Failed to fetch branches:", error);
            }
        },
        async submitTransfer(formData) {
            try {
                await api.post("/warehouse/stf/add", formData);
                this.$router.push("/stock-transfer/pending-transfer");
            } catch (error) {
                console.error("Transfer submission failed:", error);
            }
        },
    },
};
</script>
