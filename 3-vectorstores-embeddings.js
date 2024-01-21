//1. Vectorstore ingestion

//1.1: Embeddings
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const embeddings = new OllamaEmbeddings({
  model: "mistral",
  maxConcurrency: 2,
});
console.log(embeddings);


//1.2: loading the docs(pdf)
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("./docs/hvm1-short.pdf");
const pdf = await loader.load();
console.log(pdf);


//1.3. Splitting the document into chunks
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 64,
})
const splitDocs = await splitter.splitDocuments(pdf);
console.log(splitDocs);


//1.4: In-memory vector db
import { MemoryVectorStore } from "langchain/vectorstores/memory";
const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);
console.log(vectorstore);

//1.5: retrieving docs from vectorstore
const retrieveDocs = await vectorstore.similaritySearch(
    "list types of human values.",
    4
)

const pageContents = retrieveDocs.map(doc => doc.pageContent);

console.log("---PAGE CONTENT---");
console.log(pageContents);





