import { Request, Response, NextFunction} from "express"
import { AppError, successResponse } from "shared";
import * as workflowService from "../services/workflow.service"
 
 
 const requireIdentity =(req:Request)=>{

    const userId = req.header('x-user-id');
    const role = req.header('x-user-role');


    if (!userId || !role){
        throw new AppError (401,"Missing  user identity ")
    }

    return {userId,role}
    
 }




export const listWorkFlows =async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{

try{
    const {userId,role} = requireIdentity(req);
    const taskId = String(req.params.taskId);

    const taskWorkflows = await workflowService.listTaskWorflowsById(userId,role,taskId)

    successResponse(res,{taskWorkflows})



}

catch(err:any) {
    next(err)
}

}