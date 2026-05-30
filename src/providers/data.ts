import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse, CreateResponse } from "@/types";
import {  HttpError } from "@refinedev/core";

type ApiListResponse<T = unknown> = ListResponse<T> & {
    subjects?: T[];
    pagination?: ListResponse<T>["pagination"] & {
        totalCount?: number;
    };
};

const buildHttpError = async (response: Response) : Promise<HttpError> => {
    let message ="Request Failed"

    try {
        const payload = await response.json() as {message?: string}
        if(payload?.message) message = payload.message;
    } catch  {
        // Ifgnore errors
    }

    return{
        message,
        status: response.status,
    }

}

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
            if(!response.ok) throw await buildHttpError(response);
            const payload: ApiListResponse = await response.json();

            return payload.data ?? payload.subjects ?? [];
        },

        getTotalCount: async (response) => {
            if(!response.ok) throw await buildHttpError(response);
            const payload: ApiListResponse = await response.json();

            return payload.pagination?.total ?? payload.pagination?.totalCount ?? payload.data?.length ?? payload.subjects?.length ?? 0;
        }
    },

    create:{
        getEndpoint:({resource}) => resource,

        buildBodyParams: async({variables}) => variables,

        mapResponse: async (response) => {
            const json: CreateResponse = await response.json();

            return json.data??[];
        }
    }

   
};


export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
