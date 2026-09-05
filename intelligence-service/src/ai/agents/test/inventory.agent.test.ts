import { InventoryAgent } from "../inventory.agent";


async function main(){
    const agent = new InventoryAgent()
    // const result = await agent.ask("Forecast product P0001 for store S010 for the next 4 months.")
    // const result = await agent.ask("How many stocks should I keep for product P0001 and store S010 after 4 months")
    const result = await agent.ask("why do i need more stocks for next 4 months for product P0001 and store S010, if i add 20% discount")
    console.log(result)
}

main()