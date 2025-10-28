
import { GoogleGenAI, GenerateContentResponse, Type, GenerateContentParameters } from "@google/genai";
import { HairProfileData, SkinConditionCategory, SkincareRoutine } from '../types';
import { DERMATICS_INDIA_PRODUCTS } from "../productData";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const apiKeys = process.env.API_KEY.split(',')
    .map(key => key.trim())
    .filter(key => key);

if (apiKeys.length === 0) {
    throw new Error("API_KEY environment variable is set, but contains no valid keys.");
}

const aiInstances = apiKeys.map(apiKey => new GoogleGenAI({ apiKey }));

async function generateContentWithFailover(params: GenerateContentParameters): Promise<GenerateContentResponse> {
    let lastError: Error | null = null;

    for (let i = 0; i < aiInstances.length; i++) {
        const ai = aiInstances[i];
        try {
            const response = await ai.models.generateContent(params);
            return response;
        } catch (error) {
            lastError = error as Error;
            console.warn(`API key ${i + 1}/${aiInstances.length} failed: ${lastError.message}`);
            
            const errorMessage = lastError.message.toLowerCase();
            const isRetriable = 
                errorMessage.includes('api key not valid') ||
                errorMessage.includes('quota') ||
                errorMessage.includes('internal error') ||
                errorMessage.includes('500') || 
                errorMessage.includes('503');

            if (!isRetriable) {
                throw lastError;
            }
        }
    }

    throw new Error(`All ${aiInstances.length} API keys failed. Last error: ${lastError?.message || 'Unknown error'}`);
}


const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export interface AnalysisResponse {
    analysis: SkinConditionCategory[] | null;
    error?: 'irrelevant_image' | string | null;
    message?: string | null;
}

export const analyzeImage = async (images: File[]): Promise<AnalysisResponse> => {
    if (images.length === 0) {
        throw new Error("No images provided for analysis.");
    }
    try {
        const imageParts = await Promise.all(images.map(fileToGenerativePart));
        const textPart = {
             text: `You are an expert AI trichologist. Your primary task is to analyze images of a person's hair and scalp.

**Step 1: Image Validity Check**
First, determine if the uploaded image(s) are relevant for a hair and scalp analysis. A relevant image must clearly show a human head, hair, or scalp. Images of objects (like flowers), animals, landscapes, or other body parts are not relevant.

- If the image(s) ARE NOT RELEVANT, you MUST return a JSON object with an "error" field set to "irrelevant_image" and a user-friendly "message" explaining the issue. The "analysis" field should be null.
- If the image(s) ARE RELEVANT, proceed to Step 2. The "error" and "message" fields should be null, and the "analysis" field should contain your findings.

**Step 2: Detailed Analysis (only if images are relevant)**
Analyze these relevant images in detail. The images may show different angles (e.g., front/hairline, top/crown, temples, back). Provide one single, consolidated analysis based on all images provided.

Your task is to identify all potential conditions and characteristics from the comprehensive list below.

**Comprehensive List of Detectable Items:**

**1. Hair Loss Types:**
- **Common Types:** Androgenetic Alopecia (Genetic / Pattern Hair Loss), Telogen Effluvium (stress/illness related shedding), Anagen Effluvium (chemotherapy induced), Alopecia Areata (autoimmune, patchy bald spots), Traction Alopecia (from tight hairstyles), Cicatricial Alopecia (Scarring types), Trichotillomania (compulsive hair pulling), Diffuse Alopecia (systemic causes).
- **Types More Common in Men:** Male Pattern Baldness (receding hairline + crown thinning), Crown & Vertex Baldness.
- **Types More Common in Women:** Female Pattern Hair Loss (diffuse thinning, widened part), Postpartum Hair Loss, Menopausal Hair Loss, PCOS-related Hair Loss.

**2. Scalp Conditions & Infestations:**
- Seborrheic Dermatitis, Dandruff (Mild Seborrhea), Psoriasis, Tinea Capitis (Fungal), Folliculitis / Folliculitis Decalvans, Xerosis (Dry Scalp), Oily Scalp / Sebaceous Hypersecretion, Contact / Atopic Dermatitis, Pityriasis Amiantacea, Cradle Cap (Infant), Pediculosis Capitis (Lice / Nits), Demodex Infestation.

**3. Hair Shaft Disorders & Damage:**
- Trichorrhexis Nodosa, Monilethrix, Pili Torti, Loose Anagen Hair, Bubble Hair, Split Ends / Weathering, Color Damage, Heat Damage, Breakage.

**4. Cosmetic Quality:**
- Frizz, Porosity, Product Build-up.

**5. Hair & Scalp Typing:**
- Hair Density (Low / Medium / High), Hair Fiber Thickness (Fine / Medium / Coarse), Curl Type (1A–4C), Scalp Type (Dry / Normal / Oily / Combination).

After identifying conditions or characteristics, group them into the most relevant category from the list below. Use your expert judgment. For example, 'Androgenetic Alopecia' goes into 'Pattern Hair Loss', 'Dandruff' goes into 'Scalp Conditions', and 'Frizz' would go into 'Hair Quality'.
**Categories for Grouping:**
- 'Pattern Hair Loss'
- 'Diffuse Thinning'
- 'Patchy Hair Loss'
- 'Hairline Recession'
- 'Scalp Conditions' (Includes infestations and fungal infections like Tinea Capitis)
- 'Hair Breakage' (Includes hair shaft disorders and damage)
- 'Hair Quality' (Includes cosmetic quality issues like frizz and porosity)
- 'Hair & Scalp Type' (For hair and scalp typing characteristics)

For each specific condition or characteristic you identify, provide:
1. A 'name' (e.g., 'Androgenetic Alopecia', 'Dandruff', 'Frizz', 'High Density').
2. A 'confidence' score from 0 to 100 on how certain you are.
3. A 'location' string describing the primary area (e.g., "Crown", "Hairline", "General Scalp"). For typing, use "General Scalp".
4. An array of 'boundingBoxes'. Each box must have an 'imageId' (0-based index) and normalized coordinates (x1, y1, x2, y2). If a condition is general (like Diffuse Thinning or Hair Density) and not localized to a specific box, use a location like "General Scalp" and return an empty array for boundingBoxes.

Provide the output strictly in JSON format according to the provided schema. Be thorough. If the scalp and hair appear healthy with no issues, include a 'Healthy Hair & Scalp' category.
`
        };

        const response: GenerateContentResponse = await generateContentWithFailover({
            model: 'gemini-2.5-flash',
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.ARRAY,
                            nullable: true,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING, description: "The category of hair/scalp conditions, e.g., 'Pattern Hair Loss'." },
                                    conditions: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING, description: "The specific hair/scalp condition name, e.g., 'Androgenetic Alopecia'." },
                                                confidence: { type: Type.NUMBER, description: "The confidence score from 0 to 100." },
                                                location: { type: Type.STRING, description: "The primary scalp location of the condition, e.g., 'Crown'." },
                                                boundingBoxes: {
                                                    type: Type.ARRAY,
                                                    description: "Array of bounding boxes for this condition.",
                                                    items: {
                                                        type: Type.OBJECT,
                                                        properties: {
                                                            imageId: { type: Type.NUMBER, description: "0-based index of the image this box applies to." },
                                                            box: {
                                                                type: Type.OBJECT,
                                                                properties: {
                                                                    x1: { type: Type.NUMBER, description: "Normalized top-left x coordinate." },
                                                                    y1: { type: Type.NUMBER, description: "Normalized top-left y coordinate." },
                                                                    x2: { type: Type.NUMBER, description: "Normalized bottom-right x coordinate." },
                                                                    y2: { type: Type.NUMBER, description: "Normalized bottom-right y coordinate." }
                                                                },
                                                                required: ["x1", "y1", "x2", "y2"]
                                                            }
                                                        },
                                                        required: ["imageId", "box"]
                                                    }
                                                }
                                            },
                                            required: ["name", "confidence", "location", "boundingBoxes"]
                                        }
                                    }
                                },
                                required: ["category", "conditions"]
                            }
                        },
                        error: {
                            type: Type.STRING,
                            nullable: true,
                            description: "An error code like 'irrelevant_image' if the image is not valid."
                        },
                        message: {
                            type: Type.STRING,
                            nullable: true,
                            description: "An error message if the image is not valid."
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze hair & scalp image. Please try again.");
    }
};


export const generateRoutine = async (
    hairProfile: Partial<HairProfileData>, 
    analysis: SkinConditionCategory[], 
    goals: string[]
): Promise<{recommendation: SkincareRoutine, title: string}> => {
    
    const analysisString = analysis.map(cat => 
        `${cat.category}: ${cat.conditions.map(c => `${c.name} at ${c.location} (${c.confidence}% confidence)`).join(', ')}`
    ).join('; ');

    const goalsString = goals.join(', ');

    const productCatalogString = JSON.stringify(DERMATICS_INDIA_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        url: p.url,
        imageUrl: p.imageUrl,
        description: p.description,
        suitableFor: p.suitableFor,
        keyIngredients: p.keyIngredients,
        variantId: p.variantId,
        price: p.price,
        originalPrice: p.originalPrice
    })), null, 2);

    const prompt = `
        You are a world-class trichologist and haircare expert for the brand "Dermatics India". Your task is to create a highly personalized and effective haircare routine for a user based on their data. You MUST use products exclusively from the Dermatics India catalog provided below. Your goal is to create the *best* possible routine, recommending as many or as few steps as genuinely necessary for the user's specific conditions and goals.

        **Dermatics India Product Catalog:**
        ${productCatalogString}

        **User Data:**
        - **User Hair Profile (from questionnaire):** ${JSON.stringify(hairProfile, null, 2)}
        - **AI Hair & Scalp Analysis Results:** ${analysisString || 'Not provided. Base your recommendations solely on the questionnaire.'}
        - **Primary Haircare Goals:** ${goalsString}

        **Instructions:**
        1.  **Analyze and Select:** Carefully review all available user data. If "AI Hair & Scalp Analysis Results" are provided, use them as a primary source for understanding the user's conditions. If analysis results are not provided, you MUST rely entirely on the "User Hair Profile (from questionnaire)" to infer the user's conditions and needs. From the "Dermatics India Product Catalog", select the MOST appropriate products to build a cohesive AM and PM routine. For hair, this might be simplified to "Wash Day" and "Non-Wash Day" or just a single routine. Use your expert judgment. Pay close attention to the 'suitableFor' and 'keyIngredients' tags in the product data to match products to the user's hair conditions.
        2.  **Create the Routine:** Construct a step-by-step AM (morning) and PM (evening) routine. For each step, you must provide:
            - \`stepType\`: A single, descriptive word for the routine step (e.g., "Shampoo", "Conditioner", "Serum", "Mask", "Leave-in").
            - \`productId\`, \`variantId\`, \`productName\`, \`productUrl\`, \`productImageUrl\`, \`price\`, \`originalPrice\`: All taken directly from the catalog for the selected product.
            - \`purpose\`: A brief, personalized explanation of WHY this specific product is chosen for the user, linking it to their analysis and profile.
            - \`keyIngredients\`: An array of strings with the key ingredients for this product, taken directly from the catalog. This is **MANDATORY**.
            - \`alternatives\`: An array of suitable alternative products from the catalog. Provide these where appropriate. Include all required fields for each alternative. If no good alternatives exist, this array can be empty.
        3.  **Key Ingredients:** Based on the routine you created, identify an array of 4-5 key active ingredients from the selected products.
        4.  **Lifestyle Tips:** Provide an array of general lifestyle and wellness tips that support the user's hair goals (e.g., diet tips, styling advice, stress management).
        5.  **Disclaimer & Introduction:** Provide a standard disclaimer (mentioning consulting a dermatologist/trichologist) and a brief, encouraging introduction.
        6.  **Routine Title:** Create a short, powerful title for the plan (e.g., "Hair Regrowth & Scalp Health Plan").
        
        **Output Format:**
        Return a single JSON object. The root object must have a "title" key and a "recommendation" key. The "recommendation" object must contain "introduction", "am", "pm", "keyIngredients", "lifestyleTips", and "disclaimer". If you only create a general routine, put all steps in the "am" array and leave the "pm" array empty. DO NOT recommend any products not in the provided catalog.
    `;

    const alternativeProductSchema = {
        type: Type.OBJECT,
        properties: {
            productId: { type: Type.STRING },
            variantId: { type: Type.STRING },
            productName: { type: Type.STRING },
            productUrl: { type: Type.STRING },
            productImageUrl: { type: Type.STRING },
            price: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["productId", "variantId", "productName", "productUrl", "productImageUrl", "price", "originalPrice", "keyIngredients"]
    };

    const routineStepSchema = {
        type: Type.OBJECT,
        properties: {
            stepType: { type: Type.STRING, description: "A single, descriptive word for the routine step." },
            productId: { type: Type.STRING, description: "The exact ID of the product from the catalog." },
            variantId: { type: Type.STRING, description: "The exact Shopify variant ID for the product." },
            productName: { type: Type.STRING, description: "The full name of the recommended product." },
            productUrl: { type: Type.STRING, description: "The direct URL to the product page." },
            productImageUrl: { type: Type.STRING, description: "The direct URL to the product's image from the catalog." },
            purpose: { type: Type.STRING, description: "Why this specific product is recommended for the user." },
            alternatives: {
                type: Type.ARRAY,
                description: "An array of suitable alternative products from the catalog for this step. Can be empty.",
                items: alternativeProductSchema
            },
            price: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["stepType", "productId", "variantId", "productName", "productUrl", "productImageUrl", "purpose", "alternatives", "price", "originalPrice", "keyIngredients"]
    };

    try {
        const response = await generateContentWithFailover({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A short, powerful title for the plan." },
                        recommendation: {
                            type: Type.OBJECT,
                            properties: {
                                introduction: { type: Type.STRING, description: "A brief, encouraging intro to the plan." },
                                am: {
                                    type: Type.ARRAY,
                                    items: routineStepSchema,
                                    description: "Array of steps for the morning/main routine using Dermatics India products."
                                },
                                pm: {
                                    type: Type.ARRAY,
                                    items: routineStepSchema,
                                    description: "Array of steps for the evening/secondary routine. Can be empty."
                                },
                                keyIngredients: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Array of key ingredient names from the recommended products."
                                },
                                lifestyleTips: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Array of lifestyle and wellness tips."
                                },
                                disclaimer: {
                                    type: Type.STRING,
                                    description: "A final important disclaimer message."
                                }
                            },
                            required: ["introduction", "am", "pm", "keyIngredients", "lifestyleTips", "disclaimer"]
                        }
                    },
                    required: ["title", "recommendation"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating routine with Gemini:", error);
        throw new Error("Failed to generate haircare routine. Please try again.");
    }
};
