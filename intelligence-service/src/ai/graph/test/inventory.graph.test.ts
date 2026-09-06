import { HumanMessage } from "@langchain/core/messages"

import { inventoryGraph } from "../inventory.graph"

async function main() {
    const result1 = await inventoryGraph.invoke({
        messages: [
            // new HumanMessage("Forecast Curd for store S010 for next 4 months")
            new HumanMessage("Forecast for S010 for 3 months")
        ]
    },{
        configurable: {
            thread_id: "user-123",
        },
    })
    const result2 = await inventoryGraph.invoke(
    {
        messages: [
            new HumanMessage(
                "for Curd"
            ),
        ],
    },
    {
        configurable: {
            thread_id: "user-123",
        },
    });
    const result3 = await inventoryGraph.invoke(
    {
        messages: [
            new HumanMessage(
                "also with 20% discount"
            ),
        ],
    },
    {
        configurable: {
            thread_id: "user-123",
        },
    });

    console.dir(result1, {
        depth: null
    })
    console.dir(result2, {
        depth: null
    })
    console.dir(result3, {
        depth: null
    })
}

main().catch(console.error)