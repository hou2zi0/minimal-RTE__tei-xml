let Inline = Quill.import('blots/inline');

let source;

const readFile = function () {
	d3.json(CONFIG.reader.result, function (data) {
			return data;
		})
		.then(function (data) {
			source = data;
			quill.setText(source[0].text);
			return data;
		}, function (error) {
			console.log(error);
			CONFIG.fileLoaded = false;
		});
};

const CONFIG = {
	"fileLoaded": false
};

const Up = document.getElementById('poly-file')
	.addEventListener("change", (e) => {

		const filehandle = document.getElementById('poly-file')
			.files[0];
		CONFIG.reader = new FileReader();

		if (filehandle) {
			CONFIG.reader.readAsDataURL(filehandle);
		}

		CONFIG.reader.addEventListener("load", () => {
			readFile();
		}, false);
	});


class SPAN extends Inline {
	static create(value) {
		let node = super.create();
		// Sanitize url value if desired
		node.setAttribute('data-type', value[0]);
		return node;
	}
	static formats(node) {
		// We will only be called with a node already
		// determined to be a Link blot, so we do
		// not need to check ourselves
		node = {
			'annotation': node.getAttribute('data-type'),
		};
		return node;
	}
}

// Registering
SPAN.blotName = 'SPAN';
SPAN.tagName = 'span';
Quill.register(SPAN);

var quill = new Quill('#editor-container', {
	modules: {
		toolbar: true
	},
	theme: 'snow'
});



['person', 'place', 'org'].forEach((item) => {
	document.getElementById(`${item.toLowerCase()}-button`)
		.addEventListener('click', function () {
			if (quill.getFormat()
				.SPAN === undefined) {
				console.log('undef');
				let {
					index,
					length
				} = quill.getSelection();
				quill.format('SPAN', [item]);
			} else if (quill.getFormat()
				.SPAN.annotation === item) {
				let {
					index,
					length
				} = quill.getSelection();
				quill.removeFormat(index, length);
			} else {
				let {
					index,
					length
				} = quill.getSelection();
				quill.format('SPAN', [item]);
			}
		});
});


// Download
const prepareDownload = function (data, filename) {
	const content = data;
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

const formatTEI = function (editor) {
	let re = /<span data-type="(.*?)">(.*?)<\/span>/g
	editor = editor.replace(re, `<rs type="$1">$2</rs>`);
	return editor;
};

document.getElementById('download-button')
	.addEventListener('click', function () {
		console.log(quill.getContents());
		let editor = document.getElementById('editor-container')
			.getElementsByClassName('ql-editor')[0].innerHTML;
		console.log(`<doc>${editor}</doc>`);
		console.log(quill.getText());
		console.log(quill.getContents());
		const out = `<TEI>
      <teiHeader>
            <fileDesc>
                <titleStmt>
                    <title></title>
                    <editor></editor>
                </titleStmt>
                <publicationStmt>
                    <authority></authority>
                    <idno type="filename"></idno>
                    <availability status="free">
                        <licence target="">This file is provided under a. Please follow the URL to obtain further information about the license.</licence>
                    </availability>
                </publicationStmt>
                <sourceDesc>
                    <p/>
                </sourceDesc>
            </fileDesc>
        </teiHeader>
        <text>
            <body>
                <div xml:space="default">
                    ${formatTEI(editor)}
                </div>
            </body>
        </text>
    </TEI>`;

		prepareDownload(out, "bing.xml");
	});

// Prev next buttons
let current = 0;

document.getElementById('pre-button')
	.addEventListener('click', function () {
		current -= 1;
		if (current >= 0) {
			console.log(current);
			console.log(source.length);
			source[current + 1].delta = document.getElementById('editor-container')
				.getElementsByClassName('ql-editor')[0].innerHTML;
			console.log(source[current + 1].delta);
			if (source[current].delta) {
				document.getElementById('editor-container')
					.getElementsByClassName('ql-editor')[0].innerHTML = source[current].delta;
			} else {
				quill.setText(source[current].text);
			}
		} else {
			console.log('end of array');
			current = 0;
		}
	});

document.getElementById('next-button')
	.addEventListener('click', function () {
		current += 1;
		if (current < source.length) {
			console.log(current);
			console.log(source.length);
			source[current - 1].delta = document.getElementById('editor-container')
				.getElementsByClassName('ql-editor')[0].innerHTML;
			console.log(source[current - 1].delta);
			if (source[current].delta) {
				document.getElementById('editor-container')
					.getElementsByClassName('ql-editor')[0].innerHTML = source[current].delta;
			} else {
				quill.setText(source[current].text);
			}
		} else {
			console.log('end of array');
			current = source.length - 1;
		}
	});

document.getElementById('editor-container')
	.addEventListener('keydown', function (event) {
		event.stopPropagation();
	});

document.body
	.addEventListener('keydown', function (event) {
		// Add arrow key navigation through sources
		switch (event.keyCode) {
		case 37:
			console.log('Left key pressed');
			break;
		case 38:
			console.log('Up key pressed');
			break;
		case 39:
			console.log('Right key pressed');
			break;
		case 40:
			console.log('Down key pressed');
			break;
		}
	});