const fs = require('fs');
const fs_extra = require('fs-extra');
const path = require('path');
const execa = require('execa');

const exe_ext = process.platform === 'win32' ? ".exe" : '';

const protoc_bin = path.resolve(path.dirname(require.resolve('grpc-tools')), 'bin/protoc' + exe_ext);
const grpc_web_protoc_plugin = path.resolve(path.dirname(require.resolve('protoc-gen-grpc-web')), 'bin/protoc-gen-grpc-web' + exe_ext);

class ProtoCompileWebpackPlugin
{
    config = {}

    constructor(config)
    {
        if(!fs.existsSync(protoc_bin) || !fs.existsSync(grpc_web_protoc_plugin))
            throw new Error("Something is wrong, binaries not found on fs");

        if(!(typeof config === 'object')) throw new Error("Constructor requires config object");

        if(!config.sourceDir || !config.targetDir) throw new Error("sourceDir and targetDir are required configs");

        if(!fs.existsSync(config.targetDir)) fs.mkdirSync(config.targetDir);

        fs_extra.emptyDirSync(config.targetDir);

        this.config = config;

    }

    apply()
    {
        execa.sync(protoc_bin, [
            ...(
                Array.isArray(this.config.sourceDir) ?
                this.config.sourceDir.map(e => `-I=${e}`) : [`-I=${this.config.sourceDir}`]
            ),
            `--plugin=protoc-gen-grpc-web=${grpc_web_protoc_plugin}`,
            `--js_out=import_style=commonjs:${this.config.targetDir}`,
            `--grpc-web_out=import_style=commonjs,mode=grpcwebtext:${this.config.targetDir}`,
            ...(fs.readdirSync(this.config.sourceDir))
        ])

        console.log("OK")
    }
}

module.exports = ProtoCompileWebpackPlugin;
