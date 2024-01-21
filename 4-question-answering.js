//Cont. form 3-vectorstores-embeddings.js....

//1. Vectorstore ingestion

//1.1: loading the docs(pdf)
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("./docs/hvm1-short.pdf");
const pdf = await loader.load();
console.log(`---PDF_LOADING---`);
console.log(pdf);

//1.2: loading the embeddings model
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const embeddings = new OllamaEmbeddings({
    model: "llama2",
    baseUrl: "http://localhost:11434",
});


//1.3. Splitting the document into chunks
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 64,
})
const splitDocs = await splitter.splitDocuments(pdf);
console.log(`---SPLITTED_DOCS---`);
console.log(splitDocs);


//1.4: In-memory vector db
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorstore = new MemoryVectorStore(embeddings); //loading embeddings model
await vectorstore.addDocuments(splitDocs); //loading the splitted doc data which will be embedded


//----------------------

//2. Retrieval

//2.1: Loading the retriever
const retrievedDocs = vectorstore.asRetriever();

//2.2: format the reteivedResult into string, we would use chaining
import { RunnableSequence } from "@langchain/core/runnables"; // for chaining

const convertDocsToString = (documents) => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`;
    }).join("\n");
};

//2.3: chaining 
const documentRetrievalChain = RunnableSequence.from([
    (input) => input.question,
    retrievedDocs,
    convertDocsToString
]);

//2.4:  prompt
// const result = await documentRetrievalChain.invoke({
//     question: "List types of human values in bullet points."
// })

// console.log(`---RESULT---`);
// console.log(result);

//-----------------------

//3. Synthesizing the response in human readable form

//3.1: setting the template
import { ChatPromptTemplate } from "@langchain/core/prompts";

//creating template for the llm
const TEMPLATE_STRING = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be to the point and concise!

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;

const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
    TEMPLATE_STRING
);

//3.2 calling: context & question in parallel using runnableMap
// import { RunnableMap } from "@langchain/core/runnables";

// const runnableMap = RunnableMap.from({
//     context: documentRetrievalChain,
//     question: (input) => input.question,
// });

// const runnableMapOutput = await runnableMap.invoke({
//     question: "List types of human values."
// })

// console.log(`---RUNNABLE_MAP_OUTPUT---`);
// console.log(runnableMapOutput);

//-----------------------

//4. Augmented Generation

//4.1: setting chat-ollama and using stringParser to format output
import { Ollama } from "@langchain/community/llms/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

const ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "llama2",
});

//4.1 retrieval chain, running though all the steps
const retrievalChain = RunnableSequence.from([
    {
        context: documentRetrievalChain,
        question: (input) => input.question,
    }, //1
    answerGenerationPrompt, //2
    ollama, //3
    new StringOutputParser(), //4
]);


//4.2 giving prompt
try {
    const answer = await retrievalChain.invoke({
        question: "List types of human values."
    });
    console.log(`---FINAL_ANSWER---`);
    console.log(answer);
} catch (error) {
    console.error(error);    
}





