
const marked = require('marked');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const currentWindow = remote.getCurrentWindow();
const path = require('path');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

var filePath = null;
var originalContent = '';

function updateUserInterface(isEdited) {
	var title = 'Fire Sale';
	if (filePath) {
		title = path.basename(filePath) + ' - ' + title;
	}
	if (isEdited) {
		title += ' *';
	}
	currentWindow.setTitle(title);
	currentWindow.setDocumentEdited(isEdited);
	
	saveMarkdownButton.disabled = !isEdited;
	revertButton.disabled = !isEdited;
}
function renderMarkdownToHtml(markdown) {
	htmlView.innerHTML = marked(markdown, {sanitize: true});
};

markdownView.addEventListener('keyup', (event) => {
	const currentContent = event.target.value;
	renderMarkdownToHtml(currentContent);
	updateUserInterface(currentContent !== originalContent);
});

newFileButton.addEventListener('click', () => {
	mainProcess.createWindow();
});

openFileButton.addEventListener('click', () => {
//	alert('clicked open file');
	mainProcess.getFileFromUser(currentWindow);
});

ipcRenderer.on('file-opened', (event, file, content) => {
	filePath = file;
	originalContent = content;
	
	markdownView.value = content;
	renderMarkdownToHtml(content);
	
	updateUserInterface(false);
});

console.log('renderer end');

