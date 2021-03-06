/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const makeSerializable = require("../util/makeSerializable");

class ProvideDependency extends Dependency {
	constructor(shareScope, name, version, request, eager) {
		super();
		this.shareScope = shareScope;
		this.name = name;
		this.version = version;
		this.request = request;
		this.eager = eager;
	}

	get type() {
		return "provide module";
	}

	/**
	 * @returns {string | null} an identifier to merge equal requests
	 */
	getResourceIdentifier() {
		return `provide module (${this.shareScope}) ${this.request} as ${
			this.name
		} @ ${this.version}${this.eager ? " (eager)" : ""}`;
	}

	serialize(context) {
		context.write(this.shareScope);
		context.write(this.name);
		context.write(this.request);
		context.write(this.version);
		context.write(this.eager);
		super.serialize(context);
	}

	static deserialize(context) {
		const { read } = context;
		const obj = new ProvideDependency(read(), read(), read(), read(), read());
		this.shareScope = context.read();
		obj.deserialize(context);
		return obj;
	}
}

makeSerializable(ProvideDependency, "webpack/lib/sharing/ProvideDependency");

module.exports = ProvideDependency;
