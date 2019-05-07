let Inline = Quill.import('blots/inline');

class PLACE extends Inline {
	static create(value) {
		let node = super.create();
		// Sanitize url value if desired
		node.setAttribute('data-annotation', 'PLACE');
		node.setAttribute('data-start', value[0]);
		node.setAttribute('data-end', value[1]);
		return node;
	}
	static formats(node) {
		// We will only be called with a node already
		// determined to be a Link blot, so we do
		// not need to check ourselves
		node = {
			'a': node.getAttribute('data-annotation'),
			'b': node.getAttribute('data-start'),
			'c': node.getAttribute('data-end')
		};
		return node;
	}
}

PLACE.blotName = 'PLACE';
PLACE.tagName = 'span';

class RsStringBlot extends Inline {
	static create(value) {
		let node = super.create();
		// Sanitize url value if desired
		node.setAttribute('data-type', value);
		return node;
	}
	static formats(node) {
		// We will only be called with a node already
		// determined to be a Link blot, so we do
		// not need to check ourselves
		return node.getAttribute('data-type');
	}
}
RsStringBlot.blotName = 'rsString';
RsStringBlot.tagName = 'span';

Quill.register(RsStringBlot);
Quill.register(PLACE);

var quill = new Quill('#editor-container', {
	modules: {
		toolbar: true
	},
	theme: 'snow'
});

rs_string_func = function (rs_string_button) {
	document.getElementById(`${rs_string_button}-button`)
		.addEventListener('click', function () {
			if (quill.getFormat()
				.rsString === rs_string_button) {
				let {
					index,
					length
				} = quill.getSelection();
				quill.removeFormat(index, length);
			} else {
				quill.format('rsString', rs_string_button);
			}
		});
};

const rs_string_buttons = ['place', 'person', 'org'];

rs_string_buttons.forEach(function (element) {
	rs_string_func(element);
});


document.getElementById(`blockquote-button`)
	.addEventListener('click', function () {
		if (quill.getFormat()
			.PLACE === 'bq') {
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
			quill.format('PLACE', [index, index + length]);
		}
	});


document.getElementById('download-button')
	.addEventListener('click', function () {
		console.log(quill.getContents());
		let editor = document.getElementById('editor-container')
			.getElementsByClassName('ql-editor')[0].innerHTML;
		console.log(`<doc>${editor}</doc>`);
	});