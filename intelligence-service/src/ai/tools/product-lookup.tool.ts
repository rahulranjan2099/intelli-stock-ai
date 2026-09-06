import { tool } from "@langchain/core/tools"
import { z } from "zod"

import { ProductService } from "../../services/product-lookup.service"

const productService = new ProductService()

export const productLookupTool = tool(
    async ({ name }) => {
        const products = await productService.findByName(name)

        if(!products.length){
            return {
                found: false,
                message: `No products found for ${name}`
            }
        }
        return {
            found: true,
            products
        }
    }, {
        name: 'product_lookup',
        description: "Find a product ID from a product name. Use this when the user gives a product name instead of a product ID.",
        schema: z.object({
            name: z.string().min(1)
        })
    }
)