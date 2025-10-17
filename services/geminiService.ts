import { GoogleGenAI, Modality } from "@google/genai";
import { NG_WORDS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const sanitizeAndEnhancePrompt = async (userInput: string): Promise<string> => {
    const containsNGWord = NG_WORDS.some(word => userInput.toLowerCase().includes(word.toLowerCase()));

    if (!containsNGWord) {
        return userInput;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `ユーザーが入力したおみこしのテーマは「${userInput}」です。これには著作権で保護された可能性のある言葉が含まれています。著作権を侵害しないように、このテーマからインスピレーションを得た、新しくユニークなテーマを考えてください。例えば、「ワンピースのルフィ」なら「麦わら帽子の海賊」のように。新しいテーマだけを返信してください。`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error sanitizing prompt:", error);
        // Fallback to a generic theme if sanitization fails
        return "日本の祭りのおみこし";
    }
};

export const generateOmikoshiImage = async (theme: string): Promise<string | null> => {
    try {
        const fullPrompt = `A vibrant, 2D illustration of a Japanese 'Omikoshi' portable shrine for a festival. The theme is '${theme}'. The style should be bold, colorful, and slightly cartoony, like a clip art. The background should be pure white. IMPORTANT: Do not include any text, letters, or characters in the generated image.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: fullPrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating Omikoshi image:", error);
        return null;
    }
};