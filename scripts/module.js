Hooks.once('init', async function() {
    TextEditor.create = async function (options={}, content="") {
        const mceConfig = mergeObject(CONFIG.TinyMCE, options, {inplace: false});
        mceConfig.target = options.target;

        // The patch
        mceConfig.file_picker_callback = function (pickerCallback, value, meta) {
            var filePicker = new FilePicker({
                callback: path => {
                    pickerCallback(path);
                },
            });
            filePicker.render();
        };

        if ( mceConfig.content_css instanceof Array ) {
            mceConfig.content_css = mceConfig.content_css.map(c => getRoute(c)).join(",");
        }
        mceConfig.init_instance_callback = editor => {
            const window = editor.getWin();
            if ( content ) editor.setContent(content);
            window.addEventListener("wheel", event => {
            if ( event.ctrlKey ) event.preventDefault();
            }, {passive: false});
            window.addEventListener("drop", ev => this._onDropEditorData(ev, editor))
        };
    
        const editors = await tinyMCE.init(mceConfig);
        console.log(editors);
        return editors[0];
    }
});
