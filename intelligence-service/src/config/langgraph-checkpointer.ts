import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const connectionString =
  process.env.LANGGRAPH_DATABASE_URL;
  
if (!connectionString) {
  throw new Error(
    "LANGGRAPH_DATABASE_URL is not configured"
  );
}

export const checkpointer =
  PostgresSaver.fromConnString(
    connectionString,
    {
      schema: "langgraph",
    }
  );