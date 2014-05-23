module.exports = {
	name: 'image',
	template: 'image',
	validator: null,
	placeholder: '',
	preview: function(value) {

		try { var parsed_data = JSON.parse(value) } 
		catch (e) { return "" }

		return '<h4><i class="muted large icon-picture"></i></h4>';
	},
	deflate: function(field, item, models, callback) {
		if (!item.data[field.name]) return callback('');
		var json_string;
		if (typeof item.data[field.name] === 'object') {
			json_string = JSON.stringify(item.data[field.name]);
		}
		callback(json_string || item.data[field.name]);
	},
	inflate: function(field, item, models, callback) {

		if (!item.data[field.name]) return callback(null);

		try { var parsed_data = JSON.parse(item.data[field.name]); }
		catch (e) {
			console.log("couldn't parse image list data");
			return callback([]);
		}

		if (!parsed_data) return callback(null);
		var file_id = parsed_data.file_id;

		models.files.find({ where: { id: file_id } })
			.error(console.warn)
			.success(function(file) {

				file = JSON.parse(JSON.stringify(file));

				file.url = "/files/" + file.path;
				file.file_id = file.id;
				delete file.id;
				delete file.path;
				delete file.item_id;
				delete file.meta_json;
				delete file.description;

				callback(file);
			});
	}
};

