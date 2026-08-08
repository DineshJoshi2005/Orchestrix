import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        artifacts: [],
        isLoading: false
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessages: (state, action) => {
            state.messages.push(action.payload)
        },
        setArtifacts: (state, action) => {
            state.artifacts = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        updateArtifactFile: (state, action) => {
            const { artifactId, fileIndex, content } = action.payload;

            const artifact = state.artifacts.find(
                artifact => artifact.id === artifactId
            );

            if (!artifact) return;

            artifact.files[fileIndex].content = content;
        }
    }
});

export const { setMessages, addMessages, setIsLoading, setArtifacts,updateArtifactFile } = messageSlice.actions;
export default messageSlice.reducer