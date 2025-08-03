import { apiRequester, handleApiResponse } from "@/lib/API/v2/requester";
import { HandlerParams } from "./base";
import { GetGoal, PutGoal, PostGoal, PostKurangiUangGoal } from "@/types/request/goal";
import { API_ROUTES } from "@/lib/API/v2/routes";
import { Pageable } from "@/types/response/pageable";
import { GoalModel } from "@/types/model/Goal";

export const handler_PostGoal = async (params: HandlerParams, body: PostGoal) => {
    await handleApiResponse(
        apiRequester(
            API_ROUTES.GOAL.BASE,
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        ),
        params
    )
}

export const handler_GetGoal = async (params: HandlerParams<Pageable<GoalModel[]>>, reqParams: GetGoal) => {
    const url = new URL(API_ROUTES.GOAL.BASE);
    url.searchParams.set("page", String(reqParams.page));
    url.searchParams.set("size", String(reqParams.size));
    if (reqParams.keyword) url.searchParams.set("keyword", String(reqParams.keyword));
    if (reqParams.tercapai !== undefined) url.searchParams.set("tercapai", String(reqParams.tercapai));
    await handleApiResponse(
        apiRequester<Pageable<GoalModel[]>>(
            url.toString(),
            { method: "GET" }
        ),
        params
    )
}

export const handler_PutGoal = async (params: HandlerParams, data: PutGoal) => {
    const url = API_ROUTES.GOAL.BY_ID(data.id)
    const {id, ...body} = data
    await handleApiResponse (
        apiRequester(
            url.toString(),
            {
                method: "PUT",
                body: JSON.stringify(body)
            }
        ),
        params
    )
}

export const handler_DeleteGoal = async (params: HandlerParams, id: string) => {
    await handleApiResponse (
        apiRequester(
            API_ROUTES.GOAL.BY_ID(id),
            {
                method: "DELETE"
            }
        ),
        params
    )
}

export const handler_PatchSubtractGoalFunds = async(params: HandlerParams, body: PostKurangiUangGoal) => {
    const {id, uang} = body;
    await handleApiResponse (
        apiRequester (
            API_ROUTES.GOAL.PATCH(id, "subtract_funds"),
            {
                method: "PATCH",
                body: JSON.stringify({uang})
            }
        ),
        params
    );
}

export const handler_PatchAddGoalFunds = async(params: HandlerParams, body: PostKurangiUangGoal) => {
    const {id, uang} = body;
    await handleApiResponse (
        apiRequester (
            API_ROUTES.GOAL.PATCH(id, "add_funds"),
            {
                method: "PATCH",
                body: JSON.stringify({uang})
            }
        ),
        params
    );
}

export const handler_PatchGoalStatus = async(params: HandlerParams, data: {id: string; tercapai: boolean}) => {
    const {id, tercapai} = data;
    await handleApiResponse (
        apiRequester (
            API_ROUTES.GOAL.PATCH(id, "update_status"),
            {
                method: "PATCH",
                body: JSON.stringify({tercapai})
            }
        ),
        params
    );
}