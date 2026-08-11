import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res, next) => {
    try {
        console.log("========== AGENT REQUEST START ==========");

        const { prompt, conversationId, agent } = req.body;
        const file = req.file;
        const userId = req.headers["x-user-id"];

        console.log("Request Details:", {
            prompt,
            conversationId,
            agent,
            userId,
            hasFile: !!file,
            fileName: file?.originalname,
            fileType: file?.mimetype
        });

        console.log("1. Saving user message to CHAT SERVICE");

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt
        });

        console.log("2. User message saved successfully");

        console.log("3. Starting graph execution");

        const graphStartTime = Date.now();

        const result = await graph.invoke({
            prompt,
            conversationId,
            agent,
            userId,
            file
        });

        const graphTime = Date.now() - graphStartTime;

        console.log("4. Graph completed successfully");
        console.log("Graph execution time:", graphTime, "ms");
        console.log("Graph Result:", result);

        console.log("5. Adding user message to memory");

        await addMessage(
            conversationId,
            "user",
            prompt
        );

        console.log("6. User message added to memory");

        console.log("7. Adding assistant message to memory");

        await addMessage(
            conversationId,
            "assistant",
            result.aiResponse
        );

        console.log("8. Assistant message added to memory");

        console.log("9. Saving assistant message to CHAT SERVICE");

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "assistant",
            content: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts
        });

        console.log("10. Assistant message saved to CHAT SERVICE");

        console.log("11. Sending response to frontend");

        const response = {
            answer: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts
        };

        console.log("Response:", response);

        console.log("========== AGENT REQUEST SUCCESS ==========");

        return res.status(200).json(response);

    } catch (error) {
        console.error("========== AGENT REQUEST FAILED ==========");

        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Error Response:", error.response?.data);
        console.error("Error Status:", error.response?.status);

        next(error);
    }
};