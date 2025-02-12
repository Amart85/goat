import {
    type GetToolsParams,
    type ToolBase,
    type WalletClientBase,
    addParametersToDescription,
    getTools,
} from "@goat-sdk/core";

import { tool } from "@langchain/core/tools";
import type { z } from "zod";

export type GetOnChainToolsParams<TWalletClient extends WalletClientBase> = GetToolsParams<TWalletClient>;

export async function getOnChainTools<TWalletClient extends WalletClientBase>({
    wallet,
    plugins,
}: GetOnChainToolsParams<TWalletClient>) {
    const tools: ToolBase[] = await getTools({ wallet, plugins });

    return tools.map((t) =>
        tool(
            async (arg: z.output<typeof t.parameters>) => {
                return await t.execute(arg);
            },
            {
                name: t.name,
                description: addParametersToDescription(t.description, t.parameters),
                schema: t.parameters,
            },
        ),
    );
}
