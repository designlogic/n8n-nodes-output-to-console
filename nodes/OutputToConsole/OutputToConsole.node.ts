/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */

import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { OutputUtilities } from './OutputUtilities';

export class OutputToConsole implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Output to Console',
		name: 'outputToConsole',
		icon: 'file:terminal.svg',
		group: ['transform'],
		version: 1,
		description: 'Outputs data to the browser console',
		defaults: {
			name: 'Output To Console',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Text To Output',
				name: 'textToOutput',
				type: 'json',
				default: '',
				description: 'The text to output to the browser console',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const separator = '=====================';
		const outputHelper = new OutputUtilities();

		for (let i = 0; i < items.length; i++) {

			let textToOutput = this.getNodeParameter('textToOutput', i);
			textToOutput = outputHelper.formatOutput(textToOutput);

			let message = `\n\n${separator}\n\n`;
			message += `${textToOutput}`;
			message += `\n\n${separator}\n\n`;

			this.sendMessageToUI(message);
		}

		return [this.helpers.returnJsonArray(items)];
	}
}
