import { createConsumer, logger, runConsumer, TOPICS } from "shared"
import { DomainEvent } from "../utils/types";
import * as workflowsRepo from "../repositories/workflow.repo"



const handleDomain = async (rawData: DomainEvent
) => {

    if (!rawData.eventType || !rawData.taskId || !rawData.userId) {
        logger.warn({ rawData }, "Invalid domain event")
        return
    }
    const workFlow = await workflowsRepo.createWorkFlow({
        taskId: rawData.taskId,
        eventType: rawData.eventType,
        message: rawData.message || rawData.eventType,
        createdBy: rawData.userId
    })

    logger.info({workFlowId:workFlow.id,
        eventType:workFlow.event_type,

    } ,"Worflow row created")




}



export const startKafka = async () => {


    const consumer = await createConsumer(
        "workflow-service",
        "workflow-service-group"
    )

    void runConsumer(
        consumer,
        [TOPICS.TASK_EVENTS, TOPICS.MEDIA_EVENTS],
        async ({ message }) => {
            const value = message.value?.toString();
            if (!value) return;

            try {

                await handleDomain(JSON.parse(value) as DomainEvent)
            }
            catch (err) {
                logger.error({ err }, "Workflow consumer failed")
            }
        }
    )


}