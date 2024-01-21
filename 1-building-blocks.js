//--Lesson 1: Building Blocks--


//1.----Loading the LLM----

// //ollama to run llm locally
// import { Ollama } from "@langchain/community/llms/ollama";


// //selecting the llm-model
// const ollama = new Ollama({
//     baseUrl: "http://localhost:11434",
//     model: "mistral",
// });

// // const output = await ollama.invoke("code Hello World in COBOL")

// // console.log(output);
// // const t1 = performance.now();

// // console.log(`Time: ${t1 - t0}`);

// //2.----Prompt Template----

// //importing chat prompt template 
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// //method-1
// // const prompt = ChatPromptTemplate.fromMessages([
// //     SystemMessagePromptTemplate.fromTemplate(
// //         "You are an experienced senior software developer and proficient in working with Javascript, langchain, large language models, web and building generative AI web apps."
// //     ),
// //     HumanMessagePromptTemplate.fromTemplate(
// //         "How to learn about {topic}? what are the fundamental concepts ? Think step by step and list them down."
// //     )
// // ]);

// //method-2: giving the prompt
// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You are an experienced software developer proficient in many programming languages."],

//     ["human", "write hello world program in {language}"] //here {language} is the input
// ]);

// const finalPrompt = await prompt.formatMessages({
//     language: "Rust" //input
// });

// console.log(finalPrompt);


// //3.----Langchain Expression Language----

// const chain = prompt.pipe(ollama);

// const output = await chain.invoke({
//     language: "Rust"
// })

// console.log(`output before formatting:\n${output}`)

// // formatting the out by using outputParser
// import { StringOutputParser } from "@langchain/core/output_parsers";

// const outputParser = new StringOutputParser();

// //chain: prompt -> chatModel(ollama:mistral) -> outputParser.
// const newGenChain = prompt.pipe(chatModel).pipe(outputParser);

// const formattedOutput = await newGenChain.invoke({
//     language: "Rust"
// })

// console.log(formattedOutput);

// --Runnable Seq makes the chaining easy to write (this is equivalent to the pipe operation)
// import { RunnableSequence } from "@langchain/core/runnables";

// const chain = RunnableSequence.from([
//     prompt,
//     ollama,
//     outputParser
// ])

// const finalOutput = await chain.invoke()

// console.log(finalOutput);


//4.----Streaming----
//streaming the output data on the go.

// const stream = await chain.stream({
//     language: "C#"
// })

// for await (const chunk of stream) {
//     console.log(chunk);
// }

//5.----Batch----
//useful for multiple generations concurrently

// const inputs = [
//     { language: "Rust" },
//     {language: "Golang"}
// ]

// const batch = await newGenChian.batch(inputs);

// console.log(batch);


//2.----Prompt Template----

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/community/llms/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers"; //parse the output into string
// //***********************************************//
// //1
const ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "mistral",
});

// //2
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an experienced software developer proficient in many programming languages."],
    ["human", "write hello world program in {language}"]
]);

// //3
const outputParser = new StringOutputParser(); //3

// //**************************************************//

//chaining: prompt(1) -> ollama(2) -> outputParser (3)

const chain = prompt.pipe(ollama).pipe(outputParser);

const finalOutput = await chain.invoke({
    language: "Rust"
})

console.log(finalOutput);






















