import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";

type ApiListResponse<T = unknown> = ListResponse<T> & {
    subjects?: T[];
    pagination?: ListResponse<T>["pagination"] & {
        totalCount?: number;
    };
};

const options : CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({resource}) => resource,
        buildQueryParams: async ({ filters, pagination }) => {
            const query: Record<string, string | number> = {};

            if (pagination?.currentPage) {
                query.page = pagination.currentPage;
            }

            if (pagination?.pageSize) {
                query.limit = pagination.pageSize;
            }

            filters?.forEach((filter) => {
                if (!("field" in filter) || !filter.value) {
                    return;
                }

                if (filter.field === "name") {
                    query.search = String(filter.value);
                }

                if (filter.field === "department") {
                    query.department = String(filter.value);
                }
            });

            return query;
        },

        mapResponse: async (response) => {
            const payload: ApiListResponse = await response.json();

            return payload.data ?? payload.subjects ?? [];
        },

        getTotalCount: async (response) => {
            const payload: ApiListResponse = await response.json();

            return payload.pagination?.total ?? payload.pagination?.totalCount ?? payload.data?.length ?? payload.subjects?.length ?? 0;
        }
    },


   
};

export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
