import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse, CreateResponse, GetOneResponse } from "@/types";
import {  HttpError } from "@refinedev/core";

type ApiListResponse<T = unknown> = ListResponse<T> & {
    subjects?: T[];
    classes?: T[];
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

    return {
        message,
        status: response.status,
        statusCode: response.status,
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
                if (!("field" in filter) || filter.value === undefined || filter.value === null || filter.value === "") {
                    return;
                }

                if (filter.field === "name") {
                    query.search = String(filter.value);
                    return;
                }

                if (filter.field === "department") {
                    query.department = String(filter.value);
                    return;
                }

                if (filter.field === "subject") {
                    query.subject = String(filter.value);
                    return;
                }

                if (filter.field === "teacher") {
                    query.teacher = String(filter.value);
                    return;
                }

                if (filter.field === "role") {
                    query.role = String(filter.value);
                    return;
                }

                query[String(filter.field)] = String(filter.value);
            });

            return query;
        },

        mapResponse: async (response) => {
            if(!response.ok) throw await buildHttpError(response);
            const payload: ApiListResponse = await response.json();

            return payload.data ?? payload.subjects ?? payload.classes ?? [];
        },

        getTotalCount: async (response) => {
            if(!response.ok) throw await buildHttpError(response);
            const payload: ApiListResponse = await response.json();

            return payload.pagination?.total ?? payload.pagination?.totalCount ?? payload.data?.length ?? payload.subjects?.length ?? payload.classes?.length ?? 0;
        }
    },

    create:{
        getEndpoint:({resource}) => resource,

        buildBodyParams: async({variables}) => variables,

        mapResponse: async (response) => {
            const json: CreateResponse = await response.json();

            return json.data??[];
        }
    },

    getOne: {
        getEndpoint:({ resource,id }) => `${resource}/${id}`,


        mapResponse: async(response) =>{
            const json : GetOneResponse = await response.json();

            return json.data ?? json ;
        }
    }

   
};


export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
