import { forecastTool } from "../tools/forecast.tool";
import { recommendOrderTool } from "../tools/recommend-order.tool";
import { forecastExplanationTool } from "../tools/forecast-explanation.tool";

// Forecast tool test
async function forecastToolTest(){
    const result = await forecastTool.invoke({
        storeId: "S010",
        productId: "P0001",
        months: 4,
    });

    console.log(result)
    console.log(result.data)
}

async function recommendOrder(){
    const result = await recommendOrderTool.invoke({
        leadTimeDays: 7,
        storeId: "S010",
        productId: "P0001",
        months: 4,
    })
    console.log(result)
}

async function forecastExplanation(){
    const result = await forecastExplanationTool.invoke({
        storeId: "S010",
        productId: "P0001",
        months: 4,
    });

    console.log(result)
    console.log(result.data)
}
forecastToolTest()
// recommendOrder()
// forecastExplanation()
