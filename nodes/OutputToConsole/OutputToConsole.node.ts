/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */

import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	AssignmentCollectionValue,
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
			},
			{
				displayName: 'Fields to Set',
				name: 'assignments',
				type: 'assignmentCollection',
				default: {},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let textToOutput = '';

		for (let i = 0; i < items.length; i++) {
			const outputHelper = new OutputUtilities();
			const assignmentCollection = this.getNodeParameter('assignments',i,) as AssignmentCollectionValue;
			const assignments = assignmentCollection?.assignments ?? [];
			const templateBase = (items.length > 1 ) ?  outputHelper.multiItemTemplate : outputHelper.singleItemTemplate;

			assignments.forEach((assignment) => {
				outputHelper.appendLine(outputHelper.formatOutput(assignment.value));
			});

			textToOutput += templateBase(outputHelper.messages.join(`\n-------------------------------------------\n\n`).trimEnd(), i + 1);
		}

		this.sendMessageToUI(textToOutput);

		return [this.helpers.returnJsonArray(items)];
	}
}
