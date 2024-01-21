//--Lesson 2 : Loading and preparing data--

//1. Loading

//1.1 : github docs loader
// import { GithubRepoLoader } from "langchain/document_loaders/web/github";

// import ignore from "ignore";

// loading github doc & will not include anything under "ignorePaths"
// const loader = new GithubRepoLoader(
//     "https://github.com/langchain-ai/langchainjs",
//     {
//         recursive: false,
//         ignorePaths: ["*.md", "yarn.lock"]
//     }
// );

// const docs = await loader.load();

// console.log(docs);

//-----------
//1.2 : loading pdf
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("./docs/hvm1-short.pdf");

const pdf = await loader.load();

//------------
//2. Splitting

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 64,
})

const codeSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
    chunkSize: 32,
    chunkOverlap: 0,
})

const code = `let recursiveFunction = function (arr, x, start, end) {

	// Base Condition
	if (start > end) return false;

	// Find the middle index
	let mid = Math.floor((start + end) / 2);

	// Compare mid with given key x
	if (arr[mid] === x) return true;

	// If element at mid is greater than x,
	// search in the left half of mid
	if (arr[mid] > x)
		return recursiveFunction(arr, x, start, mid - 1);
	else

		// If element at mid is smaller than x,
		// search in the right half of mid
		return recursiveFunction(arr, x, mid + 1, end);
}

// Driver code
let arr = [1, 3, 5, 7, 8, 9];
let x = 5;

if (recursiveFunction(arr, x, 0, arr.length - 1)) {
	console.log("Element found!");
}
else { console.log("Element not found!"); }

x = 6;

if (recursiveFunction(arr, x, 0, arr.length - 1)) {
	console.log("Element found!");
}
else { console.log("Element not found!"); }
`

const output = await splitter.splitDocuments(pdf);
const codeOutput = await codeSplitter.splitText(code);

console.log(codeOutput);


