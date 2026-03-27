<template>
    <div>
        <layout-header></layout-header>
        <layout-sidebar></layout-sidebar>
        <div class="page-wrapper">
            <div class="content">
                <div class="page-header d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div class="page-title">
                        <h3 class="fw-bold mb-1">Item Pricing Details</h3>
                        <p class="text-muted small mb-0">View complete pricing details of this item.</p>
                    </div>
                    <div class="page-btn">
                        <button type="button" class="btn btn-cancel d-inline-flex align-items-center gap-2"
                            @click="$router.push('/stock-monitoring/item-pricing')">
                            <vue-feather type="arrow-left" size="14"></vue-feather>
                            Back to Item Pricing
                        </button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <view-item v-else :item="item" :fields="fields"></view-item>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ViewItem from "@/components/form/view-form.vue";

export default {
    name: "ViewItemPricing",
    components: {
        ViewItem,
    },
    data() {
        return {
            loading: false,
            item: {},
            fields: [
                { label: "SKU", key: "sku" },
                { label: "Product", key: "product" },
                { label: "Edition", key: "edition" },
            ],
            // Temporary local data — replace with an API call later
            allItems: [
                {
                    id: 1,
                    sku: "ITM-001",
                    product: "Laptop Pro X",
                    edition: "Electronics",
                },
                {
                    id: 2,
                    sku: "ITM-002",
                    product: "Wireless Mouse M3",
                    edition: "Accessories",
                },
                {
                    id: 3,
                    sku: "ITM-003",
                    product: "Desk Chair Ergonomic",
                    edition: "Furniture",
                },
            ],
        };
    },
    created() {
        this.loadItem();
    },
    methods: {
        loadItem() {
            const id = Number(this.$route.params.id);
            const found = this.allItems.find((i) => i.id === id);
            if (found) {
                this.item = { ...found };
            }
        },
    },
};
</script>
