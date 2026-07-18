import { LLMService } from "../llm/llm.service"

async function main(){
    const llm = new LLMService()

    const answer = await llm.ask("Explain what demand forecasting is in one paragraph.")

    console.log(answer)
}

main()