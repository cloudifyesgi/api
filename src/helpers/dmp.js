'use strict';

const DiffMatchPatch = require('diff-match-patch');

class Dmp {

    constructor() {
        this.dmp = new DiffMatchPatch();
    }

    patch(text1, text2) {
        const diff    = this.dmp.diff_main(text1, text2);
        const patches = this.dmp.patch_make(diff);
        return  this.dmp.patch_apply(patches, text1);
    }
}

module.exports = new Dmp();
